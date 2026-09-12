from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List

class ChunkingService:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        """
        Initializes the RecursiveCharacterTextSplitter.
        We use characters as a proxy for tokens. Standard English text has ~4 chars per token.
        So 500 tokens * 4 = 2000 chars. 50 tokens * 4 = 200 chars overlap.
        """
        self.chunk_size_chars = chunk_size * 4
        self.chunk_overlap_chars = chunk_overlap * 4
        
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size_chars,
            chunk_overlap=self.chunk_overlap_chars,
            length_function=len,
            is_separator_regex=False,
            separators=[
                "\n\n",
                "\n",
                " ",
                "",
            ]
        )

    def split_text(self, text: str) -> List[str]:
        """
        Splits text recursively and returns a list of string chunks.
        """
        if not text:
            return []
        return self.splitter.split_text(text)
