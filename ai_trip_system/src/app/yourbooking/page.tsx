import { Metadata } from "next";
import AllBookings from "./AllBookings";

export const metadata: Metadata = {
  title: "Lịch sử Booking",
  description: "Xem tất cả các đặt chỗ của người dùng",
};

export default function AllBookingsPage() {
  return (
    <div className="min-h-screen ">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lịch sử Booking</h1>
          <p className="text-lg md:text-xl mx-4 text-gray-500/90">
            Đây là tất cả các đặt chỗ của bạn. Bạn có thể xem, chỉnh sửa hoặc hủy chúng.
          </p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-4 items-center justify-center filter backdrop-blur-sm bg-white/30 rounded-lg shadow-lg max-w-7xl sm:px-6 lg:px-8">

        {/* Grid container with 12 columns */}
        <div className="grid grid-cols-12 gap-4 mt-6 ">
          {/* Empty space for 3/12 columns */}
          <div className="hidden md:block md:col-span-1 lg:col-span-2"></div>

          {/* AllBookings component in 9/12 columns (adjusted for responsive layout) */}
          <div className="col-span-12 md:col-span-10 lg:col-span-12">
            <AllBookings />
          </div>

        </div>
      </main>
    </div>
  );
}