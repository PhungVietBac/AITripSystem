import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar, FaStarHalfStroke, FaRegStar } from "react-icons/fa6";
import ModalImage from "react-modal-image";
import Map from "./Map";

type TabProps = {
  label: string;
  count?: number;
  content: React.ReactNode;
};

const tabs = [
  {
    label: "Thông tin",
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Thông tin</h2>
        <p className="text-gray-700">
          Đây là thông tin chi tiết về địa điểm du lịch, bao gồm mô tả, lịch sử,
          văn hóa và các hoạt động thú vị.
        </p>
        <p className="text-gray-700 mt-2">
          Bạn có thể tìm hiểu thêm về các hoạt động, sự kiện và điểm tham quan
          nổi bật trong khu vực này.
        </p>
        <ul className="list-disc pl-5 mt-4">
          <li className="flex items-center gap-2 mt-2">
            <span className="text-blue-500">•</span>
            <span className="text-gray-700">Điểm tham quan nổi bật</span>
          </li>
          <li className="flex items-center gap-2 mt-2">
            <span className="text-blue-500">•</span>
            <span className="text-gray-700">Hoạt động giải trí</span>
          </li>
          <li className="flex items-center gap-2 mt-2">
            <span className="text-blue-500">•</span>
            <span className="text-gray-700">Ẩm thực địa phương</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    label: "Đánh giá",
    count: 10,
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Đánh giá</h2>
        <div className="border-1 rounded-md p-5 bg-gray-100 shadow-md mb-5">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/profile.svg"
                alt="Avatar"
                width={50}
                height={50}
                className="rounded-full"
              />

              <div>
                <p className="font-bold">Tên</p>
                <div className="flex flex-nowrap">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStarHalfStroke className="text-yellow-500" />
                  <FaRegStar className="text-yellow-500" />
                </div>
              </div>
            </div>
            <p>
              sjfkshfehfdkhfvuejeigfeujfeiuhvdgfdjjcideughvidifhgeuivjdeiugvhdikghfudchdjugheifgiskchdijfhdeihvd
            </p>
          </div>
        </div>

        <div className="border-1 rounded-md p-5 bg-gray-100 shadow-md">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/profile.svg"
                alt="Avatar"
                width={50}
                height={50}
                className="rounded-full"
              />

              <div>
                <p className="font-bold">Tên</p>
                <div className="flex flex-nowrap">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStarHalfStroke className="text-yellow-500" />
                  <FaRegStar className="text-yellow-500" />
                </div>
              </div>
            </div>
            <p>Some comments</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Hình ảnh",
    count: 10,
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Hình ảnh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative">
          {[...Array(12)].map((_, i) => (
            <ModalImage
              key={i}
              className="cursor-pointer rounded-lg"
              alt="..."
              small="/images/hinh-nen-may-tinh.jpg"
              large="/images/hinh-nen-may-tinh.jpg"
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    label: "Bản đồ",
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Bản đồ</h2>
        <Map />
      </div>
    ),
  },
  {
    label: "Thời tiết",
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Thời tiết</h2>
      </div>
    ),
  },
  {
    label: "Khác",
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Khác</h2>
      </div>
    ),
  },
];

const Tab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineProps, setUnderlineProps] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const updateUnderline = () => {
      const tab = tabRef.current[activeTab];
      if (tab) {
        setUnderlineProps({
          width: tab.offsetWidth,
          left: tab.offsetLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => {
      window.removeEventListener("resize", updateUnderline);
    };
  }, [activeTab]);

  return (
    <div className="w-full">
      <div className="border-b relative flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRef.current[index] = el)}
            className={`group relative flex-1 text-center py-3 text-sm font-medium transition-colors duration-300 ${
              index === activeTab
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="flex justify-center items-center gap-0.5 p-0.5 font-bold">
              {tab.label}
              {tab.count && (
                <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs ml-0.5">
                  {tab.count}
                </span>
              )}

              <span
                className={`absolute bottom-0 left-0 transform h-0.5 bg-blue-400 transition-transform duration-300 origin-left scale-x-0 w-full group-hover:scale-x-100 ${
                  index === activeTab ? "hidden" : "block"
                }`}
              />
            </div>
          </button>
        ))}

        <motion.div
          className="absolute bottom-0 h-1 bg-blue-500 rounded-t"
          animate={{
            width: underlineProps.width,
            left: underlineProps.left,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="p-5">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tab;
