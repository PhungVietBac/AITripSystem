import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { createClient } from 'redis';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Redis connection
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Initialize Redis connection
if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

// GET /api/conversations/[id]/messages - Get conversation messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns this conversation
    const ownershipQuery = `
      SELECT id FROM conversations 
      WHERE id = $1 AND user_id = $2 AND is_archived = FALSE
    `;
    const ownershipResult = await pool.query(ownershipQuery, [conversationId, userId]);
    
    if (ownershipResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Try to get from Redis cache first
    const cacheKey = `messages:${conversationId}:${limit}:${offset}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Query messages
    const messagesQuery = `
      SELECT 
        id,
        content,
        role,
        created_at,
        metadata
      FROM messages 
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(messagesQuery, [conversationId, limit, offset]);

    const messages = result.rows.map(row => ({
      id: row.id,
      text: row.content,
      isUser: row.role === 'user',
      timestamp: row.created_at,
      metadata: row.metadata
    }));

    // Cache for 10 minutes
    await redis.setEx(cacheKey, 600, JSON.stringify(messages));

    return NextResponse.json(messages);

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[id]/messages - Add message to conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { userId, content, role, metadata = {} } = await request.json();

    if (!userId || !content || !role) {
      return NextResponse.json(
        { error: 'User ID, content, and role are required' },
        { status: 400 }
      );
    }

    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "user" or "assistant"' },
        { status: 400 }
      );
    }

    // Verify user owns this conversation
    const ownershipQuery = `
      SELECT id FROM conversations 
      WHERE id = $1 AND user_id = $2 AND is_archived = FALSE
    `;
    const ownershipResult = await pool.query(ownershipQuery, [conversationId, userId]);
    
    if (ownershipResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert message
      const messageQuery = `
        INSERT INTO messages (conversation_id, content, role, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at
      `;
      
      const messageResult = await client.query(messageQuery, [
        conversationId,
        content,
        role,
        metadata
      ]);

      // Update conversation updated_at
      const updateConversationQuery = `
        UPDATE conversations 
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      await client.query(updateConversationQuery, [conversationId]);

      await client.query('COMMIT');

      // Clear caches
      const messagesCachePattern = `messages:${conversationId}:*`;
      const messagesKeys = await redis.keys(messagesCachePattern);
      if (messagesKeys.length > 0) {
        await redis.del(messagesKeys);
      }

      const conversationsCachePattern = `conversations:${userId}:*`;
      const conversationsKeys = await redis.keys(conversationsCachePattern);
      if (conversationsKeys.length > 0) {
        await redis.del(conversationsKeys);
      }

      return NextResponse.json({
        id: messageResult.rows[0].id,
        createdAt: messageResult.rows[0].created_at
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
