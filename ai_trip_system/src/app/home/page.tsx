import SearchForm from "../../components/SearchForm";
import FriendsList from "../../components/FriendsList";
import DestinationCards from "../../components/DestinationCards";
import Map from "../../components/Map";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="w-full px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-lobster bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                  Chào mừng bạn đến với TravelGo! 🧳
                </h1>
                <p className="text-gray-600 mt-2 text-lg italic">
                  Khám phá những điểm đến tuyệt vời và lên kế hoạch cho chuyến
                  hành trình tiếp theo của bạn.
                </p>
              </div>

              <Map />
              <SearchForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FriendsList />
              <DestinationCards />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
