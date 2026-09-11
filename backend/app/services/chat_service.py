import json
from groq import AsyncGroq
from app.core.config import settings
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.schemas.chat import ChatRequest, Message, SourceNode
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

class ChatService:
    def __init__(self, db: AsyncSession, user_id: uuid.UUID):
        self.db = db
        self.user_id = user_id
        # Initialize Groq client
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.full_response_text = ""

    async def _get_context(self, document_ids: list[uuid.UUID], query: str):
        # 1. Embed the query
        query_embedding = EmbeddingService.generate_embeddings([query])[0]
        
        # 2. Retrieve relevant chunks
        vector_service = VectorService(self.db)
        chunks = await vector_service.similarity_search(document_ids, query_embedding, limit=5)
        return chunks

    def _build_system_prompt(self, chunks) -> str:
        context_text = "\n\n---\n\n".join(
            [f"Source {i+1} (Document {c.document_id}):\n{c.text}" for i, c in enumerate(chunks)]
        )
        
        return (
            "You are a helpful AI assistant answering questions based on the provided documents. "
            "Use the context below to answer the user's question accurately. "
            "If the answer is not contained in the context, politely inform the user that you don't know based on the documents provided.\n\n"
            "CONTEXT:\n"
            f"{context_text}"
        )

    async def generate_response_stream(self, request: ChatRequest):
        # Get the latest user query
        user_query = request.messages[-1].content
        
        # Retrieve context chunks
        chunks = []
        if request.document_ids:
            chunks = await self._get_context(request.document_ids, user_query)
            
        # Build the LLM prompt
        system_prompt = self._build_system_prompt(chunks)
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        # Vercel AI SDK expects SSE streams formatting like:
        # 0:"string part"
        # We will yield chunks formatted like that.
        
        stream = await self.client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192", # Groq's fast Llama 3 model
            stream=True,
            temperature=0.3
        )

        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                self.full_response_text += content
                # Format exactly as Vercel AI SDK experimental `streamText` expects.
                # Format: 0:"content"\n
                encoded = json.dumps(content)
                yield f'0:{encoded}\n'

    async def save_conversation(self, request: ChatRequest):
        from app.models.chat import Conversation, Message
        from sqlalchemy import select
        import uuid
        
        conv_id = request.conversation_id or uuid.uuid4()
        
        # Check if conversation exists
        result = await self.db.execute(select(Conversation).where(Conversation.id == conv_id))
        conv = result.scalar_one_or_none()
        
        if not conv:
            conv = Conversation(
                id=conv_id, 
                user_id=self.user_id, 
                title=request.messages[-1].content[:100]
            )
            self.db.add(conv)
            
        # Add user message
        user_msg = Message(
            conversation_id=conv_id,
            role="user",
            content=request.messages[-1].content
        )
        self.db.add(user_msg)
        
        # Add assistant message
        assistant_msg = Message(
            conversation_id=conv_id,
            role="assistant",
            content=self.full_response_text,
            metadata_={} # Can store retrieved chunk IDs here in future
        )
        self.db.add(assistant_msg)
        
        await self.db.commit()
