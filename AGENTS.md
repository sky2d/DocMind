# AGENTS.md

This is the permanent instruction file for future coding agents.

Every future agent MUST read:
- `AGENTS.md`
- `architecture.md`

before modifying the project.

## GENERAL ENGINEERING RULES
- Understand the architecture before modifying code.
- Prefer simple solutions.
- Avoid unnecessary dependencies.
- Do not duplicate logic.
- Do not rewrite working code without justification.
- Keep responsibilities separated.
- Follow existing conventions.
- Do not create unnecessary files.
- Keep modules focused.

## FRONTEND RULES
- Use Next.js + TypeScript.
- Keep React components focused.
- Do not place RAG business logic inside components.
- Do not access the database directly from UI components.
- Communicate with FastAPI through defined API boundaries.

## FASTAPI RULES
- Keep route handlers thin.
- Validate incoming requests.
- Validate responses.
- Use appropriate HTTP status codes.
- Put business logic inside services.
- Do not put database queries inside routes.
- Do not put chunking inside routes.
- Do not put embedding generation inside routes.
- Do not put LLM prompting inside routes.

## SQLALCHEMY RULES
SQLAlchemy is the ORM.
- Use SQLAlchemy for normal relational database operations.
- Keep ORM/database access behind repository or service boundaries.
- Do not expose SQLAlchemy sessions throughout unrelated application layers.
- Keep transaction boundaries explicit.

## PGVECTOR RULES
Supabase PostgreSQL + pgvector is the vector database layer.
- Vector operations must remain isolated inside the vector repository/service.
- Use parameterized SQL when required.
- Never scatter raw SQL throughout the application.
- Do not introduce Pinecone, Qdrant, Weaviate, Milvus, Chroma, or another vector database without a documented architectural reason.

## RAG RULES
Maintain this modular pipeline:
`ingestion → parsing → cleaning → chunking → embedding → storage → retrieval → generation`
- Each stage must remain independently testable.
- Do not tightly couple stages.

## CHUNKING RULES
Initial strategy: Recursive chunking, ~500 tokens, ~50 token overlap.
This is the baseline.
- Do not replace it simply because another strategy sounds more advanced.
- Any change must be justified by measurable improvement.
- Compare strategies using: retrieval accuracy, answer quality, latency, resource usage, cost, document type.
- Keep the chunking implementation replaceable.

## EMBEDDING RULES
Initial model: `all-MiniLM-L6-v2`, 384 dimensions.
- Embedding providers/models must remain configurable.
- Do not hard-code model-specific assumptions across the application.

## LLM RULES
- LLM access must be behind an abstraction.
- Application logic should not depend directly on one provider.

## DATABASE RULES
- FastAPI is the primary backend.
- SQLAlchemy is the ORM.
- Supabase PostgreSQL is the database.
- pgvector is the vector search layer.
- Do not create a second database unless a clear architectural requirement exists.

## SECURITY RULES
Never commit: API keys, passwords, database credentials, Supabase service keys, LLM API keys, private secrets.
- Use environment variables.
- Never expose server-side secrets to the browser.

## TESTING RULES
Future implementation should contain tests for:
- parsing, text cleaning, chunking, embeddings, SQLAlchemy repositories, vector retrieval, API behavior, RAG generation.
- Chunking and retrieval must be independently testable.

## DEPENDENCY RULES
Before adding a dependency:
1. Determine whether it is necessary.
2. Check whether existing dependencies solve the problem.
3. Prefer lightweight, maintained libraries.
4. Avoid frameworks simply for convenience.
5. Document important dependency decisions.

## ARCHITECTURE CHANGE RULES
Before making a significant architectural change:
1. Read `AGENTS.md`.
2. Read `architecture.md`.
3. Explain why the current architecture is insufficient.
4. Consider alternatives.
5. Update `architecture.md`.

## DOCUMENTATION RULES
- Keep `architecture.md` synchronized with the implementation.
- Never document planned functionality as implemented.
- Document major architectural decisions with: Decision, Reason, Alternatives, Tradeoffs.
