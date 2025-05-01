"use client";
import { AiOutlineExpandAlt } from "react-icons/ai";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false, // BẮT BUỘC: Leaflet không chạy được ở server-side
});

export default function DetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6">Lịch trình</h1>
        <div className="flex gap-2 flex-col">
          <div className="bg-white rounded-lg shadow-sm">
            <p className="text-2xl font-bold text-red-600 hover:bg-gray-100 cursor-pointer p-4">
              Ngày 1 (13/4/2025)
            </p>

            <div>
              <div className="border-t border-b p-4 bg-[url(/images/hinh-nen-may-tinh.jpg)] bg-center relative h-150">
                <AiOutlineExpandAlt className="border-1 w-8 h-8 text-white rounded absolute bottom-1 right-1 cursor-pointer" />

                <div className="w-50 h-70 top-0 right-0 absolute">
                  <MapView />
                </div>

                <div className="bg-black/20 text-white px-4 py-2 inline-block rounded">
                  <div className="flex items-center me-4">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-5 h-5"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ms-2 text-sm text-[25px] font-bold"
                    >
                      Tham quan ...
                    </label>
                  </div>

                  <ul className="list-inside list-disc ml-8">
                    <li className="flex items-center gap-2">
                      <span>🕓</span>
                      <span>Thời gian</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🏠</span>
                      <span>Địa chỉ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🏷️</span>
                      <span>Kiểu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>💡</span>
                      <span>Gợi ý</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-2xl font-bold hover:bg-gray-100 cursor-pointer">
              Ngày 2 (13/4/2025)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
