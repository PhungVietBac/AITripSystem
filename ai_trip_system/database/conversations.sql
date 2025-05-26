-- Conversations Database Schema
-- PostgreSQL schema for storing chat conversations

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    token_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated ON conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-generate conversation title
CREATE OR REPLACE FUNCTION generate_conversation_title(conversation_uuid UUID)
RETURNS VARCHAR(500) AS $$
DECLARE
    first_message TEXT;
    title VARCHAR(500);
BEGIN
    -- Get first user message
    SELECT content INTO first_message
    FROM messages 
    WHERE conversation_id = conversation_uuid 
    AND role = 'user' 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_message IS NULL THEN
        RETURN 'New Conversation';
    END IF;
    
    -- Truncate and clean the message for title
    title := TRIM(first_message);
    title := SUBSTRING(title FROM 1 FOR 100);
    
    -- If title ends mid-word, truncate to last complete word
    IF LENGTH(first_message) > 100 THEN
        title := SUBSTRING(title FROM 1 FOR LENGTH(title) - POSITION(' ' IN REVERSE(title)));
        title := title || '...';
    END IF;
    
    RETURN title;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
-- INSERT INTO conversations (user_id, title) VALUES 
-- ('user123', 'Du lịch Đà Lạt 3 ngày'),
-- ('user123', 'Tìm nhà hàng Sài Gòn');

-- INSERT INTO messages (conversation_id, content, role) VALUES 
-- ((SELECT id FROM conversations WHERE title = 'Du lịch Đà Lạt 3 ngày'), 'Tôi muốn lên kế hoạch du lịch Đà Lạt 3 ngày 2 đêm', 'user'),
-- ((SELECT id FROM conversations WHERE title = 'Du lịch Đà Lạt 3 ngày'), 'Tôi sẽ giúp bạn tạo lịch trình du lịch Đà Lạt 3 ngày 2 đêm...', 'assistant');

-- View to get conversation summaries
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT 
    c.id,
    c.user_id,
    c.title,
    c.created_at,
    c.updated_at,
    c.is_archived,
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
GROUP BY c.id, c.user_id, c.title, c.created_at, c.updated_at, c.is_archived
ORDER BY c.updated_at DESC;
