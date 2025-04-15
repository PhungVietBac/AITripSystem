"use client";
import Image from "next/image"

const DestinationCards = () => {
  const destinations = [
    {
      id: 1,
      name: "Vịnh Hạ Long",
      location: "Quảng Ninh",
      image: "/destinations/halong.jpg",
    },
    {
      id: 2,
      name: "Phố cổ Hội An",
      location: "Quảng Nam",
      image: "/destinations/hoian.jpg",
    },
    {
      id: 3,
      name: "Sapa",
      location: "Lào Cai",
      image: "/destinations/sapa.jpg",
    },
    {
      id: 4,
      name: "Biển Nha Trang",
      location: "Khánh Hòa",
      image: "/destinations/nhatrang.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-compass text-blue-900"></i>
        <h3 className="text-lg font-semibold text-blue-900">
          Khám phá địa điểm mới
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="group relative rounded-lg overflow-hidden cursor-pointer"
          >
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback image if the main image fails to load
                  e.currentTarget.src = "/destinations/default.jpg";
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 p-3">
                <h4 className="text-white font-medium text-lg">{dest.name}</h4>
                <p className="text-white/90 text-sm flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  {dest.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationCards;
