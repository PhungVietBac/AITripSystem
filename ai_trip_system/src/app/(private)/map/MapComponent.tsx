"use client";

import { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle, Ref } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaLocationArrow, FaTimes } from "react-icons/fa";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import PlaceCardComponent from "./MapPagePlaceCard";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772];
const VIETNAM_ZOOM = 6;

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

const getPlaceIcon = (isSelected: boolean = false) => {
  const color = isSelected ? "#00FF00" : "#000000";
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
    </svg>
  `.trim();
  return new L.Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svgString),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  const prevCenterRef = useRef(center);
  const prevZoomRef = useRef(zoom);

  useEffect(() => {
    if (
      center[0] !== prevCenterRef.current[0] ||
      center[1] !== prevCenterRef.current[1] ||
      zoom !== prevZoomRef.current
    ) {
      map.setView(center, zoom);
      prevCenterRef.current = center;
      prevZoomRef.current = zoom;
    }
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
  image?: string;
}

interface MapProps {
  searchQuery?: string;
  onSelectPlace?: (place: Place) => void;
  onPlacesLoaded?: (places: Place[]) => void;
  updateSearchQuery?: (name: string) => void;
}

const MapClickHandler = ({ onMarkerClick, updateMapState }: { onMarkerClick: (place: Place) => void; updateMapState: (center: [number, number], zoom: number) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      updateMapState([center.lat, center.lng], zoom);
    },
  });

  return null;
};

const MapComponent = forwardRef(
  (
    { searchQuery, onSelectPlace, onPlacesLoaded, updateSearchQuery }: MapProps,
    ref: Ref<{ handleMarkerClick: (place: Place) => void; updateMapState: (center: [number, number], zoom: number) => void }>
  ) => {
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");
    const [mapCenter, setMapCenter] = useState<[number, number]>(VIETNAM_CENTER);
    const [mapZoom, setMapZoom] = useState(VIETNAM_ZOOM);
    const [isLocating, setIsLocating] = useState(false);
    const [places, setPlaces] = useState<Place[]>([]);
    const [showPlaces, setShowPlaces] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" | "info" });
    const mapRef = useRef<L.Map | null>(null);

    const { token, isLoggedIn } = useAuth();

    const fetcher = async (url: string) => {
      if (!token) throw new Error("No authorization token found");
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch places");
      return response.json();
    };

    const { data: initialPlaces, error: initialError, isLoading: initialLoading } = useSWR<Place[]>(
      "https://aitripsystem-api.onrender.com/api/v1/places/all",
      fetcher,
      { refreshInterval: 30000 } // Làm mới dữ liệu mỗi 30 giây
    );

    useEffect(() => {
      if (initialPlaces && initialPlaces.length > 0) {
        setPlaces(initialPlaces);
        if (!userLocation && !selectedPlace && mapCenter === VIETNAM_CENTER) {
          setMapCenter([initialPlaces[0].lat, initialPlaces[0].lon]);
          setMapZoom(6);
        }
        if (onPlacesLoaded) onPlacesLoaded(initialPlaces);
      }
    }, [initialPlaces, onPlacesLoaded, userLocation, selectedPlace, mapCenter]);

    useEffect(() => {
      if (!isLoggedIn) {
        window.location.href = "/login";
      }
    }, [isLoggedIn]);

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
          setLocationPermission("denied");
          showToast("Quyền truy cập vị trí đã bị từ chối. Vui lòng bật lại trong cài đặt trình duyệt.", "error");
        }
      } catch {
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
          setMapCenter([latitude, longitude]);
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

    const handleMarkerClick = (place: Place) => {
      setSelectedPlace(place);
      setMapCenter([place.lat, place.lon]);
      setMapZoom(15);
      setShowPlaces(true);
      if (onSelectPlace) onSelectPlace(place);
      if (updateSearchQuery) {
        updateSearchQuery(place.name);
      }
    };

    const showToast = (message: string, type: "success" | "error" | "info") => {
      setToast({ visible: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 5000);
    };

    const allPlaces = useMemo(() => places, [places]);

    const updateMapState = useCallback((center: [number, number], zoom: number) => {
      setMapCenter(center);
      setMapZoom(zoom);
    }, []);

    useImperativeHandle(ref, () => ({
      handleMarkerClick,
      updateMapState,
    }));

    if (initialLoading) return <div className="h-full w-full flex items-center justify-center bg-gray-100">Đang tải dữ liệu...</div>;
    if (initialError) return <div className="h-full w-full flex items-center justify-center bg-gray-100">Lỗi: {initialError.message}</div>;

    return (
      <div className="min-h-screen bg-blue-50">
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center"></div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex">
              <div className={`transition-all duration-300 ${showPlaces ? "w-2/3" : "w-full"} relative overflow-hidden`}>
                <div className="map-container relative h-[calc(100vh-180px)] w-full">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    className="map-view z-0"
                    ref={mapRef}
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={mapCenter} zoom={mapZoom} />
                    <MapClickHandler onMarkerClick={handleMarkerClick} updateMapState={updateMapState} />
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
                    {allPlaces &&
                      allPlaces.map((place) => (
                        <Marker
                          key={place.idplace}
                          position={[place.lat, place.lon]}
                          icon={getPlaceIcon(selectedPlace?.idplace === place.idplace)}
                          eventHandlers={{
                            click: () => handleMarkerClick(place),
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup(),
                          }}
                        >
                          <Popup
                            autoClose={false}
                            closeOnClick={false}
                            className="custom-popup max-w-xs p-2"
                          >
                            <div className="flex items-center space-x-2">
                              {place.image && (
                                <img
                                  src={place.image}
                                  alt={place.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="text-sm font-medium">{place.name}</span>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={checkLocationPermission}
                      disabled={isLocating}
                      className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 disabled:opacity-50 ${userLocation ? "bg-blue-500 text-white" : "bg-white text-gray-600"}`}
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
                        setShowPlaces(false);
                        setSelectedPlace(null);
                      }}
                      className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                      title="Xem toàn bộ Việt Nam"
                    >
                      <FaMapMarkerAlt className="text-gray-600 w-4 h-4" />
                    </button>
                    {showPlaces && (
                      <button
                        onClick={() => {
                          setShowPlaces(false);
                          setSelectedPlace(null);
                        }}
                        className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                        title="Hủy chọn"
                      >
                        <FaTimes className="text-gray-600 w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                    {userLocation && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                        <span className="text-xs text-gray-700">Vị trí của bạn</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {userLocation ? "Nhấp vào marker để xem chi tiết" : "Nhấp nút định vị để chia sẻ vị trí"}
                    </div>
                  </div>
                </div>
              </div>
              {showPlaces && selectedPlace && (
                <div className="w-1/3 border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between">
                      <div></div>
                      <FaTimes
                        onClick={() => {
                          setShowPlaces(false);
                          setSelectedPlace(null);
                        }}
                        className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-800"
                      />
                    </div>
                  </div>
                  <div className="flex-1 h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] overflow-y-scroll bg-white p-4">
                    <PlaceCardComponent place={selectedPlace} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {toast.visible && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"}`}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  }
);

const Map = forwardRef((props: MapProps, ref: Ref<{ handleMarkerClick: (place: Place) => void; updateMapState: (center: [number, number], zoom: number) => void }>) => {
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

  return <MapComponent {...props} ref={ref} />;
});

export default Map;