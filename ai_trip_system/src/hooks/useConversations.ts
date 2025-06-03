import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr';
import { conversationApi, messageApi } from '@/lib/api/conversations';
import { Message as ApiMessage } from '@/types/conversation';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: any;
}

// Convert API message to local message format
const convertApiMessageToLocal = (apiMessage: ApiMessage): Message => ({
  id: apiMessage.id,
  text: apiMessage.content,
  isUser: apiMessage.role === 'user',
  timestamp: new Date(apiMessage.created_at),
  metadata: apiMessage.metadata
});

export function useConversations() {
  const { isLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('current_user_id');
      setUserId(storedUserId);
    }
  }, [isLoggedIn]);

  // Custom fetcher sử dụng API backend
  const conversationFetcher = async () => {
    if (!userId) return [];

    try {
      const response = await conversationApi.getConversations({
        userId: userId,
        page: 1,
        limit: 50
      });
      return response.conversations || [];
    } catch (err) {
      throw new Error('Failed to load conversations');
    }
  };

  // Use SWR for data fetching
  const { data: conversations, error: swrError, isLoading, mutate } = useSWR(
    userId ? `conversations-${userId}` : null,
    conversationFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      onError: (err) => {
        setError(err.message || 'Failed to load conversations');
        console.error('Error loading conversations:', err);
      }
    }
  );

  const loadConversations = useCallback(async () => {
    await mutate(); // Trigger revalidation
  }, [mutate]);

  const createConversation = useCallback(async (title?: string) => {
    if (!userId) return null;

    try {
      const newConversation = await conversationApi.createConversation({
        user_id: userId,
        title: title || 'New Conversation'
      });

      await mutate(); // Revalidate SWR cache
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error creating conversation:', err);
      return null;
    }
  }, [userId, mutate]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!userId) return false;

    try {
      await conversationApi.archiveConversation(conversationId, userId);
      await mutate(); // Revalidate SWR cache
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, [userId, mutate]);

  const updateConversationTitle = useCallback(async (conversationId: string, newTitle: string) => {
    if (!userId) return false;

    try {
      await conversationApi.updateConversation(conversationId, {
        userId: userId,
        title: newTitle
      });

      await mutate(); // Revalidate SWR cache
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating conversation title:', err);
      return false;
    }
  }, [userId, mutate]);

  const loadConversationMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    if (!userId) return [];

    try {
      const response = await messageApi.getMessages(conversationId, {
        userId: userId,
        page: 1,
        limit: 100
      });
      return (response.messages || []).map(convertApiMessageToLocal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading conversation messages:', err);
      return [];
    }
  }, [userId]);

  const addMessageToConversation = useCallback(async (
    conversationId: string,
    content: string,
    role: 'user' | 'assistant',
    metadata?: any
  ) => {
    if (!userId) return null;

    try {
      const result = await messageApi.createMessageDirect({
        userId: userId,
        conversationId,
        content,
        role,
        metadata,
        token_count: 0
      });

      // Refresh conversations to update last message
      await loadConversations();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error adding message:', err);
      return null;
    }
  }, [userId, loadConversations]);

  return {
    conversations: conversations || [],
    isLoading,
    error: error || swrError?.message,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    loadConversationMessages,
    addMessageToConversation,
    clearError: () => setError(null),
    mutate // Expose mutate for manual revalidation
  };
}

export type { Conversation, Message };
