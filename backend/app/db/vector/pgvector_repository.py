from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete
from pgvector.sqlalchemy import Vector

from app.db.vector.repository import VectorRepository
from app.models.document import DocumentChunk

class PgVectorRepository(VectorRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def insert_embedding(self, document_id: str, chunk_index: int, text: str, embedding: List[float], metadata: Dict[str, Any] = None):
        """Insert a single text chunk and its embedding."""
        chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=chunk_index,
            text=text,
            embedding=embedding,
            metadata_=metadata or {}
        )
        self.session.add(chunk)
        await self.session.commit()
        await self.session.refresh(chunk)
        return chunk
        
    async def insert_embeddings(self, embeddings_data: List[Dict[str, Any]]):
        """Batch insert embeddings.
        embeddings_data should be a list of dicts with keys: document_id, chunk_index, text, embedding, metadata_
        """
        if not embeddings_data:
            return
            
        stmt = insert(DocumentChunk).values(embeddings_data)
        await self.session.execute(stmt)
        await self.session.commit()

    async def search_similar_chunks(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """Search for chunks similar to the query embedding using L2 distance."""
        # Using L2 distance (`l2_distance`) for the similarity search.
        # Alternatively, we can use `cosine_distance` or `max_inner_product`.
        # Assuming `query_embedding` is already normalized if using cosine distance.
        stmt = select(DocumentChunk).order_by(
            DocumentChunk.embedding.l2_distance(query_embedding)
        ).limit(limit)
        
        result = await self.session.execute(stmt)
        chunks = result.scalars().all()
        
        return [
            {
                "id": str(chunk.id),
                "document_id": str(chunk.document_id),
                "chunk_index": chunk.chunk_index,
                "text": chunk.text,
                "metadata": chunk.metadata_
            }
            for chunk in chunks
        ]

    async def delete_document_chunks(self, document_id: str):
        """Delete all chunks for a specific document."""
        stmt = delete(DocumentChunk).where(DocumentChunk.document_id == document_id)
        await self.session.execute(stmt)
        await self.session.commit()
