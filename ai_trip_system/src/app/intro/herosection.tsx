"use client";

export default function HeroSections() {
  // Component với các phần tử du lịch chuyển động và nội dung tĩnh

  return (
    <div className="relative overflow-hidden">
      {/* Animated travel-themed elements - Phân bố đều hơn */}
      <div className="absolute top-14 left-24 text-white opacity-50 text-[10rem] animate-float-1">✈️</div>
      <div className="absolute top-4 right-14 text-white opacity-50 text-[10rem] animate-float-2">🏝️</div>
      <div className="absolute bottom-30 left-14 text-white opacity-50 text-[9rem] animate-float-3">🧳</div>
      <div className="absolute bottom-28 right-28 text-white opacity-50 text-[9rem] animate-float-5">🗺️</div>
      <div className="absolute top-4 left-1/3 text-white opacity-50 text-[9rem] animate-float-6">🚗</div>
      <div className="absolute bottom-48 right-1/3 text-white opacity-30 text-[9rem] animate-float-7">🏨</div>
      <div className="absolute top-72 left-58 text-white opacity-50 text-[9rem] animate-float-8">🌴</div>
      <div className="absolute bottom-72 right-52 text-white opacity-50 text-[9rem] animate-float-9">🚢</div>
      <div className="absolute bottom-0 left-0 right-0 flex text-white text-center">
        <div className="w-1/2 py-2 bg-[#000080]">
          Navy Blue
        </div>
        <div className="w-1/2 py-2 bg-[#00BFFF]">
          Sky Blue
        </div>
      </div>
      <div className="relative isolate px-6 pt-8 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white sm:text-7xl">
              Đi du lịch thông minh cùng TravelGO!
            </h1>
            <p className="mt-8 text-xl font-medium text-gray-100 sm:text-2xl">
              Khám phá điểm đến mới, tạo lộ trình tối ưu và tiết kiệm thời gian với hệ thống gợi ý thông minh được hỗ trợ bởi AI. Để mỗi chuyến đi của bạn trở nên đặc biệt và trọn vẹn hơn!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/login"
                className="rounded-md bg-[#4B3DB5] px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-opacity-90"
              >
                COLOR NAME FINDER
              </a>
              <div className="flex items-center text-white">
                <span className="text-sm font-medium mr-2">#000080</span>
                <span className="inline-block w-5 h-5 bg-[#000080] rounded-sm"></span>
                <span className="mx-2">👍</span>
                <span className="text-sm font-medium mr-2">#00BFFF</span>
                <span className="inline-block w-5 h-5 bg-[#00BFFF] rounded-sm"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
