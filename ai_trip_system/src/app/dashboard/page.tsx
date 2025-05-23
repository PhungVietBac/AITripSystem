'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const { isLoggedIn, username } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 1,
      destination: 'Đà Lạt',
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      image: '/images/dalat.jpg',
    },
    {
      id: 2,
      destination: 'Phú Quốc',
      startDate: '2024-08-10',
      endDate: '2024-08-15',
      image: '/images/phuquoc.jpg',
    },
  ]);

  const [recentSearches, setRecentSearches] = useState([
    'Hà Nội', 'Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng'
  ]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // If not logged in, don't render the dashboard content
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Xin chào, {username || 'Người dùng'}!</h1>
        <p className="text-gray-600 mt-2">Chào mừng bạn quay trở lại với TravelGO!</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700">Chuyến đi sắp tới</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{upcomingTrips.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700">Chuyến đi đã hoàn thành</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700">Điểm thưởng</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">350</p>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Chuyến đi sắp tới</h2>
          <button
            onClick={() => router.push('/trips')}
            className="text-blue-600 hover:text-blue-800"
          >
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={trip.image}
                  alt={trip.destination}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{trip.destination}</h3>
                <p className="text-gray-600 mt-2">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} - {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full">
            <button
              onClick={() => router.push('/trips/new')}
              className="text-blue-600 hover:text-blue-800 flex flex-col items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg font-medium">Tạo chuyến đi mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tìm kiếm gần đây</h2>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-full py-2 px-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push(`/explore?q=${search}`)}
            >
              {search}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
