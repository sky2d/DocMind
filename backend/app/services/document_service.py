from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import UploadFile
import uuid
from app.models.document import Document
from app.core.exceptions import NotFoundError, DocumentProcessingError

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def upload_document(self, user_id: uuid.UUID, file: UploadFile) -> Document:
        """
        Save the file reference to the database and schedule/process it.
        In Phase 5, we will actually parse and embed it here.
        """
        # Read the file (or just create a record for now)
        if not file.filename:
            raise DocumentProcessingError("Filename cannot be empty")
            
        doc = Document(
            user_id=user_id,
            filename=file.filename,
            status="pending"
        )
        
        self.db.add(doc)
        await self.db.commit()
        await self.db.refresh(doc)
        
        # Here we would normally trigger a background task for RAG ingestion
        # e.g., background_tasks.add_task(ingest_document, doc.id)
        
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
