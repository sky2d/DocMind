from abc import ABC, abstractmethod
from typing import List, Dict, Any

class VectorRepository(ABC):
    """
    Abstract interface for vector database operations.
    This ensures that the rest of the application doesn't depend directly on pgvector,
    even though pgvector will be the concrete implementation.
    """
    
    @abstractmethod
    async def insert_embedding(self, document_id: str, chunk_index: int, text: str, embedding: List[float], metadata: Dict[str, Any] = None):
        """Insert a single text chunk and its embedding."""
        pass
        
    @abstractmethod
    async def insert_embeddings(self, embeddings_data: List[Dict[str, Any]]):
        """Batch insert embeddings."""
        pass

    @abstractmethod
    async def search_similar_chunks(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """Search for chunks similar to the query embedding."""
        pass
