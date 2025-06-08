"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineExpandAlt } from "react-icons/ai";
import dynamic from "next/dynamic";
import { FaClock, FaMapMarkerAlt, FaTag, FaLightbulb, FaStar, FaShare, FaHeart, FaRegHeart, FaMapMarkedAlt, FaUtensils, FaHotel, FaShoppingBag } from "react-icons/fa";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";
import PlaceImage from "@/components/PlaceImage";
import Reviews from './Review';

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

// Define interface based on the API response structure
interface PlaceData {
  name: string;
  country: string;
  city: string;
  province: string;
  address: string;
  description: string;
  rating: number;
  type: number;
  lat: number;
  lon: number;
  idPlace: string;
}

// Additional UI data types that might not come directly from API
interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface NearbyPlace {
  name: string;
  distance: string;
  type: string;
}

export default function DetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idBooking = searchParams.get('idBooking');
  const idPlace = searchParams.get('idPlace');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("token") as string;
  const [imageUrl, setImageUrl] = useState("");

  // Optional additional data for UI enhancements
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);

  // Default additional information (could be fetched from another API endpoint)
  const uiHelperData = {
    openHours: "08:00 - 18:00",
    entranceFee: "Liên hệ để biết thêm chi tiết",
    bestTimeToVisit: "Sáng sớm hoặc chiều tối"
  };

  // Activities based on place type
  const getActivitiesByType = (type: number): string[] => {
    switch (type) {
      case 1: // Assuming 1 is historical site
        return ["Tham quan di tích", "Chụp ảnh", "Tìm hiểu lịch sử"];
      case 2: // Assuming 2 is beach
        return ["Tắm biển", "Thư giãn", "Thể thao nước"];
      default:
        return ["Tham quan", "Chụp ảnh", "Khám phá"];
    }
  };


  useEffect(() => {
    const fetchPlaceData = async () => {
      setIsLoading(true);
      try {
        if (!idPlace) {
          const placeResponse = await fetch(`https://aitripsystem-api.onrender.com/api/v1/bookings/${idBooking}/places/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          if (!placeResponse.ok) throw new Error("Không thể lấy thông tin địa điểm");

          const data: PlaceData = await placeResponse.json();
          setPlaceData(data);

        } else {
          const placeResponse = await fetch(`https://aitripsystem-api.onrender.com/api/v1/places?idPlace=${idPlace}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          if (!placeResponse.ok) throw new Error("Không thể lấy thông tin địa điểm");

          const data: PlaceData = await placeResponse.json();
          setPlaceData(data);
        }


        setError(null);
      } catch (err) {
        console.error("Error fetching place data:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceData();
  }, [idBooking, idPlace, token]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100">
        <Loading message="Đang tải thông tin địa điểm..." />
      </div>
    );
  }

  if (error || !placeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Không thể tải thông tin</h2>
          <p className="text-gray-600 mb-6">{error || "Vui lòng thử lại sau"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate activities based on place type
  const activities = getActivitiesByType(placeData.type);

  const handleBookingNow = () => {
    router.push(`/booking?idPlace=${idPlace}&namePlace=${placeData.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100">
      <main className="container mx-auto px-4 py-8">
        {/* Featured Image and Title Section */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6 shadow-xl">

          <PlaceImage
            idPlace={placeData.idPlace}
            altText={placeData.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{placeData.name}</h1>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
              >
                {isFavorite ?
                  <FaHeart className="text-red-500 text-xl" /> :
                  <FaRegHeart className="text-white text-xl" />
                }
              </button>
            </div>

            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${i < Math.round(placeData.rating) ? "text-yellow-400" : "text-gray-400"}`}
                />
              ))}
              <span className="text-white ml-2 font-medium">{placeData.rating}/5</span>
            </div>

            <p className="text-white/90 mt-2 text-sm md:text-base">{placeData.address}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b text-2xl text-gray-900 font-stretch-extra-condensed">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 font-medium ${activeTab === 'info' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'}`}
            >
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 font-medium ${activeTab === 'reviews' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'}`}
            >
              Đánh giá
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`flex-1 py-4 font-medium ${activeTab === 'nearby' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'}`}
            >
              Lân cận
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h2>
                  <p className="text-gray-600">{placeData.description || "Chưa có thông tin mô tả."}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Thông tin chi tiết</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <FaClock className="text-cyan-500" />
                      <div>
                        <p className="font-semibold">Giờ mở cửa</p>
                        <p className="text-gray-600 text-sm">{uiHelperData.openHours}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaTag className="text-cyan-500" />
                      <div>
                        <p className="font-semibold">Giá vé</p>
                        <p className="text-gray-600 text-sm">{uiHelperData.entranceFee}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaLightbulb className="text-cyan-500" />
                      <div>
                        <p className="font-semibold">Thời điểm lý tưởng</p>
                        <p className="text-gray-600 text-sm">{uiHelperData.bestTimeToVisit}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-cyan-500" />
                      <div>
                        <p className="font-semibold">Địa chỉ</p>
                        <p className="text-gray-600 text-sm">{placeData.address}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Hoạt động nổi bật</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activities.map((activity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600 font-semibold text-sm">{index + 1}</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative h-[300px] rounded-lg overflow-hidden mb-6 border-2 border-white shadow-lg">
                  <MapView />
                  <button
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="absolute bottom-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg"
                  >
                    <AiOutlineExpandAlt className="text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews Section */}
                {idPlace ? (
                  <Reviews idPlace={idPlace} />
                ) : (
                  <p className="text-gray-500 italic">Không thể hiển thị đánh giá do thiếu thông tin địa điểm.</p>
                )}
              </div>
            )}

            {activeTab === 'nearby' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Địa điểm lân cận</h2>
                {nearbyPlaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nearbyPlaces.map((place, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                          {place.type === 'Bãi biển' && <FaHotel className="text-cyan-600" />}
                          {place.type === 'Làng nghề' && <FaShoppingBag className="text-cyan-600" />}
                          {place.type === 'Di tích' && <FaMapMarkerAlt className="text-cyan-600" />}
                        </div>
                        <div>
                          <p className="font-semibold">{place.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{place.type}</span>
                            <span className="mx-2">•</span>
                            <span>{place.distance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Không có thông tin về các địa điểm lân cận.</p>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Call-to-action Buttons */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition shadow-md">
            <FaMapMarkedAlt /> <span>Xem trên bản đồ</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
            onClick={handleBookingNow}>
            <FaHotel /> <span>Đặt khách sạn gần đây</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition shadow-md col-span-2 md:col-span-1">
            <FaShare /> <span>Chia sẻ</span>
          </button>
        </div>
      </main>

      {/* Modal for expanded map */}
      {isMapExpanded && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-3/4 overflow-hidden relative">
            <button
              onClick={() => setIsMapExpanded(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md text-gray-700"
            >
              ✕
            </button>
            <div className="h-full w-full">
              <MapView />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
