import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

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

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/conversations?userId=${user.id}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        throw new Error('Failed to load conversations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const createConversation = useCallback(async (title?: string, firstMessage?: string) => {
    if (!user?.id) return null;

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          title: title || 'New Conversation',
          firstMessage
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        await loadConversations(); // Refresh list
        return newConversation;
      } else {
        throw new Error('Failed to create conversation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error creating conversation:', err);
      return null;
    }
  }, [user?.id, loadConversations]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/conversations?id=${conversationId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        return true;
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, [user?.id]);

  const updateConversationTitle = useCallback(async (conversationId: string, newTitle: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          title: newTitle
        }),
      });

      if (response.ok) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, title: newTitle }
              : conv
          )
        );
        return true;
      } else {
        throw new Error('Failed to update conversation title');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating conversation title:', err);
      return false;
    }
  }, [user?.id]);

  const loadConversationMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    if (!user?.id) return [];

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages?userId=${user.id}`);
      
      if (response.ok) {
        const messages = await response.json();
        return messages;
      } else {
        throw new Error('Failed to load conversation messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading conversation messages:', err);
      return [];
    }
  }, [user?.id]);

  const addMessageToConversation = useCallback(async (
    conversationId: string, 
    content: string, 
    role: 'user' | 'assistant',
    metadata?: any
  ) => {
    if (!user?.id) return null;

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          content,
          role,
          metadata
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh conversations to update last message
        await loadConversations();
        return result;
      } else {
        throw new Error('Failed to add message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error adding message:', err);
      return null;
    }
  }, [user?.id, loadConversations]);

  // Load conversations when user changes
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    } else {
      setConversations([]);
    }
  }, [user?.id, loadConversations]);

  return {
    conversations,
    isLoading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    loadConversationMessages,
    addMessageToConversation,
    clearError: () => setError(null)
  };
}

export type { Conversation, Message };
