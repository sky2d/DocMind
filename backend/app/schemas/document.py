from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional, List, Dict, Any

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: UUID4
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    metadata_: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
