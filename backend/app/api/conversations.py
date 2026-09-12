from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.chat import Conversation, Message
import uuid

router = APIRouter()

@router.get("")
async def get_conversations(
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    user_id = uuid.UUID(user_id_str)
    # Fetch conversations for the user ordered by created_at desc
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
    )
    conversations = result.scalars().all()
    return [{"id": str(c.id), "title": c.title, "created_at": c.created_at} for c in conversations]

@router.get("/{conversation_id}")
async def get_conversation_messages(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    # Fetch messages for a specific conversation
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    messages = result.scalars().all()
    return [{"id": str(m.id), "role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]
