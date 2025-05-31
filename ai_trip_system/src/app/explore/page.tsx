'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Explore() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // If not logged in, don't render the content
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Khám phá</h1>
          <p className="text-gray-600 mt-1">Chia sẻ và khám phá những trải nghiệm du lịch từ cộng đồng</p>
        </div>

        {/* Content Area - Empty for custom implementation */}
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Trang Khám phá đang được phát triển</p>
          <p className="text-gray-400 text-sm mt-2">Nội dung sẽ được thêm vào sau</p>
        </div>
      </div>
    </div>
  );
}
