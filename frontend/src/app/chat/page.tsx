"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Menu, FileText, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Vercel AI SDK useChat
  // By default, this will hit /api/chat. We'll set it to hit our FastAPI backend.
  // In a real implementation, you might need a Next.js API route proxy to handle streaming properly if FastAPI's format differs.
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/chat` : "http://localhost:8000/api/chat",
    headers: {
      Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("token") : ""}`
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle responsiveness for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-accent/30 border-r border-border flex flex-col flex-shrink-0 z-20 absolute md:relative"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              {/* Close button on mobile */}
              <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <Menu className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Conversations</h3>
              <div className="flex flex-col gap-2">
                {/* Mock conversation list */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer">
                  <p className="text-sm font-medium truncate text-primary">Analysis of Q3 Report</p>
                  <p className="text-xs text-muted-foreground mt-1">Today</p>
                </div>
                <div className="p-3 rounded-xl hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm font-medium truncate">Employee Handbook Questions</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border">
              <button className="w-full py-2.5 rounded-xl border border-border hover:bg-accent hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" /> New Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-semibold truncate">Analysis of Q3 Report</h2>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-20">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-70">
                <div className="h-16 w-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground max-w-sm">Ask me anything about your uploaded documents, and I'll find the answers for you.</p>
              </div>
            ) : (
              messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center mt-1">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'glass-panel rounded-tl-sm leading-relaxed text-sm md:text-base'
                  }`}>
                    {m.content}
                    
                    {/* Mock source visualization for RAG */}
                    {m.role !== 'user' && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-accent px-2 py-1 rounded-md border border-border/50 cursor-pointer hover:border-primary/50 transition-colors">
                            q3-financials.pdf (p. 4)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-accent flex flex-shrink-0 items-center justify-center mt-1">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border sticky bottom-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                className="w-full bg-accent/40 border border-border rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                value={input}
                placeholder="Ask about your documents..."
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-muted-foreground">AI can make mistakes. Consider verifying important information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
