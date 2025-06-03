// API client functions for conversations and messages

import {
  Conversation,
  Message,
  ConversationCreateRequest,
  ConversationUpdateRequest,
  MessageCreateRequest,
  ConversationListParams,
  MessageListParams,
  ConversationListResponse,
  MessageListResponse,
} from '@/types/conversation';

// Sử dụng API backend đã deploy trên Render
const API_BASE = 'https://aitripsystem-api.onrender.com/api/v1';

// Conversation API functions
export const conversationApi = {
  // Get conversations list
  async getConversations(params: ConversationListParams): Promise<ConversationListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.includeArchived) searchParams.append('include_archived', 'true');
    if (params.search) searchParams.append('search', params.search);

    const response = await fetch(`${API_BASE}/conversations/user/${params.userId}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }
    return response.json();
  },

  // Get single conversation
  async getConversation(id: string, userId: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE}/conversations/${id}?include_messages=true`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }
    return response.json();
  },

  // Create new conversation
  async createConversation(data: ConversationCreateRequest): Promise<Conversation> {
    const response = await fetch(`${API_BASE}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.statusText}`);
    }
    return response.json();
  },

  // Update conversation
  async updateConversation(id: string, data: ConversationUpdateRequest): Promise<Conversation> {
    const response = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update conversation: ${response.statusText}`);
    }
    return response.json();
  },

  // Archive conversation (soft delete)
  async archiveConversation(id: string, userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to archive conversation: ${response.statusText}`);
    }
    return response.json();
  },
};

// Message API functions
export const messageApi = {
  // Get messages for a conversation
  async getMessages(conversationId: string, params: MessageListParams): Promise<MessageListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/messages/conversation/${conversationId}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return response.json();
  },

  // Create new message in conversation
  async createMessage(conversationId: string, data: MessageCreateRequest): Promise<Message> {
    const messageData = {
      conversation_id: conversationId,
      content: data.content,
      role: data.role,
      metadata: data.metadata,
      token_count: data.token_count || 0,
    };

    const response = await fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`);
    }
    return response.json();
  },

  // Create message directly
  async createMessageDirect(data: MessageCreateRequest): Promise<Message> {
    const messageData = {
      conversation_id: data.conversationId,
      content: data.content,
      role: data.role,
      metadata: data.metadata,
      token_count: data.token_count || 0,
    };

    const response = await fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`);
    }
    return response.json();
  },

  // Get single message - không có endpoint này trong backend, bỏ qua
  async getMessage(messageId: string, userId: string): Promise<Message> {
    throw new Error('Get single message endpoint not available in backend API');
  },
};

// Utility functions
export const chatUtils = {
  // Create a new conversation with first message using backend endpoint
  async startConversation(
    userId: string,
    title: string,
    firstMessage: string,
    role: 'user' | 'assistant' = 'user'
  ): Promise<{ conversation: Conversation; message: Message }> {
    const response = await fetch(`${API_BASE}/messages/start-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        title,
        first_message: firstMessage,
        role,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start conversation: ${response.statusText}`);
    }

    return response.json();
  },

  // Generate conversation title from first message
  generateTitle(firstMessage: string, maxLength: number = 50): string {
    const cleaned = firstMessage.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    return cleaned.substring(0, maxLength - 3) + '...';
  },
};
