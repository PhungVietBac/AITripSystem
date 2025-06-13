import { NextRequest, NextResponse } from 'next/server';

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], conversationId, userId } = await request.json();

    // Forward the request to the chatbot microservice
    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chatbot proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Không thể kết nối đến dịch vụ chatbot. Vui lòng thử lại sau.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Health check proxy
    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/health`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chatbot health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        initialized: false,
        message: 'Chatbot service unavailable'
      },
      { status: 503 }
    );
  }
}
