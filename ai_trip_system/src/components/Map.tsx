const Header = () => {
  return (
    <div className="h-[600px] rounded-xl border border-[#dadce0]">
      <div className="bg-white rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900 ml-3">
            Khám phá điểm đến
          </h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Địa điểm
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              <i className="fas fa-route mr-2"></i>
              Lộ trình
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              <i className="fas fa-layer-group mr-2"></i>
              Lớp
            </button>
          </div>
        </div>
      </div>

      {/* Chèn map */}
      <div className="bg-white rounded-lg p-4 border-[2px] border-black mx-auto mt-2 h-[calc(98%-100px)] w-[95%]"></div>
    </div>
  );
};

export default Header;
