from fastapi import Request, status
from fastapi.responses import JSONResponse

class AppException(Exception):
    """Base class for application specific exceptions"""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code

class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)

class DocumentProcessingError(AppException):
    def __init__(self, message: str = "Error processing document"):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )
