from pydantic import BaseModel, UUID4
from typing import List, Optional, Any

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    document_ids: Optional[List[UUID4]] = None
    conversation_id: Optional[UUID4] = None

class SourceNode(BaseModel):
    document_id: UUID4
    filename: str
    chunk_index: int
    text_snippet: str
    score: float

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceNode] = []
