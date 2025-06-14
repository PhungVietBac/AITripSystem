import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PlaceImage from "@/components/PlaceImage";

export default function PlaceCard({ place }: { place: PlaceResponse }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/place?idPlace=${place.idplace}`);
  };

  // Giới hạn mô tả
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Image section - sử dụng PlaceImage */}
      <div className="h-40 relative">
        <PlaceImage
          idPlace={place.idplace}
          altText={place.name}
          className="w-full h-full"
        />

        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center z-10">
          <FaStar className="mr-1 text-yellow-300" />
          {Number(place.rating).toFixed(1)}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {place.name}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <FaMapMarkerAlt className="mr-1 text-blue-500" />
          <span>{place.address}</span>
        </div>

        <p className="text-gray-600 text-sm">
          {truncateDescription(place.description ?? "")}
        </p>
      </div>
    </div>
  );
}
