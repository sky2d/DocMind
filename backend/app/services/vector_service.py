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

    async def similarity_search(self, document_ids: List[uuid.UUID], query_embedding: List[float], limit: int = 5) -> List[DocumentChunk]:
        """
        Uses pgvector's cosine distance operator (<->) to find the most relevant chunks.
        Filters by document_ids to only search within the allowed documents.
        """
        from sqlalchemy import select
        
        stmt = (
            select(DocumentChunk)
            .where(DocumentChunk.document_id.in_(document_ids))
            .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
            .limit(limit)
        )
        
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
