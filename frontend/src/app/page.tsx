import Link from "next/link";
import { ArrowRight, FileText, Database, Bot, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">DocMind</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
            Chat with your documents in <span className="text-transparent bg-gradient-to-r from-primary to-blue-400">real-time.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
            DocMind securely ingests your PDFs and uses advanced RAG technology to give you instant, accurate answers grounded in your own data.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:bg-foreground/90 transition-all hover:scale-105"
            >
              Start for free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 bg-accent text-foreground px-8 py-4 rounded-full font-medium hover:bg-accent/80 transition-all border border-border"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-accent/20 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="text-muted-foreground mt-2">A powerful pipeline built for accuracy.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Vector Ingestion</h3>
                <p className="text-muted-foreground">Upload your PDFs. We parse, chunk, and securely store the embeddings in pgvector.</p>
              </div>
              
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 items-start">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Bot className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">2. Smart Retrieval</h3>
                <p className="text-muted-foreground">When you ask a question, we instantly retrieve the most relevant context using L2 distance.</p>
              </div>
              
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 items-start">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">3. Accurate Answers</h3>
                <p className="text-muted-foreground">The LLM streams an answer directly to your screen, complete with citations to the source file.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="h-24 flex items-center justify-center border-t border-border bg-background">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DocMind. All rights reserved.</p>
      </footer>
    </div>
  );
}
