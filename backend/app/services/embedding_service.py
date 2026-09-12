from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls) -> SentenceTransformer:
        """
        Lazy load the model so it only loads into memory once and isn't blocking on startup.
        """
        if cls._model is None:
            # We use all-MiniLM-L6-v2 which generates 384 dimensional vectors
            cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @classmethod
    def generate_embeddings(cls, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of string chunks.
        """
        if not texts:
            return []
            
        model = cls.get_model()
        # encode returns numpy arrays, we convert them to python lists for SQLAlchemy/pgvector
        embeddings = model.encode(texts)
        return embeddings.tolist()
