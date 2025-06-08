"use client";


import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";

// Fix default icon issue
// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Vietnam bounds
// Vietnam bounds
const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772];
const VIETNAM_ZOOM = 6;

// Custom icons
// Custom icons
const userLocationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const getPlaceIcon = (type: number) => {
  let color = "#000000";
  if (type === 0) color = "#FF6347"; // Red for restaurant
  if (type === 2) color = "#FFD700"; // Gold for landmark
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="#ffffff"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
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
}

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [mapCenter, setMapCenter] = useState<[number, number]>(VIETNAM_CENTER);
  const [mapZoom, setMapZoom] = useState(VIETNAM_ZOOM);
  const [isLocating, setIsLocating] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [showPlaces, setShowPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" | "info" });
  const mapRef = useRef<L.Map | null>(null);
  const [mapKey, setMapKey] = useState(() => Math.random().toString(36).substr(2, 9));
  const { token } = useAuth(); // Lấy token từ AuthContext

  const fetcher = async (url: string) => {
    if (!token) throw new Error("No authorization token found");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch places");
    return response.json();
  };

  const { data: places, error, isLoading } = useSWR<Place[]>(
    "https://aitripsystem-api.onrender.com/api/v1/places/all",
    fetcher
  );

  useEffect(() => {
    if (places && places.length > 0) {
      setMapCenter([places[0].lat, places[0].lon]);
      setMapZoom(6);
    }
  }, [places]);

  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      requestLocation();
      return;
    }
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "prompt") requestLocation();
      else if (permission.state === "granted") requestLocation();
      else {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "prompt") requestLocation();
      else if (permission.state === "granted") requestLocation();
      else {
        setLocationPermission("denied");
        alert("Quyền truy cập vị trí đã bị từ chối. Vui lòng bật lại trong cài đặt trình duyệt.");
      }
    } catch (error) {
      requestLocation();
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      setLocationPermission("denied");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setMapCenter([latitude, longitude]);
        setMapZoom(13);
        setMapZoom(13);
        setLocationPermission("granted");
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationPermission("denied");
        setIsLocating(false);
        let errorMessage = "Không thể lấy vị trí của bạn.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối chia sẻ vị trí. Vui lòng bật lại trong cài đặt trình duyệt.";
            errorMessage = "Bạn đã từ chối chia sẻ vị trí. Vui lòng bật lại trong cài đặt trình duyệt.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng.";
            break;
          case error.TIMEOUT:
            errorMessage = "Yêu cầu vị trí đã hết thời gian.";
            break;
        }
        showToast(errorMessage, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    return () => {
      setMapKey(Math.random().toString(36).substr(2, 9));
    };
  }, []);

  if (isLoading) return <div className="h-full w-full flex items-center justify-center bg-gray-100">Đang tải dữ liệu...</div>;
  if (error) return <div className="h-full w-full flex items-center justify-center bg-gray-100">Lỗi: {error.message}</div>;

  return (
    <div className="map-container relative h-full">
      <MapContainer
        key={mapKey}
        center={VIETNAM_CENTER}
        zoom={VIETNAM_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="map-view z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapCenter[0] !== undefined && mapCenter[1] !== undefined && (
          <MapUpdater center={mapCenter} zoom={mapZoom} />
        )}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-center">
                <FaMapMarkerAlt className="text-blue-500 mx-auto mb-1" />
                <div className="font-semibold text-sm">Vị trí của bạn</div>
                {userLocation.accuracy && (
                  <div className="text-xs text-gray-600">Độ chính xác: ~{Math.round(userLocation.accuracy)}m</div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        {places &&
          places.map((place) => (
            <Marker key={place.idplace} position={[place.lat, place.lon]} icon={getPlaceIcon(place.type)}>
              <Popup>
                <div className="text-sm">
                  <h4 className="font-medium">{place.name}</h4>
                  <p className="text-xs text-gray-600">{place.address}</p>
                  <p className="text-xs text-gray-600">Đánh giá: {place.rating}</p>
                  <p className="text-xs text-gray-600">{place.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={checkLocationPermission}
          disabled={isLocating}
          className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 disabled:opacity-50 ${
            userLocation ? "bg-blue-500 text-white" : "bg-white text-gray-600"
          }`}
          title={isLocating ? "Đang lấy vị trí..." : userLocation ? "Cập nhật vị trí" : "Chia sẻ vị trí của bạn"}
        >
          {isLocating ? (
            <div className={`w-4 h-4 border ${userLocation ? "border-white border-t-transparent" : "border-gray-600 border-t-transparent"} rounded-full animate-spin`}></div>
          ) : (
            <FaLocationArrow className="w-4 h-4" />
          )}
        </button>
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
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Bản đồ Việt Nam</h4>
        <div className="flex flex-col gap-1">
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700">Vị trí của bạn</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-700">Nhà hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-700">Địa danh</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {userLocation ? "Nhấp vào marker để xem chi tiết" : "Nhấp nút định vị để chia sẻ vị trí"}
          </div>
        </div>
      </div>
      {toast.visible && (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
        toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
      } text-white`}
    >
      {toast.message}
        </div>
      )}
    </div>
  );
};

// Wrapper component
const Map = () => {
// Wrapper component
const Map = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Đang tải bản đồ...</div>
      </div>
    );
  }

  return <MapComponent />;
  return <MapComponent />;
};

export default Map;