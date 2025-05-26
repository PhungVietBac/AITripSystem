"use client";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaMapMarkerAlt,
  FaTimes,
  FaLocationArrow,
  FaUtensils,
  FaHotel,
  FaLandmark,
  FaUmbrellaBeach,
  FaStar,
} from "react-icons/fa";

// Fix default icon issue in Leaflet when using with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Vietnam bounds for initial view
const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772];
const VIETNAM_ZOOM = 6;

// Custom user location icon
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Component to handle map updates
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

const Map = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [mapCenter, setMapCenter] = useState<[number, number]>(VIETNAM_CENTER);
  const [mapZoom, setMapZoom] = useState(VIETNAM_ZOOM);
  const [isLocating, setIsLocating] = useState(false);

  // Check and request location permission
  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      // Fallback for browsers that don't support Permissions API
      requestLocation();
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });

      if (permission.state === 'prompt') {
        // Permission not yet decided, will show browser dialog
        requestLocation();
      } else if (permission.state === 'granted') {
        // Permission already granted, but still request fresh location
        requestLocation();
      } else {
        // Permission denied
        setLocationPermission('denied');
        alert('Quyền truy cập vị trí đã bị từ chối. Vui lòng bật lại trong cài đặt trình duyệt.');
      }
    } catch (error) {
      // Fallback if permission query fails
      requestLocation();
    }
  };

  // Request user location using browser's native permission dialog
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
      setLocationPermission('denied');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation: UserLocation = {
          lat: latitude,
          lng: longitude,
          accuracy
        };

        setUserLocation(newLocation);
        setMapCenter([latitude, longitude]);
        setMapZoom(13); // Zoom closer to user location
        setLocationPermission('granted');
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
        setIsLocating(false);

        let errorMessage = 'Không thể lấy vị trí của bạn.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối chia sẻ vị trí. Vui lòng bật lại trong cài đặt trình duyệt.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Yêu cầu vị trí đã hết thời gian.';
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Always request fresh location, don't use cached data
      }
    );
  };

  // Auto-request location when component mounts
  useEffect(() => {
    // Check permission and request location on component mount
    const timer = setTimeout(() => {
      checkLocationPermission();
    }, 1000); // Small delay to ensure component is fully mounted

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="map-container relative h-full">

      <MapContainer
        center={VIETNAM_CENTER}
        zoom={VIETNAM_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="map-view z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map updater to handle center and zoom changes */}
        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <FaMapMarkerAlt className="text-blue-500 mx-auto mb-1" />
                <div className="font-semibold text-sm">Vị trí của bạn</div>
                {userLocation.accuracy && (
                  <div className="text-xs text-gray-600">
                    Độ chính xác: ~{Math.round(userLocation.accuracy)}m
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {/* Location button - always show to allow re-requesting location */}
        <button
          onClick={checkLocationPermission}
          disabled={isLocating}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 disabled:opacity-50"
          title={isLocating ? "Đang lấy vị trí..." : "Yêu cầu vị trí hiện tại"}
        >
          {isLocating ? (
            <div className="w-4 h-4 border border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaLocationArrow className="text-gray-600 w-4 h-4" />
          )}
        </button>

        {/* Reset view button */}
        <button
          onClick={() => {
            setMapCenter(VIETNAM_CENTER);
            setMapZoom(VIETNAM_ZOOM);
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          title="Xem toàn bộ Việt Nam"
        >
          <FaMapMarkerAlt className="text-gray-600 w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Bản đồ Việt Nam</h4>
        <div className="flex flex-col gap-1">
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700">Vị trí của bạn</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {userLocation
              ? 'Nhấp vào marker để xem chi tiết'
              : 'Cho phép định vị để xem vị trí của bạn'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
