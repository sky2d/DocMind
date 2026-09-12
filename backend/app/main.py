from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.conversations import router as conversations_router
from app.core.exceptions import AppException, app_exception_handler

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for RAG application",
    version="1.0.0",
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(conversations_router, prefix="/api/conversations", tags=["conversations"])

@app.get("/")
async def root():
    return {"message": "Welcome to DocMind API"}
