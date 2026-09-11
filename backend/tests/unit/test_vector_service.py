import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.vector_service import VectorService
import uuid

@pytest.mark.asyncio
async def test_similarity_search():
    # Mock the database session
    mock_db = AsyncMock()
    
    # Mock the result of db.execute
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = ["mock_chunk_1", "mock_chunk_2"]
    mock_db.execute.return_value = mock_result
    
    # Initialize the service
    vector_service = VectorService(db=mock_db)
    
    # Test inputs
    test_doc_ids = [uuid.uuid4()]
    test_embedding = [0.1] * 384  # Mock 384-dimensional embedding
    
    # Call the method
    chunks = await vector_service.similarity_search(document_ids=test_doc_ids, query_embedding=test_embedding, limit=2)
    
    # Verify the results
    assert len(chunks) == 2
    assert chunks[0] == "mock_chunk_1"
    
    # Verify the DB was called
    mock_db.execute.assert_called_once()
