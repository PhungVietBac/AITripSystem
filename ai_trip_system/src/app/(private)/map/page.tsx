"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaRoute, FaSearch, FaTimes, FaCar, FaWalking, FaBus, FaMotorcycle, FaBicycle } from "react-icons/fa";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function MapPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRouteFields, setShowRouteFields] = useState(false);
  const [transportMode, setTransportMode] = useState<"car" | "walk" | "bus" | "motorcycle" | "bicycle">("car");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Add input ref

  interface Place {
    name: string;
    country: string;
    city: string;
    province: string | null;
    address: string;
    description: string;
    rating: number;
    type: number;
    lat: number;
    lon: number;
    idplace: string;
    image?: string;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (isFocused) {
        setSuggestions(places.slice(0, 15));
      } else {
        setSuggestions([]);
      }
    } else {
      const filteredSuggestions = places.filter((place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 15);
      setSuggestions(filteredSuggestions);
      console.log("searchQuery updated to:", searchQuery);
    }
  }, [searchQuery, places, isFocused]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSuggestions(places.slice(0, 15));
    } else {
      const filteredSuggestions = places.filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.address.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 15);
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSelectSuggestion = (place: Place) => {
    setSearchQuery(place.name);
    setSuggestions(places.slice(0, 15));
    setIsFocused(false);
    if (mapRef.current) {
      mapRef.current.handleMarkerClick(place);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-0">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 mt-4 px-6">Bản đồ</h1>

        <div className="w-full px-6">
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4 relative">

            {/* Nút đóng */}
            {showRouteFields && (
              <button
                onClick={() => setShowRouteFields(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}

            {/* Thanh tìm kiếm hoặc input lộ trình */}
            {!showRouteFields ? (
              <div className="flex flex-col md:flex-row gap-4">
                <form className="relative flex-grow h-[48px]">
                  <input
                    type="text"
                    placeholder="Tìm kiếm trên bản đồ"
                    className="w-full h-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </form>

                <button
                  onClick={() => setShowRouteFields(true)}
                  className="flex items-center gap-2 h-[48px] px-4 bg-[#000080] hover:bg-[#00BFFF] text-white rounded-lg transition-colors duration-300"
                >
                  <FaRoute className="w-4 h-4" />
                  <span className="text-sm leading-none">Lộ trình</span>
                </button>
              </div>
            ) : (
              <>
                {/* Tabs phương tiện di chuyển */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setTransportMode("car")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${transportMode === "car" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <FaCar /> Ô tô
                  </button>
                  <button
                    onClick={() => setTransportMode("walk")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${transportMode === "walk" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <FaWalking /> Đi bộ
                  </button>
                  <button
                    onClick={() => setTransportMode("bus")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${transportMode === "bus" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <FaBus /> Xe buýt
                  </button>
                  <button
                    onClick={() => setTransportMode("motorcycle")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${transportMode === "motorcycle" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <FaMotorcycle /> Xe máy
                  </button>
                  <button
                    onClick={() => setTransportMode("bicycle")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${transportMode === "bicycle" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <FaBicycle /> Xe đạp
                  </button>
                </div>

                {/* Hai input: điểm bắt đầu - điểm kết thúc */}
                <div className="flex flex-col gap-3">
                  <div className="relative h-[48px]">
                    <input
                      type="text"
                      placeholder="Bạn muốn bắt đầu từ đâu?"
                      className="w-full h-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                    >
                      <FaSearch className="w-5 h-5" />
                    </button>
                  </div>
                            
                  <div className="relative h-[48px]">
                    <input
                      type="text"
                      placeholder="Bạn muốn đi đến đâu?"
                      className="w-full h-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                    >
                      <FaSearch className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bản đồ */}
        <div className="w-full mt-6 px-6 pb-3">
          <div className="w-full h-[600px] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <MapView />
          </div>
        </div>
      </main>
    </div>
  );
}