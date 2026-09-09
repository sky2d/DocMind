# Project Overview

Project name: `rag-project`

This will eventually be a personal document-based RAG application.

## Goals
[PLANNED] Create a personal document-based RAG application.

## Technology Stack
[PLANNED] 
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, SQLAlchemy ORM
- **Database**: Supabase PostgreSQL, pgvector
- **Embeddings**: sentence-transformers (`all-MiniLM-L6-v2`, 384 dim)
- **LLM**: Provider-agnostic abstraction

## High-Level Architecture
[PLANNED] 
The application follows a decoupled architecture where the FastAPI backend serves as the primary data access and orchestration layer, while the Next.js frontend handles user interactions. The vector storage and relational data are both handled by Supabase PostgreSQL but are logically separated in the backend repositories.

## Frontend Architecture
[PLANNED] 
Responsible for:
- User interface
- Document upload interface
- Chat interface
- Displaying answers
- Displaying sources
- Communicating with FastAPI

Must NOT contain:
- RAG logic
- Embedding logic
- Database logic
- Vector search logic
- LLM orchestration

## FastAPI Architecture
[PLANNED] 
Responsible for:
- HTTP API
- Request validation
- Response validation
- Orchestration
- Authentication integration later
- Invoking application services

Routes must remain thin. Do not place business logic inside route handlers.

## SQLAlchemy ORM Architecture
[PLANNED] 
SQLAlchemy is the primary ORM. It handles:
- Users, documents, document metadata, conversations, messages, relationships, application data
- Relational queries, CRUD operations, relationships, transactions, database models

Database access should be isolated from business logic.

## Supabase PostgreSQL Architecture
[PLANNED] 
Provides PostgreSQL for relational data and pgvector for embeddings.

## pgvector Architecture
[PLANNED] 
Used for:
- Storing embeddings
- Vector similarity search
- Nearest-neighbor search
- Vector distance calculations
- Vector indexes

Vector-specific operations will live behind a dedicated repository/service boundary. Raw SQL may be used where necessary but must be parameterized, isolated, documented, and kept out of API route handlers.

## Database Responsibility Boundaries
[PLANNED] 
- **SQLAlchemy repositories**: Relational PostgreSQL data.
- **Vector repository**: pgvector data.

## Document Ingestion Pipeline
[FUTURE / OPTIONAL] 
Document -> Document Parser -> Text Cleaning -> Chunking -> Embedding Generation -> PostgreSQL + pgvector

## RAG Query Pipeline
[FUTURE / OPTIONAL] 
User Question -> Question Embedding -> Vector Retrieval -> Relevant Chunks -> Prompt Construction -> LLM -> Answer + Sources

## Chunking Strategy
[PLANNED] 
Recursive Text Chunking with Overlap.
- Chunk size: approximately 500 tokens
- Overlap: approximately 50 tokens

## Why Recursive Chunking
[CURRENT FOUNDATION] 
- Simple, deterministic, and inexpensive
- Works across multiple document types
- Generally preserves paragraphs and sentence boundaries better than naive fixed-size splitting
- Does not require an LLM during ingestion
- Easy to test and tune
- Provides a strong baseline for later experimentation

## Embedding Strategy
[PLANNED] 
- Initial embedding model: `all-MiniLM-L6-v2`
- Expected dimension: `384`
- Isolated behind an embedding service/interface.
- Not hard-coded; model should eventually be configurable.

## Retrieval Strategy
[FUTURE / OPTIONAL] 
Retrieve relevant chunks based on vector similarity via pgvector. Strategy will evolve based on testing.

## LLM Abstraction
[PLANNED] 
Provider-agnostic abstraction. Supports local model and/or external API provider without coupling.

## Source/Citation Strategy
[FUTURE / OPTIONAL] 
Return Answer + Sources from the LLM based on retrieved chunks.

## Chat & Messaging Architecture
[PLANNED]
- **Database**: Use PostgreSQL `JSONB` to store message metadata (retrieved chunks, sources, token usage) instead of rigid relational tables.
- **Backend Streaming**: Use Server-Sent Events (SSE) via FastAPI's `StreamingResponse` to stream LLM generation back to the client token-by-token.
- **Frontend Streaming**: Use the Vercel AI SDK (`useChat`) in Next.js to handle streaming state and optimistic UI updates seamlessly.
- **State persistence**: Fast execution of user message inserts, embedding, retrieval, and SSE stream. Background tasks inside FastAPI to save the final assistant message (with metadata) to the database to prevent blocking the stream.

## Error Handling
[PLANNED] 
Appropriate HTTP status codes in FastAPI. Proper validation of requests/responses.

## Security
[PLANNED] 
- Never commit API keys, passwords, database credentials, Supabase keys, LLM keys, or private secrets.
- Use environment variables.
- Never expose server-side secrets to the browser.

## Configuration and Environment Variables
[PLANNED] 
Managed via `.env` file containing placeholders for services.

## Testing Strategy
[PLANNED] 
Future implementation should contain tests for:
- Parsing, text cleaning, chunking, embeddings
- SQLAlchemy repositories
- Vector retrieval, API behavior, RAG generation
- Chunking and retrieval must be independently testable.

## Scalability
[FUTURE / OPTIONAL] 
To be determined based on deployment needs. The decoupled architecture and stateless API allow for horizontal scaling.

## Future Advanced RAG
[FUTURE / OPTIONAL] 
- Structure-aware chunking
- Semantic chunking
- Parent-child chunking
- Hierarchical chunking

## Architectural Decision Records / Major Decisions
[CURRENT FOUNDATION] 
- **Decision**: Initial baseline chunking is recursive chunking.
  - **Reason**: Simple, deterministic, strong baseline.
- **Decision**: FastAPI as primary backend.
  - **Reason**: Performance, async support, Python ecosystem for AI.
- **Decision**: Next.js frontend decoupled from RAG logic.
  - **Reason**: Clear separation of concerns.
- **Decision**: Chat streaming with FastAPI SSE and Vercel AI SDK.
  - **Reason**: Greatly improves perceived latency. Standard HTTP works perfectly without WebSocket overhead. AI SDK provides robust frontend state management.
- **Decision**: Store message metadata (sources/chunks) as JSONB.
  - **Reason**: Flexible schema for evolving RAG metadata without constant migrations.
