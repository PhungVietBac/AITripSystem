"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
  FaRobot,
  FaArrowLeft,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Carousel from "@/components/carousel";
import { useData } from "@/context/DataContext";
import clsx from "clsx";

export default function TripSuggestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  const [showInfo, setShowInfo] = useState<boolean[]>([]);
  const { data } = useData();

  const handleClick = (index: number) =>
    setShowInfo((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  const handleOnPlan = () => router.push("/detail");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Parse URL parameters
  useEffect(() => {
    if (searchParams) {
      const tripData = {
        departure: searchParams.get("departure") || "",
        destination: searchParams.get("destination") || "",
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
        travelers: searchParams.get("travelers") || "1",
        budget: searchParams.get("budget") || "",
        travelStyle: searchParams.get("travelStyle") || "",
        interests: searchParams.get("interests")?.split(",") || [],
        accommodation: searchParams.get("accommodation") || "",
        transportation: searchParams.get("transportation") || "",
      };
      setTripData(tripData);

      // Simulate AI processing
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [searchParams]);

  // Initialize showInfo array when data is loaded
  useEffect(() => {
    if (data?.parameters.days) {
      setShowInfo(Array(data.parameters.days.length).fill(true));
    }
  }, [data]);

  if (!isLoggedIn || !tripData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getBudgetLabel = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      "under-5m": "Dưới 5 triệu",
      "5m-10m": "5 - 10 triệu",
      "10m-20m": "10 - 20 triệu",
      "20m-50m": "20 - 50 triệu",
      "over-50m": "Trên 50 triệu",
    };
    return budgetMap[budget] || budget;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <FaRobot className="text-6xl text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            AI đang tạo lộ trình...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-800">
              Gợi ý lộ trình AI
            </h1> */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 drop-shadow-sm leading-relaxed"
            >
              Gợi ý lộ trình du lịch
            </motion.h1>
            <p className="text-gray-600">Dựa trên thông tin bạn đã cung cấp</p>
          </div>
        </div>
        {/* Trip Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Thông tin chuyến đi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Hành trình</p>
                <p className="font-semibold">
                  {tripData.departure} → {tripData.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-semibold">
                  {formatDate(tripData.startDate)} -{" "}
                  {formatDate(tripData.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Số người</p>
                <p className="font-semibold">{tripData.travelers} người</p>
              </div>
            </div>
          </div>
        </div>
        {/* Days Suggestions */}
        {data?.parameters.days.map((day, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-5"
          >
            <motion.div
              className="cursor-pointer text-center mb-6"
              onClick={() => handleClick(i)}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                {`Ngày ${i + 1} (${formatDate(day.date)})`}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showInfo[i] ? 1 : 0,
                height: showInfo[i] ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Carousel activities={day.activities} />
            </motion.div>
          </div>
        ))}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { label: "Lên kế hoạch", color: "green", onClick: handleOnPlan },
            { label: "Chỉnh sửa", color: "yellow" },
            { label: "Kết quả khác", color: "red" },
            { label: "Chia sẻ", color: "cyan" },
          ].map(({ label, color, onClick }) => {
            const base =
              "border-2 font-semibold rounded-xl px-6 py-3 transition-all duration-200";
            const colorClass = {
              green: "border-green-500 text-green-600 hover:bg-green-500",
              yellow: "border-yellow-500 text-yellow-600 hover:bg-yellow-500",
              red: "border-red-500 text-red-600 hover:bg-red-500",
              cyan: "border-cyan-500 text-cyan-600 hover:bg-cyan-500",
            }[color];

            return (
              <motion.button
                key={label}
                onClick={onClick}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={clsx(base, colorClass, "hover:text-white")}
              >
                {label}
              </motion.button>
            );
          })}
        </motion.div>
        {/* AI Suggestions Placeholder */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/trips")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Tạo lộ trình mới
            </button>
            <button
              onClick={() => router.push("/home")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
