"use client";
import dynamic from "next/dynamic";
import ChatHistory from "../../components/ChatHistory";
import ChatInterface from "../../components/ChatInterface";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="w-full px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lịch sử trò chuyện (bên trái) */}
            <div className="lg:col-span-3">
              <ChatHistory />
            </div>

            {/* Khung chat (ở giữa) */}
            <div className="lg:col-span-5">
              <ChatInterface />
            </div>

            {/* Bản đồ (bên phải) */}
            <div className="lg:col-span-4">
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
