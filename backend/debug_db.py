import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres:akash7905874934@db.uvbqeknhmqbirkqvhnml.supabase.co:5432/postgres"

async def debug():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # 1. Check documents
        result = await session.execute(text("SELECT id, filename, status, chunk_count FROM documents LIMIT 10"))
        rows = result.fetchall()
        print("=== DOCUMENTS ===")
        for row in rows:
            print(f"  ID: {row[0]}, File: {row[1]}, Status: {row[2]}, Chunks: {row[3]}")
        
        # 2. Check document_chunks
        result2 = await session.execute(text("SELECT document_id, chunk_index, LENGTH(text) as text_len, embedding IS NOT NULL as has_embedding FROM document_chunks LIMIT 10"))
        rows2 = result2.fetchall()
        print("\n=== DOCUMENT CHUNKS ===")
        for row in rows2:
            print(f"  DocID: {row[0]}, ChunkIdx: {row[1]}, TextLen: {row[2]}, HasEmbedding: {row[3]}")
        
        # 3. Sample chunk text
        result3 = await session.execute(text("SELECT LEFT(text, 200) FROM document_chunks LIMIT 3"))
        rows3 = result3.fetchall()
        print("\n=== SAMPLE CHUNK TEXT ===")
        for row in rows3:
            print(f"  {row[0]}")
        
        # 4. Count total chunks
        result4 = await session.execute(text("SELECT COUNT(*) FROM document_chunks"))
        count = result4.scalar()
        print(f"\nTotal chunks: {count}")
    
    await engine.dispose()

asyncio.run(debug())
