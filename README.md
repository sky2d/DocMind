# DocMind

DocMind is a modern Retrieval-Augmented Generation (RAG) application. It allows you to upload PDF documents and ask questions about them using an AI that grounds its answers in your own data.

## Project Structure

The project is split into two parts:
- `/backend`: A FastAPI Python server handling the database (Supabase + pgvector), document ingestion, authentication, and LLM communication.
- `/frontend`: A responsive, modern Next.js (App Router) web interface styled with Tailwind CSS 4.

## How to Start the Application

### The Easy Way
You can start both the frontend and backend simultaneously using the provided start script:

**On Windows (PowerShell):**
```powershell
.\start.ps1
```

### The Manual Way

If you prefer to run them in separate terminal windows, follow these steps:

#### 1. Start the Backend
Open a terminal, navigate to the `backend` folder, and start the FastAPI server with uvicorn:
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

#### 2. Start the Frontend
Open a *new* terminal window, navigate to the `frontend` folder, and start the Next.js dev server:
```powershell
cd frontend
npm run dev
```
The frontend UI will be available at `http://localhost:3000`.
