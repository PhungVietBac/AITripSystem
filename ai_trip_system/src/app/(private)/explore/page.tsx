'use client';

import dynamic from 'next/dynamic';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const MapView = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Đang tải bản đồ...</div>
    </div>
  ),
});

export default function Explore() {
  const { loading } = useAuthCheck();

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;

  return (
    <div className="h-full bg-white">
      <div className="h-full">
        <MapView />
      </div>
    </div>
  );
}
