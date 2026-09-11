import fitz  # PyMuPDF
import io

class PDFParserService:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> str:
        """
        Extracts text from a PDF byte array.
        """
        text_content = []
        try:
            # Open the PDF directly from bytes
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text()
                text_content.append(page_text)
            doc.close()
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
            
        return "\n".join(text_content)
