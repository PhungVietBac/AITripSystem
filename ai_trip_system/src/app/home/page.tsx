"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import HomeChatbot from "../../components/HomeChatbot";
import ConversationSidebar from "../../components/ConversationSidebar";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const Home = () => {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
  };

  const handleConversationCreate = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="flex h-[calc(100vh-80px)]"> {/* Adjust for header height */}
          {/* Conversation Sidebar */}
          <ConversationSidebar
            currentConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            className="flex-shrink-0"
          />

          {/* Main Content Area */}
          <div className="flex-1 flex gap-6 p-6">
            {/* AI Chatbot */}
            <div className="flex-1">
              <HomeChatbot
                conversationId={currentConversationId}
                onConversationCreate={handleConversationCreate}
              />
            </div>

            {/* Bản đồ (bên phải) */}
            <div className="w-80 flex-shrink-0">
              <div className="h-[600px] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <h2 className="text-lg font-semibold">Bản đồ</h2>
                </div>
                <div className="h-[550px]">
                  <MapView />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
