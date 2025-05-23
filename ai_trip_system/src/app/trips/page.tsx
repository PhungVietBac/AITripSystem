'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function MyTrips() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const [trips, setTrips] = useState({
    upcoming: [
      {
        id: 1,
        destination: 'Đà Lạt',
        startDate: '2024-07-15',
        endDate: '2024-07-20',
        image: '/images/dalat.jpg',
        status: 'confirmed',
      },
      {
        id: 2,
        destination: 'Phú Quốc',
        startDate: '2024-08-10',
        endDate: '2024-08-15',
        image: '/images/phuquoc.jpg',
        status: 'planning',
      },
    ],
    past: [
      {
        id: 3,
        destination: 'Hà Nội',
        startDate: '2024-01-05',
        endDate: '2024-01-10',
        image: '/images/hanoi.jpg',
        status: 'completed',
      },
      {
        id: 4,
        destination: 'Đà Nẵng',
        startDate: '2023-11-20',
        endDate: '2023-11-25',
        image: '/images/danang.jpg',
        status: 'completed',
      },
      {
        id: 5,
        destination: 'Nha Trang',
        startDate: '2023-09-15',
        endDate: '2023-09-20',
        image: '/images/nhatrang.jpg',
        status: 'completed',
      },
    ],
    saved: [
      {
        id: 6,
        destination: 'Sapa',
        image: '/images/sapa.jpg',
        savedDate: '2024-05-01',
      },
      {
        id: 7,
        destination: 'Huế',
        image: '/images/hue.jpg',
        savedDate: '2024-04-15',
      },
    ],
  });

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Đã xác nhận</span>;
      case 'planning':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Đang lên kế hoạch</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Đã hoàn thành</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Chuyến đi của tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý tất cả các chuyến đi của bạn</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Sắp tới
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Đã qua
            </button>
          </li>
          <li>
            <button
              className={`inline-block py-4 px-4 text-sm font-medium ${
                activeTab === 'saved'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Đã lưu
            </button>
          </li>
        </ul>
      </div>

      {/* Create New Trip Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/trips/new')}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tạo chuyến đi mới
        </button>
      </div>

      {/* Trip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'upcoming' && trips.upcoming.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Bạn chưa có chuyến đi nào sắp tới.</p>
            <button
              onClick={() => router.push('/trips/new')}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Tạo chuyến đi mới
            </button>
          </div>
        )}

        {activeTab === 'upcoming' &&
          trips.upcoming.map((trip) => (
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{trip.destination}</h3>
                  {getStatusBadge(trip.status)}
                </div>
                <p className="text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} - {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => router.push(`/trips/${trip.id}/edit`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'past' && trips.past.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Bạn chưa có chuyến đi nào đã qua.</p>
          </div>
        )}

        {activeTab === 'past' &&
          trips.past.map((trip) => (
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{trip.destination}</h3>
                  {getStatusBadge(trip.status)}
                </div>
                <p className="text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} - {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Chi tiết
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Đánh giá
                  </button>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'saved' && trips.saved.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Bạn chưa lưu chuyến đi nào.</p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Khám phá điểm đến
            </button>
          </div>
        )}

        {activeTab === 'saved' &&
          trips.saved.map((trip) => (
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{trip.destination}</h3>
                <p className="text-gray-600">
                  Đã lưu vào: {new Date(trip.savedDate).toLocaleDateString('vi-VN')}
                </p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => router.push(`/explore/${trip.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => router.push(`/trips/new?destination=${trip.destination}`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Lên kế hoạch
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
