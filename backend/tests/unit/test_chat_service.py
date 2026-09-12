import pytest
from unittest.mock import AsyncMock
from app.services.chat_service import ChatService
import uuid
from types import SimpleNamespace

@pytest.fixture
def chat_service():
    mock_db = AsyncMock()
    user_id = uuid.uuid4()
    return ChatService(db=mock_db, user_id=user_id)

def test_build_system_prompt(chat_service):
    # Mock some chunks
    mock_chunks = [
        SimpleNamespace(document_id=uuid.uuid4(), text="First piece of information."),
        SimpleNamespace(document_id=uuid.uuid4(), text="Second piece of information.")
    ]
    
    # Call the prompt builder
    prompt = chat_service._build_system_prompt(mock_chunks)
    
    # Verify the chunks were injected correctly
    assert "First piece of information." in prompt
    assert "Second piece of information." in prompt
    assert "You are a helpful AI assistant" in prompt
