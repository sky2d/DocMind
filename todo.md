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

- [ ] Initialize Next.js project with TypeScript and Tailwind CSS
- [ ] Setup API client to communicate with FastAPI
- [ ] Implement Authentication UI (Login/Register)
- [ ] Build Document Upload Interface
- [ ] Build Chat Interface using Vercel AI SDK (`useChat` for streaming)
- [ ] Build UI to display Answers + Sources (optimistic updates)
- [ ] Ensure strict separation of concerns (no RAG logic in frontend)

---

## Phase 4: Core API & Backend Foundation
*Focus: FastAPI structure, routing, and error handling*

- [ ] Setup FastAPI application instance and basic middleware (CORS)
- [ ] Implement request/response validation schemas (Pydantic)
- [ ] Define HTTP error handling and custom exceptions
- [ ] Scaffold API route groups (e.g., `/api/documents`, `/api/chat`, `/api/auth`)
- [ ] Implement base service layer abstractions

---

## Phase 5: Document Ingestion & Chunking
*Focus: Processing raw documents into chunks*

- [ ] Implement document parser service (e.g., PDF/Text extraction)
- [ ] Implement text cleaning utilities
- [ ] Implement **Recursive Text Chunking** service (~500 tokens, ~50 token overlap)
- [ ] Write unit tests for chunking service (must be independently testable)
- [ ] Create API endpoint for document upload and ingestion triggering

---

## Phase 6: Embeddings & Vector Storage
*Focus: Generating embeddings and storing them in pgvector*

- [ ] Implement Embedding Service using `sentence-transformers` (`all-MiniLM-L6-v2`, 384 dim)
- [ ] Ensure embedding provider/model is configurable via abstraction
- [ ] Connect Embedding Service with Chunking Service
- [ ] Implement pgvector inserts for generated embeddings
- [ ] Write unit tests for embedding generation

---

## Phase 7: Retrieval & RAG Generation
*Focus: Querying vectors and interacting with LLMs*

- [ ] Implement Vector Retrieval Service (similarity search/nearest-neighbor using pgvector)
- [ ] Implement LLM Provider Abstraction (support local/external APIs)
- [ ] Implement Prompt Construction Logic (Question + Retrieved Chunks)
- [ ] Implement Generation Service (LLM orchestration)
- [ ] Create API endpoint for chat/querying (implement Server-Sent Events for streaming)
- [ ] Implement background tasks to save messages and metadata (JSONB) to Supabase
- [ ] Write unit tests for retrieval and generation logic

---

## Phase 8: Polish, Testing & Deployment
*Focus: Ensuring reliability and production readiness*

- [ ] Write integration tests for API endpoints
- [ ] End-to-End testing of the RAG pipeline
- [ ] Review security (Environment variables, Secrets management)
- [ ] Finalize documentation and update `architecture.md` (if needed)
- [ ] Setup deployment configuration (optional)
