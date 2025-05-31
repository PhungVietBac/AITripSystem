'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaDollarSign, FaRobot, FaArrowLeft, FaHeart, FaStar } from 'react-icons/fa';

export default function TripSuggestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // Parse URL parameters
  useEffect(() => {
    if (searchParams) {
      const data = {
        departure: searchParams.get('departure') || '',
        destination: searchParams.get('destination') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        travelers: searchParams.get('travelers') || '1',
        budget: searchParams.get('budget') || '',
        travelStyle: searchParams.get('travelStyle') || '',
        interests: searchParams.get('interests')?.split(',') || [],
        accommodation: searchParams.get('accommodation') || '',
        transportation: searchParams.get('transportation') || ''
      };
      setTripData(data);
      
      // Simulate AI processing
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [searchParams]);

  if (!isLoggedIn || !tripData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getBudgetLabel = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      'under-5m': 'Dưới 5 triệu',
      '5m-10m': '5 - 10 triệu',
      '10m-20m': '10 - 20 triệu',
      '20m-50m': '20 - 50 triệu',
      'over-50m': 'Trên 50 triệu'
    };
    return budgetMap[budget] || budget;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <FaRobot className="text-6xl text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI đang tạo lộ trình...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gợi ý lộ trình AI</h1>
            <p className="text-gray-600">Dựa trên thông tin bạn đã cung cấp</p>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Thông tin chuyến đi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Hành trình</p>
                <p className="font-semibold">{tripData.departure} → {tripData.destination}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-semibold">{formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Số người</p>
                <p className="font-semibold">{tripData.travelers} người</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Ngân sách</p>
                <p className="font-semibold">{getBudgetLabel(tripData.budget)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Placeholder */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaRobot className="text-6xl text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tính năng đang được phát triển</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chức năng tạo lộ trình AI đang được team phát triển và sẽ sớm được tích hợp vào hệ thống. 
            Bạn sẽ nhận được những gợi ý tuyệt vời cho chuyến đi của mình!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/trips')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Tạo lộ trình mới
            </button>
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
