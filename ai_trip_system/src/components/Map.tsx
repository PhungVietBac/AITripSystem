"use client";
import { useState, useEffect, useRef } from "react";
import { FaLocationArrow, FaGlobeAmericas } from "react-icons/fa";

interface LocationItem {
  name: string;
  lat: number;
  lon: number;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

const LeafletMap = ({ location }: { location?: LocationItem }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      // Clean up map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Fix default icons
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Initialize map
      const map = L.map(mapRef.current!).setView([16.0, 106.0], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;

      // Show selected location if provided
      if (location) {
        L.marker([location.lat, location.lon])
          .addTo(map)
          .bindPopup(`<b>${location.name}</b>`)
          .openPopup();
        map.setView([location.lat, location.lon], 12);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLoc: UserLocation = {
          lat: latitude,
          lng: longitude,
          accuracy,
        };
        setUserLocation(newLoc);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          import("leaflet").then((L) => {
            const userIcon = L.divIcon({
              className: "user-location-marker",
              html: '<div style="background-color: #FF4757; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(255,71,87,0.5); animation: pulse 2s infinite;"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstanceRef.current!)
              .bindPopup("<b>Vị trí của bạn</b>")
              .openPopup();

            mapInstanceRef.current!.setView([latitude, longitude], 14);
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);

        let message = "Không thể lấy vị trí của bạn.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Bạn đã từ chối chia sẻ vị trí.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Thông tin vị trí không khả dụng.";
            break;
          case error.TIMEOUT:
            message = "Yêu cầu vị trí đã hết thời gian.";
            break;
        }
        alert(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([15.5, 109.0], 6);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Map container with dynamic key to force re-render */}
      <div
        key={location ? `${location.lat}-${location.lon}` : "default"}
        ref={mapRef}
        className="h-full w-full"
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 disabled:opacity-50 ${
            userLocation ? "bg-blue-500 text-white" : "bg-white text-gray-600"
          }`}
          title="Lấy vị trí hiện tại"
        >
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaLocationArrow className="w-4 h-4" />
          )}
          <span className="text-sm font-medium hidden sm:inline">
            {isLocating
              ? "Đang định vị..."
              : userLocation
              ? "Cập nhật"
              : "Vị trí"}
          </span>
        </button>

        <button
          onClick={resetView}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
          title="Xem toàn cảnh Việt Nam"
        >
          <FaGlobeAmericas className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">
            Toàn cảnh
          </span>
        </button>
      </div>

      {/* User Location Display */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
            <span className="text-sm text-gray-700 font-medium">
              Vị trí của bạn
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Main Map Component with SSR safety
const Map = ({ location }: { location?: LocationItem }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <FaGlobeAmericas className="text-4xl text-blue-500 mx-auto mb-2 animate-spin" />
          <div className="text-gray-600 font-medium">
            Đang tải bản đồ Việt Nam...
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Vui lòng đợi trong giây lát
          </div>
        </div>
      </div>
    );
  }

  return <LeafletMap location={location} />;
};

export default Map;
