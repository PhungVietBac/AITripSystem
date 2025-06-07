'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useMessages, Message } from '@/hooks/useMessages';

interface ChatResponse {
  success: boolean;
  response?: string;
  metadata?: any;
  error?: string;
}

// Function to render markdown-like text with formatting
const renderMessageText = (text: string, isUser: boolean = false) => {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);

    const renderedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong
            key={partIndex}
            className={`font-bold ${isUser ? 'text-yellow-100' : 'text-amber-700'}`}
          >
            {boldText}
          </strong>
        );
      }
      return part;
    });

    return (
      <span key={lineIndex}>
        {renderedLine}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

interface HomeChatbotProps {
  conversationId?: string;
  onConversationCreate?: (conversationId: string) => void;
}

export default function HomeChatbot({
  conversationId,
  onConversationCreate
}: HomeChatbotProps) {
  const { isLoggedIn } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const [userId, setUserId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Use messages hook for API data
  const {
    messages: apiMessages,
    isLoading: messagesLoading,
    startConversation,
    addMessage,
    getWelcomeMessage,
    mutate: mutateMessages
  } = useMessages({
    conversationId: currentConversationId,
    userId: userId || undefined
  });

  // Use API messages when available, fallback to local for new conversations
  const messages = currentConversationId && apiMessages.length > 0
    ? apiMessages
    : localMessages;

  // Check if we should show welcome message (no real messages yet)
  const shouldShowWelcome = messages.length === 0;

  // Get userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('current_user_id');
      setUserId(storedUserId);
    }
  }, [isLoggedIn]);

  const scrollToBottom = () => {
    // Scroll within the chat container only, not the entire page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    // Ping server first to wake it up, then check health
    pingAndCheckHealth();

    // Temporarily disable conversation integration for testing
    console.log('🧪 Testing mode: Conversation integration disabled');
  }, []);

  const pingAndCheckHealth = async () => {
    try {
      console.log('🚀 Testing chatbot connection...');
      setIsConnected(false);

      const response = await fetch('https://travellingchatbot.onrender.com/api/health');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Health data:', data);

        // Simple check - if we get valid response, server is ready
        if (data && data.status === 'ok') {
          console.log('✅ Chatbot ready!');
          setIsConnected(true);
        } else {
          console.log('⚠️ Invalid response format');
          setIsConnected(false);
        }
      } else {
        console.log('❌ Health check failed:', response.status);
        setIsConnected(false);
      }
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    setCurrentConversationId(conversationId);
  }, [conversationId]);

  const checkChatbotHealth = async () => {
    // This function is now simplified since pingAndCheckHealth handles the main logic
    console.log('🔄 Retry health check...');
    pingAndCheckHealth();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Conversation API integration (only for logged in users)
      let conversationIdToUse = currentConversationId;

      if (userId) {
        // Create conversation if this is the first message
        if (!conversationIdToUse) {
          // Create conversation with first user message as title
          const result = await startConversation(
            messageText, // Use first user message as title
            messageText // Start with user message (no welcome message in API)
          );

          if (result) {
            conversationIdToUse = result.conversationId;
            setCurrentConversationId(conversationIdToUse);

            onConversationCreate?.(conversationIdToUse);
          }
        } else {
          // Add user message to existing conversation
          await addMessage(messageText, 'user');
        }
      }

      // Get AI response
      const recentHistory = messages.slice(-6); // Last 3 exchanges (6 messages)

      let response;
      let data: ChatResponse | null = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: messageText,
              history: recentHistory,
              conversationId: conversationIdToUse,
              userId: userId || 'anonymous'
            }),
          });

          data = await response.json();

          if (data?.success) {
            break;
          }

          if (response.ok) {
            break;
          }

          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        } catch (fetchError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw fetchError;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Save assistant response to API (only for logged in users)
      if (userId && conversationIdToUse) {
        if (data?.success && data.response) {
          await addMessage(data.response, 'assistant', data.metadata);
        } else {
          await addMessage('Xin lỗi, tôi không thể trả lời câu hỏi này.', 'assistant');
        }
        // Refresh messages from API
        mutateMessages();
      } else {
        // For non-logged in users, add to local messages
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data?.success && data.response ? data.response : 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
          isUser: false,
          timestamp: new Date(),
          metadata: data?.metadata,
        };

        const userMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          isUser: true,
          timestamp: new Date(),
        };

        setLocalMessages(prev => [...prev, userMessage, botMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message locally (won't be saved to API)
      // You could implement a local error state here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full bg-gradient-to-b shadow-md overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 text-amber-800">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">✈️ Trợ lý Du lịch Thông Minh Tourmate</h2>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        {/* Welcome Message - Always show when no real messages */}
        {shouldShowWelcome && (
          <div className="w-full py-6 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex justify-start">
                <div className="max-w-2xl bg-amber-50 border border-amber-200 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="text-amber-800 leading-relaxed">
                    <div className="whitespace-pre-wrap">{renderMessageText(getWelcomeMessage().text)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-full py-4 ${message.isUser ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-4xl mx-auto px-4">
              {message.isUser ? (
                // User message - right aligned with background
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-sm">
                    <div className="whitespace-pre-wrap">{renderMessageText(message.text, message.isUser)}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })
                        : new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })
                      }
                    </div>
                  </div>
                </div>
              ) : (
                // Bot message - full width, no background
                <div className="w-full">
                  <div className="text-gray-800 leading-relaxed">
                    <div className="whitespace-pre-wrap">{renderMessageText(message.text, message.isUser)}</div>
                    <div className="text-xs mt-2 text-gray-500">
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })
                        : new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="w-full py-4 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="w-full">
                <div className="text-gray-600 leading-relaxed">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">🔍 Đang tìm kiếm thông tin...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi về du lịch..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={!isConnected || isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !isConnected}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

          {!isConnected && (
            <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-3 h-3 border border-amber-400 border-t-transparent rounded-full"></div>
                <span>🚀 Đang đánh thức server... (có thể mất 1-2 phút)</span>
              </div>
              <div className="text-xs text-amber-500 mt-2 flex items-center justify-between">
                <span>💡 Server đang cold start, vui lòng đợi...</span>
                <button
                  onClick={() => {
                    console.log('🔄 User click retry');
                    pingAndCheckHealth();
                  }}
                  className="text-blue-600 hover:text-blue-800 underline ml-2"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
