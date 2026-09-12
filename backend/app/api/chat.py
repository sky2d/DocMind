from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.db.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    user_id = uuid.UUID(user_id_str)
    
    # In Phase 6 (RAG Orchestration), this will call a ChatService
    # For now, we return a mocked response matching the Vercel AI SDK structure.
    
    return ChatResponse(
        answer="This is a mocked response from the backend. Real RAG logic will be implemented in Phase 6.",
        sources=[]
    )
