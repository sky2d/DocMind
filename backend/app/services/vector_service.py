from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from app.models.document import DocumentChunk

class VectorService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def store_chunks(self, document_id: uuid.UUID, chunks: List[str], embeddings: List[List[float]]):
        """
        Saves the text chunks and their corresponding embeddings into the pgvector database.
        """
        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks and embeddings must match")

        document_chunks = []
        for index, (text, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_record = DocumentChunk(
                document_id=document_id,
                chunk_index=index,
                text=text,
                embedding=embedding
            )
            document_chunks.append(chunk_record)

        # Bulk insert the chunks
        self.db.add_all(document_chunks)
        await self.db.commit()
