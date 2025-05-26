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

// GET /api/conversations/[id] - Get specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Try cache first
    const cacheKey = `conversation:${conversationId}:${userId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Query database
    const query = `
      SELECT 
        c.id,
        c.title,
        c.created_at,
        c.updated_at,
        c.metadata,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_at,
        (
          SELECT content 
          FROM messages 
          WHERE conversation_id = c.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.id = $1 AND c.user_id = $2 AND c.is_archived = FALSE
      GROUP BY c.id, c.title, c.created_at, c.updated_at, c.metadata
    `;

    const result = await pool.query(query, [conversationId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const conversation = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
      metadata: result.rows[0].metadata,
      messageCount: result.rows[0].message_count,
      lastMessageAt: result.rows[0].last_message_at,
      lastMessage: result.rows[0].last_message
    };

    // Cache for 5 minutes
    await redis.setEx(cacheKey, 300, JSON.stringify(conversation));

    return NextResponse.json(conversation);

  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[id] - Update conversation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { userId, title, metadata } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    if (metadata !== undefined) {
      updates.push(`metadata = $${paramCount++}`);
      values.push(JSON.stringify(metadata));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add WHERE clause parameters
    values.push(conversationId, userId);

    const query = `
      UPDATE conversations 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount++} AND user_id = $${paramCount++} AND is_archived = FALSE
      RETURNING id, title, updated_at, metadata
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Clear caches
    const conversationCacheKey = `conversation:${conversationId}:${userId}`;
    await redis.del(conversationCacheKey);

    const conversationsCachePattern = `conversations:${userId}:*`;
    const conversationsKeys = await redis.keys(conversationsCachePattern);
    if (conversationsKeys.length > 0) {
      await redis.del(conversationsKeys);
    }

    return NextResponse.json({
      id: result.rows[0].id,
      title: result.rows[0].title,
      updatedAt: result.rows[0].updated_at,
      metadata: result.rows[0].metadata
    });

  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Archive specific conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Archive conversation (soft delete)
    const query = `
      UPDATE conversations 
      SET is_archived = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND is_archived = FALSE
      RETURNING id
    `;

    const result = await pool.query(query, [conversationId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found or already archived' },
        { status: 404 }
      );
    }

    // Clear all related caches
    const conversationCacheKey = `conversation:${conversationId}:${userId}`;
    await redis.del(conversationCacheKey);

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
      success: true,
      message: 'Conversation archived successfully'
    });

  } catch (error) {
    console.error('Error archiving conversation:', error);
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    );
  }
}
