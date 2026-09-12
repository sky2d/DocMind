# Start script for Windows PowerShell
Write-Host "Starting DocMind Backend and Frontend..." -ForegroundColor Cyan

# Start Backend in a new window
Write-Host "Starting FastAPI Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload"

# Start Frontend in a new window
Write-Host "Starting Next.js Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both services are starting up!" -ForegroundColor Cyan
Write-Host "Backend will run at http://localhost:8000" -ForegroundColor DarkGray
Write-Host "Frontend will run at http://localhost:3000" -ForegroundColor DarkGray
