from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.db.session import get_db
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.services.document_service import DocumentService
from app.core.security import get_current_user

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    user_id = uuid.UUID(user_id_str)
    service = DocumentService(db)
    
    # Let the service handle the business logic
    doc = await service.upload_document(user_id, file)
    return doc

@router.get("/", response_model=DocumentListResponse)
async def get_documents(
    db: AsyncSession = Depends(get_db),
    user_id_str: str = Depends(get_current_user)
):
    user_id = uuid.UUID(user_id_str)
    service = DocumentService(db)
    
    docs = await service.get_user_documents(user_id)
    return DocumentListResponse(documents=docs)
