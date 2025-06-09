"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Map from "./MapCoponent";

export default function MapPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
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

  // Hàm lọc gợi ý dựa trên searchQuery
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    // Lọc danh sách gợi ý (cần truyền places từ MapComponent)
    // Đây là placeholder, sẽ được thay bằng dữ liệu thực tế từ props
    const dummyPlaces: Place[] = [
      { name: "Hà Nội", country: "Việt Nam", city: "Hà Nội", province: null, address: "Quận Hoàn Kiếm", description: "", rating: 4.5, type: 1, lat: 21.0278, lon: 105.8342, idplace: "1" },
      { name: "Đà Lạt", country: "Việt Nam", city: "Đà Lạt", province: "Lâm Đồng", address: "Thành phố Đà Lạt", description: "", rating: 4.7, type: 1, lat: 11.9418, lon: 108.4512, idplace: "2" },
    ];
    const filteredSuggestions = dummyPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Hàm xử lý khi chọn địa điểm từ gợi ý
  const handleSelectSuggestion = (place: Place) => {
    setSearchQuery(place.name);
    setSelectedPlaceId(place.idplace);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-0">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 mt-4 px-6">Bản đồ</h1>

        <div className="w-full px-6">
          <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4 relative" ref={menuRef}>

            {/* Nút đóng (nếu cần) */}
            {isMenuOpen && (
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}

            {/* Thanh tìm kiếm với danh sách gợi ý */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <form className="relative flex-grow h-[48px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Tìm kiếm địa điểm trên bản đồ"
                    className="w-full h-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </form>
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-md z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((place) => (
                      <div
                        key={place.idplace}
                        onClick={() => handleSelectSuggestion(place)}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        {place.image && (
                          <img src={place.image} alt={place.name} className="w-8 h-8 object-cover rounded" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{place.name}</p>
                          <p className="text-xs text-gray-500">{place.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="w-full mt-6 px-6 pb-3">
          <div className="w-full h-[600px] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <Map searchQuery={searchQuery} selectedPlaceId={selectedPlaceId} onSelectPlace={handleSelectSuggestion} />
          </div>
        </div>
      </main>
    </div>
  );
}