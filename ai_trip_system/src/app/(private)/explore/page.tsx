"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MapEx from "./Map_Ex";
import PlaceCard from "./PlaceCard";
import { FaList, FaMap, FaStar, FaMapMarkerAlt, FaCompass } from "react-icons/fa";
import { getCookie } from "cookies-next";
import vietnamProvinces from "@/data/vietnam-provinces.json";

interface Place {
  name: string;
  country: string;
  city: string;
  province: string | null;  // Có thể null theo schema
  address: string;
  description: string;
  rating: number;
  type?: number | null;     // Optional theo schema
  lat: number;
  lon: number;
  idplace: string;          // Sửa thành chữ thường theo schema
  image?: string;           // Đánh dấu là optional vì không có trong schema
}

export default function ExplorePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      visible: true,
      message,
      type
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // If not logged in, don't render the content
  if (!isLoggedIn) {
    return null;
  }

  const normalizePovinceName = (province: string): string => {
    // Remove common prefixes
    let normalized = province
      .replace(/^Tỉnh\s+/i, '') // Remove "Tỉnh" prefix
      .replace(/^tỉnh\s+/i, '')    // Remove "tỉnh" prefix
      .replace(/^thành phố\s+/i, '') // Remove "thành phố" prefix
      .replace(/^Thành phố\s+/i, '') // Remove "Thành phố" prefix
      .replace(/^tp\.\s*/i, '')    // Remove "tp." prefix
      .trim();

    // Optional: Map to standard names if needed
    const provinceMap: Record<string, string> = {
      'quảng nam': 'Quảng Nam',
      'quảng ninh': 'Quảng Ninh',
      // Add more mappings as needed
    };

    return provinceMap[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const fetchPlacesByProvince = async (province: string) => {
    setLoading(true);
    const normalizedProvince = normalizePovinceName(province);
    console.log(`Original: ${province}, Normalized: ${normalizedProvince}`);

    const token = getCookie("token");
    try {
      // Kiểm tra xem normalizedProvince có trong danh sách tỉnh thành không
      const isProvince = vietnamProvinces.provinces.some(
        p => p.toLowerCase() === normalizedProvince.toLowerCase()
      );

      console.log(`Checking ${normalizedProvince} - Is province: ${isProvince}`);

      // Gọi API tương ứng dựa trên kết quả kiểm tra
      const endpoint = isProvince ? "province" : "city";
      const response = await fetch(
        `https://aitripsystem-api.onrender.com/api/v1/places/${endpoint}?lookup=${encodeURIComponent(normalizedProvince)}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.ok) {
        const rawData = await response.json();
        console.log("Raw API data:", rawData);

        // Kiểm tra và xử lý cấu trúc dữ liệu
        const data = Array.isArray(rawData) ? rawData :
          (rawData.data ? rawData.data : []);

        console.log("Processed data:", data);
        setPlaces(data);
        setShowPlaces(true);
        showToast(`Đã tìm thấy ${data.length} địa điểm`, 'success');
      } else {
        console.error("API request failed with status:", response.status);
        // Thử phương pháp dự phòng nếu lỗi
        try {
          const fallbackEndpoint = isProvince ? "city" : "province";
          console.log(`Trying fallback API with ${fallbackEndpoint} endpoint`);
          const fallbackResponse = await fetch(
            `https://aitripsystem-api.onrender.com/api/v1/places/${fallbackEndpoint}?lookup=${encodeURIComponent(normalizedProvince)}`,
            {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
            }
          );

          if (fallbackResponse.ok) {
            const rawData = await fallbackResponse.json();
            const data = Array.isArray(rawData) ? rawData : (rawData.data ? rawData.data : []);
            setPlaces(data);
            setShowPlaces(true);
            showToast(`Đã tìm thấy ${data.length} địa điểm`, 'success');
          } else {
            setPlaces([]);
            setShowPlaces(true);
          }
        } catch (fallbackError) {
          console.error("Fallback request also failed:", fallbackError);
          setPlaces([]);
          setShowPlaces(true);
        }
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setPlaces([]);
      setShowPlaces(true);
    } finally {
      setLoading(false);
      showToast("Đã tải xong địa điểm", 'info');
    }
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    fetchPlacesByProvince(province);
  };

  const handleBackToMap = () => {
    setShowPlaces(false);
    setSelectedProvince(null);
    setPlaces([]);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Main content */}
      <div className="p-6">
        {/* Header nav và button "Quay lại" */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {showPlaces && (
              <button
                onClick={handleBackToMap}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H15a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại
              </button>
            )}
            <h2 className="text-xl font-bold text-red-500">
              {showPlaces ? `Gợi ý lộ trình du lịch` : 'Khám phá địa điểm'}
            </h2>
          </div>
        </div>

        {/* Map and Places Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex">
            {/* Map Section */}
            <div className={`transition-all duration-300 ${showPlaces ? "w-2/3" : "w-full"} relative overflow-hidden`}>
              <MapEx
                onProvinceSelect={handleProvinceSelect}
                className="h-[calc(100vh-180px)] w-full z-0"
              />
            </div>

            {/* Places List Section */}
            {showPlaces && (
              <div className="w-1/3 border-l border-gray-200 flex flex-col">
                {/* Places Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Địa điểm tại {selectedProvince}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {places.length} địa điểm được tìm thấy
                      </p>
                    </div>
                    <FaList className="w-5 h-5 text-blue-500" />
                  </div>
                </div>

                {/* Places List */}
                <div className="flex-1 h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] overflow-y-scroll bg-white">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                  ) : places.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <FaMapMarkerAlt className="w-8 h-8 mb-2 text-blue-500" />
                      <p>Không tìm thấy địa điểm nào</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {places.map((place, index) => (
                        <div
                          key={place.idplace}
                          className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.5s ease forwards'
                          }}
                        >
                          <PlaceCard place={place} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
