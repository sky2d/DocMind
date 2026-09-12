"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, LogOut, File as FileIcon } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

export default function DashboardPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // In a real app, we would fetch the user's documents here
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setUploadStatus("idle");
      } else {
        setErrorMessage("Please upload a valid PDF file.");
        setUploadStatus("error");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadStatus("idle");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Assuming FastAPI expects a multipart/form-data upload
      await apiClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("success");
      setFile(null);
    } catch (err: any) {
      setUploadStatus("error");
      setErrorMessage(err.response?.data?.detail || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-accent/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              DocMind
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
              Go to Chat
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
          <p className="text-muted-foreground">Upload your PDFs to start asking questions against them.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out
              ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'}
              ${file ? 'bg-accent/30' : ''}
            `}
          >
            {file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                
                {uploadStatus === "error" && (
                  <p className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{errorMessage}</p>
                )}
                {uploadStatus === "success" && (
                  <div className="flex flex-col gap-3 items-center">
                    <p className="text-sm text-green-500 flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" /> Upload successful! Document is being processed.
                    </p>
                    <Link href="/chat" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      Ask questions about this doc in chat <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => { setFile(null); setUploadStatus("idle"); }}
                    className="px-6 py-2 rounded-full border border-border hover:bg-accent transition-colors text-sm font-medium"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || uploadStatus === "success"}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-medium shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : uploadStatus === "success" ? "Uploaded" : "Upload Document"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-accent rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Drag & drop your PDF here</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
                </div>
                <label className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
                  Select File
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-8 flex justify-between items-center bg-gradient-to-r from-accent/50 to-transparent p-6 rounded-2xl border border-border">
          <div>
            <h3 className="font-semibold text-lg">Ready to ask questions?</h3>
            <p className="text-sm text-muted-foreground mt-1">Head over to the chat interface to query your documents.</p>
          </div>
          <Link href="/chat" className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform shadow-lg shadow-primary/30">
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </main>
    </div>
  );
}
