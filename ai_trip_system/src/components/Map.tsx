"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FaUtensils,
  FaHotel,
  FaCamera,
  FaLandmark,
  FaRoute,
  FaSearch,
  FaUmbrellaBeach,
  FaStar,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet when using with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const VisitIconPopup = () => {
  const visitMarkerRef = useRef<any>(null);
  const position: [number, number] = [10.870016383538559, 106.80303310089239];

  useEffect(() => {
    if (visitMarkerRef.current) {
      visitMarkerRef.current.openPopup();
    }
  }, []);

  return (
    <Marker position={position} ref={visitMarkerRef}>
      <Popup>Trường Đại học Công nghệ Thông tin - UIT</Popup>
    </Marker>
  );
};

const Map = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  return (
    <div className="map-container relative">
      <MapContainer
        center={[10.87, 106.803]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
        className="map-view rounded-lg mt-4 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <VisitIconPopup />
      </MapContainer>
      {/* Điểm đánh dấu mẫu */}
      <div
        className="absolute"
        style={{ top: "30%", left: "40%" }}
        onMouseEnter={() => setHoveredLocation("restaurant")}
        onMouseLeave={() => setHoveredLocation(null)}
      >
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
          <FaUtensils className="text-white w-5 h-5" />
        </div>
        {/* Tooltip hiển thị khi hover */}
        {hoveredLocation === "restaurant" && (
          <div className="absolute top-0 left-12 bg-white p-3 rounded-lg shadow-md w-60 z-10">
            <Image
              src="/images/restaurant.jpg" // Đường dẫn ảnh placeholder
              alt="Nhà hàng"
              width={200}
              height={100}
              className="rounded-lg"
            />
            <h4 className="text-sm font-semibold text-gray-800 mt-2">
              Nhà hàng Phố Cổ
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> 4.5 (200+ đánh giá)
            </p>
            <p className="text-xs text-gray-600 mt-1">
              🕒 Mở cửa: 7:00 - 22:00
            </p>
          </div>
        )}
      </div>

      <div
        className="absolute"
        style={{ top: "45%", left: "60%" }}
        onMouseEnter={() => setHoveredLocation("park")}
        onMouseLeave={() => setHoveredLocation(null)}
      >
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <FaUmbrellaBeach className="text-white w-5 h-5" />
        </div>
        {hoveredLocation === "park" && (
          <div className="absolute top-0 left-12 bg-white p-3 rounded-lg shadow-md w-60 z-10">
            <Image
              src="/images/park.jpg" // Đường dẫn ảnh placeholder
              alt="Công viên"
              width={200}
              height={100}
              className="rounded-lg"
            />
            <h4 className="text-sm font-semibold text-gray-800 mt-2">
              Công viên Thống Nhất
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> 4.8 (500+ đánh giá)
            </p>
            <p className="text-xs text-gray-600 mt-1">
              🌳 Không gian xanh trong lòng thành phố
            </p>
          </div>
        )}
      </div>

      <div
        className="absolute"
        style={{ top: "25%", left: "70%" }}
        onMouseEnter={() => setHoveredLocation("hotel")}
        onMouseLeave={() => setHoveredLocation(null)}
      >
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <FaHotel className="text-white w-5 h-5" />
        </div>
        {hoveredLocation === "hotel" && (
          <div className="absolute top-0 left-12 bg-white p-3 rounded-lg shadow-md w-60 z-10">
            <Image
              src="/images/hotel.jpg" // Đường dẫn ảnh placeholder
              alt="Khách sạn"
              width={200}
              height={100}
              className="rounded-lg"
            />
            <h4 className="text-sm font-semibold text-gray-800 mt-2">
              Khách sạn Hoàng Gia
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> 4.7 (300+ đánh giá)
            </p>
            <p className="text-xs text-gray-600 mt-1">💰 2,000,000 VND/đêm</p>
          </div>
        )}
      </div>

      <div
        className="absolute"
        style={{ top: "70%", left: "90%" }}
        onMouseEnter={() => setHoveredLocation("post-office")}
        onMouseLeave={() => setHoveredLocation(null)}
      >
        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
          <FaLandmark className="text-white w-5 h-5" />
        </div>
        {hoveredLocation === "post-office" && (
          <div className="absolute top-0 left-12 bg-white p-3 rounded-lg shadow-md w-60 z-10">
            <Image
              src="https://bcp.cdnchinhphu.vn/334894974524682240/2023/6/5/bd-tphcm-16859383704441853568656.png" // Đường dẫn ảnh placeholder
              alt="Bưu điện thành phố"
              width={200}
              height={100}
              className="rounded-lg"
            />
            <h4 className="text-sm font-semibold text-gray-800 mt-2">
              Bưu điện thành phố
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> 5.0 (750+ đánh giá)
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Tòa nhà Bưu điện Thành phố Hồ Chí Minh
            </p>
            <p className="text-xs text-gray-600 mt-1">
              🕒 Mở cửa: 7:00 - 22:00
            </p>
          </div>
        )}
      </div>

      {/* Chú thích bản đồ */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">Nhà hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">Khách sạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Đi chơi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Tham quan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
