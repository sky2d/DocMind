import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/chat` 
      : "http://localhost:8000/api/chat";
    
    // Read the token securely from the cookies (automatically sent by the browser)
    const token = req.cookies.get("token")?.value || "";

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        return NextResponse.json({ error: 'Backend error', details: errorText }, { status: response.status });
    }

    // Proxy the Server-Sent Events stream back to the Vercel AI SDK client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Chat proxy error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
