export default function HeroSections() {

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-semibold text-cyan-950 sm:text-7xl">
              Đi du lịch thông minh cùng TravelGO!
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl/8">
              Khám phá điểm đến mới, tạo lộ trình tối ưu và tiết kiệm thời gian với hệ thống gợi ý thông minh được hỗ trợ bởi AI. Để mỗi chuyến đi của bạn trở nên đặc biệt và trọn vẹn hơn!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/login"
                className="rounded-md bg-cyan-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cyan-700"
              >
                Bắt đầu ngay! <span aria-hidden="true">→</span>
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
