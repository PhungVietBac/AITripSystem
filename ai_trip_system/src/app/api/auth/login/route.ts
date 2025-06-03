import { NextRequest, NextResponse } from 'next/server';

// Simple login endpoint for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Simple validation (for testing only - replace with real auth)
    if (username === 'test123' && password === '123456') {
      // Generate a simple token (for testing only)
      const token = `test_token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      
      return NextResponse.json({
        access_token: token,
        token_type: 'bearer',
        user: {
          id: username,
          username: username
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint is working',
    usage: 'POST with { username, password }'
  });
}
