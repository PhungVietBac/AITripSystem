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

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Try to get from Redis cache first
    const cacheKey = `conversations:${userId}:${limit}:${offset}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Query database
    const query = `
      SELECT 
        id,
        title,
        created_at,
        updated_at,
        message_count,
        last_message_at,
        last_message
      FROM conversation_summaries 
      WHERE user_id = $1 AND is_archived = FALSE
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    const conversations = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      messageCount: row.message_count,
      lastMessageAt: row.last_message_at,
      lastMessage: row.last_message
    }));

    // Cache for 5 minutes
    await redis.setEx(cacheKey, 300, JSON.stringify(conversations));

    return NextResponse.json(conversations);

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const { userId, title, firstMessage } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create conversation
      const conversationQuery = `
        INSERT INTO conversations (user_id, title)
        VALUES ($1, $2)
        RETURNING id, created_at
      `;
      
      const conversationResult = await client.query(conversationQuery, [
        userId,
        title || 'New Conversation'
      ]);

      const conversationId = conversationResult.rows[0].id;

      // Add first message if provided
      if (firstMessage) {
        const messageQuery = `
          INSERT INTO messages (conversation_id, content, role)
          VALUES ($1, $2, 'user')
        `;
        await client.query(messageQuery, [conversationId, firstMessage]);

        // Auto-generate title from first message if not provided
        if (!title) {
          const titleQuery = `
            UPDATE conversations 
            SET title = generate_conversation_title($1)
            WHERE id = $1
          `;
          await client.query(titleQuery, [conversationId]);
        }
      }

      await client.query('COMMIT');

      // Clear user's conversation cache
      const cachePattern = `conversations:${userId}:*`;
      const keys = await redis.keys(cachePattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }

      return NextResponse.json({
        id: conversationId,
        createdAt: conversationResult.rows[0].created_at
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations - Archive conversation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: 'Conversation ID and User ID are required' },
        { status: 400 }
      );
    }

    // Archive conversation (soft delete)
    const query = `
      UPDATE conversations 
      SET is_archived = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [conversationId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Clear user's conversation cache
    const cachePattern = `conversations:${userId}:*`;
    const keys = await redis.keys(cachePattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }

    // Clear conversation messages cache
    await redis.del(`messages:${conversationId}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error archiving conversation:', error);
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    );
  }
}
