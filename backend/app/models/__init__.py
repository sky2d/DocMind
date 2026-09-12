from app.models.base import Base
from app.models.user import User
from app.models.document import Document
from app.models.chat import Conversation, Message

# Expose models for Alembic and other parts of the app
__all__ = ["Base", "User", "Document", "Conversation", "Message"]
