import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, sessionId, currentTopicId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: sessionId || 'default',
        currentTopicId,
      }),
    });

    // Clone the response to read it twice (for both JSON and text)
    const responseClone = response.clone();
    
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // If JSON parsing fails, try to get the response as text
      const errorText = await responseClone.text();
      console.error('Failed to parse API response as JSON:', errorText);
      return NextResponse.json(
        { 
          error: 'Invalid response from AI service',
          details: errorText 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
