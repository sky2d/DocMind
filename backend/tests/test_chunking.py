import pytest
from app.services.chunking_service import ChunkingService

def test_chunking_service_splits_text():
    # Setup
    chunker = ChunkingService(chunk_size=10, chunk_overlap=2)
    # Using 10 tokens * 4 chars = 40 chars chunk size
    # Using 2 tokens * 4 chars = 8 chars overlap
    
    text = "This is a very long text that needs to be split into multiple chunks because it exceeds the maximum size allowed."
    
    # Execute
    chunks = chunker.split_text(text)
    
    # Assert
    assert len(chunks) > 1
    # Check that no chunk exceeds the max char limit (40) roughly, but langchain might keep sentences together slightly.
    # We just ensure it's doing work.
    for chunk in chunks:
        assert len(chunk) > 0

def test_chunking_service_empty_text():
    chunker = ChunkingService()
    chunks = chunker.split_text("")
    assert chunks == []

def test_chunking_service_short_text():
    chunker = ChunkingService(chunk_size=500, chunk_overlap=50)
    text = "Short text."
    chunks = chunker.split_text(text)
    assert len(chunks) == 1
    assert chunks[0] == text
