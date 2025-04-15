"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image"
import { FaUtensils, FaHotel, FaCamera, FaLandmark,  FaRoute, FaSearch, FaUmbrellaBeach, FaStar } from "react-icons/fa";

const Map = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-0.5 py-2 w-full">
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <div className="map-container">
            <div className="map-view relative w-full h-96 bg-blue-50 rounded-lg mt-4">
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
                    <h4 className="text-sm font-semibold text-gray-800 mt-2">Nhà hàng Phố Cổ</h4>
                    <p className="text-xs text-gray-600 flex items-center">
                      <FaStar className="text-yellow-400 mr-1" /> 4.5 (200+ đánh giá)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">🕒 Mở cửa: 7:00 - 22:00</p>
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
                    <h4 className="text-sm font-semibold text-gray-800 mt-2">Công viên Thống Nhất</h4>
                    <p className="text-xs text-gray-600 flex items-center">
                      <FaStar className="text-yellow-400 mr-1" /> 4.8 (500+ đánh giá)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">🌳 Không gian xanh trong lòng thành phố</p>
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
                    <h4 className="text-sm font-semibold text-gray-800 mt-2">Khách sạn Hoàng Gia</h4>
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
                    <h4 className="text-sm font-semibold text-gray-800 mt-2">Bưu điện thành phố</h4>
                    <p className="text-xs text-gray-600 flex items-center">
                      <FaStar className="text-yellow-400 mr-1" /> 5.0 (750+ đánh giá)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Tòa nhà Bưu điện Thành phố Hồ Chí Minh</p>
                    <p className="text-xs text-gray-600 mt-1">🕒 Mở cửa: 7:00 - 22:00</p>
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

              {/* Nút zoom */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 12h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Map;