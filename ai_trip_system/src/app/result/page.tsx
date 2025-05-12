"use client";
import Carousel from "@/components/carousel";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Result = () => {
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const router = useRouter();

  const handleClick = (): void => {
    setShowInfo((prev) => !prev);
  };

  const handleOnPlan = (): void => {
    router.push("/detail");
  };

  return (
    <main className="container mx-auto p-4">
      <div>
        <h1 className="text-center text-4xl font-bold text-red-600 mb-4 italic">
          Gợi ý lộ trình du lịch
        </h1>
        <div className="container mx-auto my-8 rounded-lg shadow-sm p-6">
          <span
            className="text-center text-2xl font-bold hover:bg-gray-100 cursor-pointer px-10"
            onClick={handleClick}
          >
            Ngày 1 (13/4/2025)
          </span>
          <div className={showInfo ? "block" : "hidden"}>
            <Carousel quantity={10} />
          </div>
        </div>

        <div className="flex flex-wrap gap-20 justify-center mb-10">
          <button
            className="text-green-700 border hover:bg-green-700 hover:text-white font-medium rounded-lg text-lg px-5 py-2.5"
            onClick={handleOnPlan}
          >
            Lên kế hoạch
          </button>
          <button className="text-yellow-400 border hover:bg-yellow-400 hover:text-black font-medium rounded-lg text-lg px-5 py-2.5">
            Chỉnh sửa
          </button>
          <button className="text-red-600 border hover:bg-red-600 hover:text-white font-medium rounded-lg text-lg px-5 py-2.5">
            Kết quả khác
          </button>
          <button className="text-cyan-400 border hover:bg-cyan-400 hover:text-white font-medium rounded-lg text-lg px-5 py-2.5">
            Chia sẻ
          </button>
        </div>
      </div>
    </main>
  );
};

export default Result;
