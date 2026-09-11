from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import UploadFile
import uuid
from app.models.document import Document
from app.core.exceptions import NotFoundError, DocumentProcessingError
from app.services.parser_service import PDFParserService
from app.services.cleaner_service import TextCleanerService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def upload_document(self, user_id: uuid.UUID, file: UploadFile) -> Document:
        if not file.filename:
            raise DocumentProcessingError("Filename cannot be empty")
            
        # 1. Save document reference to DB as 'processing'
        doc = Document(
            user_id=user_id,
            filename=file.filename,
            status="processing"
        )
        self.db.add(doc)
        await self.db.commit()
        await self.db.refresh(doc)
        
        try:
            # 2. Read the raw bytes
            file_bytes = await file.read()
            
            # 3. Parse PDF to Text
            raw_text = PDFParserService.extract_text_from_bytes(file_bytes)
            
            # 4. Clean the Text
            cleaned_text = TextCleanerService.clean_text(raw_text)
            
            # 5. Chunk the Text
            chunker = ChunkingService(chunk_size=500, chunk_overlap=50)
            chunks = chunker.split_text(cleaned_text)
            
            # 6. Generate Embeddings
            print(f"Generating embeddings for {len(chunks)} chunks...")
            embeddings = EmbeddingService.generate_embeddings(chunks)
            
            # 7. Store Chunks & Vectors in DB
            print("Storing vectors in pgvector...")
            vector_service = VectorService(self.db)
            await vector_service.store_chunks(doc.id, chunks, embeddings)
            
            # 8. Mark as completed
            doc.status = "completed"
            await self.db.commit()
            await self.db.refresh(doc)
            
        except Exception as e:
            doc.status = "failed"
            await self.db.commit()
            raise DocumentProcessingError(f"Pipeline failed: {str(e)}")
            
        return doc

    async def get_user_documents(self, user_id: uuid.UUID) -> list[Document]:
        stmt = select(Document).where(Document.user_id == user_id).order_by(Document.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_document(self, document_id: uuid.UUID, user_id: uuid.UUID) -> Document:
        stmt = select(Document).where(Document.id == document_id, Document.user_id == user_id)
        result = await self.db.execute(stmt)
        doc = result.scalars().first()
        if not doc:
            raise NotFoundError("Document not found")
        return doc
