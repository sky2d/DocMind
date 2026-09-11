# Project Implementation Phases & TODO

This document breaks down the implementation of the `rag-project` into logical phases based on the `architecture.md` specifications. 

## Phase 1: Project Initialization & Scaffold 
*Status: Completed*

- [x] Define project architecture and engineering rules
- [x] Create core directory structure
- [x] Setup `.env.example` and `.gitignore`
- [x] Create `architecture.md` and `AGENTS.md`

---

## Phase 2: Database, ORM & Basic Auth Setup
*Focus: Establishing the persistence layer (Relational + Vector) and basic authentication*

- [x] Initialize Supabase project (PostgreSQL + pgvector + Auth)
- [x] Configure database connection in FastAPI (`DATABASE_URL`, `SUPABASE_URL`)
- [x] Setup SQLAlchemy ORM engine and session management
- [x] Create base SQLAlchemy models
- [x] Define relational models (Users, Documents, Document Metadata, Conversations, Messages)
- [x] Create vector repository interface for pgvector
- [x] Setup database migrations (e.g., using Alembic)
- [x] Implement basic authentication flow

---

## Phase 3: Frontend Development (Next.js)
*Focus: User Interface and basic connection*

- [x] Initialize Next.js project with TypeScript and Tailwind CSS
- [x] Setup API client to communicate with FastAPI
- [x] Implement Authentication UI (Login/Register)
- [x] Build Document Upload Interface
- [x] Build Chat Interface using Vercel AI SDK (`useChat` for streaming)
- [x] Build UI to display Answers + Sources (optimistic updates)
- [x] Ensure strict separation of concerns (no RAG logic in frontend)

---

## Phase 4: Core API & Backend Foundation
*Focus: FastAPI structure, routing, and error handling*

- [x] Setup FastAPI application instance and basic middleware (CORS)
- [x] Implement request/response validation schemas (Pydantic)
- [x] Define HTTP error handling and custom exceptions
- [x] Scaffold API route groups (e.g., `/api/documents`, `/api/chat`, `/api/auth`)
- [x] Implement base service layer abstractions

---

## Phase 5: Document Ingestion & Chunking
*Focus: Processing raw documents into chunks*

- [x] Implement document parser service (e.g., PDF/Text extraction)
- [x] Implement text cleaning utilities
- [x] Implement **Recursive Text Chunking** service (~500 tokens, ~50 token overlap)
- [x] Write unit tests for chunking service (must be independently testable)
- [x] Create API endpoint for document upload and ingestion triggering

---

## Phase 6: Embeddings & Vector Storage
*Focus: Generating embeddings and storing them in pgvector*

- [x] Implement Embedding Service using `sentence-transformers` (`all-MiniLM-L6-v2`, 384 dim)
- [x] Connect ingestion pipeline to embedding service
- [x] Store chunks and embeddings into `document_chunks` table (pgvector)
- [x] Verify vectors are properly inserted and queryable

---

## Phase 7: Retrieval & RAG Generation
*Focus: Querying vectors and interacting with LLMs*

- [x] Implement `pgvector` similarity search in vector repository
- [x] Connect Chat API to vector retrieval
- [x] Connect Chat API to LLM provider (Groq)
- [x] Implement prompt construction logic (injecting chunks as context)
- [x] Create API endpoint for chat/querying and setup Streaming Responses (Server-Sent Events) for Vercel AI SDK
- [x] Implement background tasks to save messages and metadata (JSONB) to Supabase
- [x] Write unit tests for retrieval and generation logic

---

## Phase 8: Polish, Testing & Deployment
*Focus: Ensuring reliability and production readiness*

- [ ] Write integration tests for API endpoints
- [ ] End-to-End testing of the RAG pipeline
- [ ] Review security (Environment variables, Secrets management)
- [ ] Finalize documentation and update `architecture.md` (if needed)
- [ ] Setup deployment configuration (optional)
