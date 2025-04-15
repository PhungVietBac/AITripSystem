import React from "react";
import Map from "../../components/Map";

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Bản đồ</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-[600px] rounded-xl border border-[#dadce0]">
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-900 ml-3">
                  Khám phá điểm đến
                </h1>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-lg">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    Địa điểm
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    <i className="fas fa-route mr-2"></i>
                    Lộ trình
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    <i className="fas fa-layer-group mr-2"></i>
                    Lớp
                  </button>
                </div>
              </div>
            </div>
            <Map />
          </div>
        </div>
      </main>
    </div>
  );
}
