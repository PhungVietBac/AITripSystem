import React from "react";
import { FaUtensils, FaHotel, FaUmbrellaBeach } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

export const legendItems = [
  { type: 0, color: "#FF0000", label: "Nhà hàng, Quán ăn", icon: FaUtensils },
  { type: 1, color: "#FFD700", label: "Khách sạn, Resort", icon: FaHotel },
  { type: 2, color: "#1E90FF", label: "Điểm du lịch", icon: FaUmbrellaBeach },
  { type: null, color: "#000000", label: "Các địa điểm khác", icon: BsThreeDots },
];

const Legend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 z-[1001]">
      <h4 className="text-sm font-semibold mb-2">Chú thích</h4>
      {legendItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              <Icon className="text-sm text-white" />
            </div>
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;