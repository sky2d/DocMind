from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.db.session import get_db
from app.schemas.chat import ChatRequest
from app.core.security import get_current_user
from app.services.chat_service import ChatService

router = APIRouter()

@router.post("/")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    user_id = uuid.UUID(user_id_str)
    
    chat_service = ChatService(db)
    
    return StreamingResponse(
        chat_service.generate_response_stream(request),
        media_type="text/event-stream"
    )
