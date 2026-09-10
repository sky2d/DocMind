from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Create the async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    future=True,
    pool_pre_ping=True, # Ensure connections are alive
)

# Create an async session factory
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False, 
    autocommit=False, 
    autoflush=False
)

async def get_db():
    """
    Dependency to yield an async database session.
    """
    async with AsyncSessionLocal() as session:
        yield session
