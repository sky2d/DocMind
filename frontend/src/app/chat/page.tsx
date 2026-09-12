"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Menu, FileText, ArrowLeft, Loader2, Sparkles, X, ChevronDown, Check } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversationId, setConversationId] = useState<string>("");
  const [customInput, setCustomInput] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [userDocuments, setUserDocuments] = useState<any[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [showDocSelector, setShowDocSelector] = useState(false);
  
  useEffect(() => {
    setConversationId(crypto.randomUUID());
    fetchConversations();
    fetchUserDocuments();
  }, []);

  const fetchUserDocuments = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
      const url = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/documents/` 
        : "http://localhost:8000/api/documents/";
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const fetchConversations = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
      const url = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/conversations` 
        : "http://localhost:8000/api/conversations";
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  const loadConversation = async (id: string, title: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
      const url = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/conversations/${id}` 
        : `http://localhost:8000/api/conversations/${id}`;
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const msgs = await response.json();
        setMessages(msgs.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content
        })));
        setConversationId(id);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to load conversation", error);
    }
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isLoading) return;
    
    const userMessage = { id: crypto.randomUUID(), role: 'user', content: customInput };
    setMessages(prev => [...prev, userMessage]);
    setCustomInput("");
    setIsLoading(true);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
      const url = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/chat` 
        : "http://localhost:8000/api/chat";
        
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          conversation_id: conversationId,
          document_ids: selectedDocIds.length > 0 ? selectedDocIds : undefined,
        })
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const aiMessageId = crypto.randomUUID();
      let aiContent = "";
      
      setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
        
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: aiContent } : m));
      }
      
      // Refresh sidebar after stream finishes
      fetchConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(crypto.randomUUID());
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

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
                {conversations.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No conversations yet.</p>
                ) : (
                  conversations.map((conv) => (
                    <div 
                      key={conv.id}
                      onClick={() => loadConversation(conv.id, conv.title)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${conversationId === conv.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'}`}
                    >
                      <p className={`text-sm font-medium truncate ${conversationId === conv.id ? 'text-primary' : ''}`}>
                        {conv.title || "New Chat"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-border">
              <button 
                onClick={handleNewChat}
                className="w-full py-2.5 rounded-xl border border-border hover:bg-accent hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
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
            <h2 className="font-semibold truncate">
              {messages.length > 0 ? (messages.find(m => m.role === 'user')?.content?.slice(0, 40) || 'Chat') : 'New Chat'}
            </h2>
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
            {/* Document Selector */}
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowDocSelector(!showDocSelector)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent/50"
              >
                <FileText className="h-3.5 w-3.5" />
                {selectedDocIds.length === 0
                  ? 'All Documents'
                  : `${selectedDocIds.length} document${selectedDocIds.length > 1 ? 's' : ''} selected`}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDocSelector ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showDocSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="mt-2 flex flex-wrap gap-2 overflow-hidden"
                  >
                    {userDocuments.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic px-1">No documents uploaded yet.</p>
                    ) : (
                      userDocuments.map((doc: any) => {
                        const isSelected = selectedDocIds.includes(doc.id);
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => toggleDocSelection(doc.id)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                              isSelected
                                ? 'bg-primary/15 border-primary/40 text-primary'
                                : 'bg-accent/40 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                            <FileText className="h-3 w-3" />
                            <span className="max-w-[150px] truncate">{doc.filename}</span>
                            {isSelected && (
                              <X className="h-3 w-3 ml-0.5 hover:text-destructive" />
                            )}
                          </button>
                        );
                      })
                    )}
                    {selectedDocIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDocIds([])}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleCustomSubmit} className="relative flex items-center">
              <input
                className="w-full bg-accent/40 border border-border rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
                value={customInput}
                placeholder={selectedDocIds.length > 0 ? `Ask about ${selectedDocIds.length} selected document${selectedDocIds.length > 1 ? 's' : ''}...` : 'Ask about your documents...'}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !customInput.trim()}
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
