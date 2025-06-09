"use client";
import dynamic from "next/dynamic";
import HomeChatbot from "@/components/HomeChatbot";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useConversation } from "@/context/ConversationContext";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;

  const handleMapClick = () => {
    router.push("/map"); // Chuyển hướng đến trang /map (map/page.tsx)
  };

  return (
    <div className="flex h-full">
      {/* AI Chatbot */}
      <div className="flex-1">
        <HomeChatbot
          conversationId={currentConversationId}
          onConversationCreate={handleConversationCreate}
        />
      </div>

      {/* Bản đồ (bên phải) - Thêm onClick để điều hướng */}
      <div className="w-100 flex-shrink-0" onClick={handleMapClick}>
        <div className="h-full cursor-pointer hover:bg-gray-100 transition-colors">
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default Home;