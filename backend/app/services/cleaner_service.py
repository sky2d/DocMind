import re

class TextCleanerService:
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Cleans the extracted text to normalize whitespace and remove null bytes.
        """
        if not text:
            return ""
            
        # Remove null bytes which can cause DB insertion issues
        text = text.replace('\x00', '')
        
        # Replace multiple spaces with a single space
        text = re.sub(r'[ \t]+', ' ', text)
        
        # Replace multiple newlines with a double newline to preserve paragraph breaks
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text.strip()
