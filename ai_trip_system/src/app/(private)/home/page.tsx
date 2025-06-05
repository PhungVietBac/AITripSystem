"use client";
import dynamic from "next/dynamic";
import HomeChatbot from "@/components/HomeChatbot";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useConversation } from "@/context/ConversationContext";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Đang tải bản đồ...</div>
    </div>
  ),
});

const Home = () => {
  const { loading } = useAuthCheck();
  const { currentConversationId, handleConversationCreate } = useConversation();

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;

  return (
    <div className="flex h-full">
      {/* AI Chatbot */}
      <div className="flex-1">
        <HomeChatbot
          conversationId={currentConversationId}
          onConversationCreate={handleConversationCreate}
        />
      </div>

      {/* Bản đồ (bên phải) */}
      <div className="w-100 flex-shrink-0">
        <div className="h-full">
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default Home;
