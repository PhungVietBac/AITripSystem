'use client';

import Image from 'next/image';
import { FaWifi, FaCoffee, FaConciergeBell, FaStar, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaHourglass, FaTimes } from 'react-icons/fa';
import React from 'react';
import { getCookie } from 'cookies-next';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';

interface BookingCardProps {
  idBooking: string;
  idPlace: number;
  status: number;
  date: string;
  placeName?: string;
  placeImage?: string;
}

interface UserInfo {
  id: number;
  name: string;
  username: string;
  gender: boolean;
  email: string;
  phoneNumber?: string
}

export default function BookingCard({
  idBooking
}: {
  idBooking: string;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showUserModal, setShowUserModal] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const token = getCookie('token');
  const [data, setData] = React.useState<BookingCardProps | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://aitripsystem-api.onrender.com/api/v1/bookings?idBooking=${idBooking}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`API error ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const json = await response.json();
      console.log('Booking data:', json);
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    setLoadingUser(true);
    try {
      const response = await fetch(`https://aitripsystem-api.onrender.com/api/v1/bookings/${idBooking}/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }
      
      const userData = await response.json();
      setUserInfo(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [idBooking]);

  const handleViewUserInfo = () => {
    setShowUserModal(true);
    if (!userInfo && !loadingUser) {
      fetchUserInfo();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Không có thông tin';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
        <Loading message="Đang tải thông tin đặt chỗ..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
        <p className="text-center text-gray-600">Không tìm thấy thông tin đặt chỗ</p>
      </div>
    );
  }

  return (
    <div className="border-gray-700 bg-blue-100 rounded-lg shadow-lg filter backdrop-blur-sm p-4 overflow-hidden w-full md:w-4/5 mx-auto">      
      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">
            {data.placeName || `Địa điểm #${data.idPlace} (nhét link tới trang chi tiết địa điểm chỗ này)`} {/* Add link to place details here*/}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.status === 1 ? 'bg-green-100 text-green-800' : 
            data.status === 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data.status === 1 ? 'CONFIRMED' : 
             data.status === 0 ? 'PENDING' : 'CANCELED'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-1">
          <FaMapMarkerAlt className="mr-2 text-gray-500" />
          <span className="text-sm">Địa điểm ID: {data.idPlace}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-1">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <span className="text-sm">
            {data.date ? formatDate(data.date) : 'Chưa có thông tin ngày'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <span className="text-sm font-medium mr-2">Mã đặt chỗ:</span>
          <span className="text-sm font-bold">{data.idBooking}</span>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center px-2 py-1 bg-gray-100 rounded-md">
            <FaWifi className="mr-1 text-gray-600" />
            <span className="text-xs">Wifi miễn phí</span>
          </div>
          <div className="flex items-center px-2 py-1 bg-gray-100 rounded-md">
            <FaCoffee className="mr-1 text-gray-600" />
            <span className="text-xs">Bữa sáng</span>
          </div>
          <div className="flex items-center px-2 py-1 bg-gray-100 rounded-md">
            <FaConciergeBell className="mr-1 text-gray-600" />
            <span className="text-xs">Dịch vụ phòng</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center">
          {data.status === 1 ? (
            <>
              <FaCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm text-green-600">Đã xác nhận đặt chỗ của bạn</span>
            </>
          ) : data.status === 0 ? (
            <>
              <FaHourglass className="text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-600">Đang chờ xác nhận</span>
            </>
          ) : (
            <>
              <FaTimes className="text-red-500 mr-2" />
              <span className="text-sm text-red-600">Đặt chỗ đã bị hủy</span>
            </>
          )}
        </div>
        
        <div className="mt-4 pt-4">
          <button 
            className="w-full py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition duration-200"
            onClick={handleViewUserInfo}
          >
            Xem thông tin người đặt
          </button>
        </div>
      </div>

      {/* Modal thông tin người dùng */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Thông tin người đặt"
        size="md"
      >
        {loadingUser ? (
          <div className="flex justify-center p-4">
            <Loading message="Đang tải thông tin người dùng..." />
          </div>
        ) : userInfo ? (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{userInfo.name}</p>
              <p className="text-sm text-gray-500">{userInfo.username}</p>
              <p className="text-sm text-gray-500">{userInfo.gender ? 'Nam' : 'Nữ'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userInfo.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">{userInfo.phoneNumber || 'Không có thông tin'}</p>
            </div>
            
            <button
              className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
              onClick={() => setShowUserModal(false)}
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">Không thể tải thông tin người dùng</p>
            <button
              className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition duration-200"
              onClick={fetchUserInfo}
            >
              Thử lại
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}