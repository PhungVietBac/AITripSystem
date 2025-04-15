'use client'
import Header from "../../components/header";
import Footer from "../../components/footer";
import { FaChevronLeft, FaPen } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = {
    IDUser: "U00001",
    Name: "Nguyễn Văn A",
    Username: "nguyenvana",
    Friends: 218,
    Password: "123",
    Gender: 1,
    Email: "vana@example.com",
    PhoneNumber: "0901234567",
    Avatar: "/logo.png",
    Theme: 1,
    Language: 1,
  };

  const router = useRouter();
  const handleBtn = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto px-4 md:px-16 py-8 dark:bg-gray-900 border-b-2 border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <button className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer" onClick={() => handleBtn()}>
            <FaChevronLeft />
          </button>
          <h1 className="text-2xl font-bold text-black dark:text-white">{user.Name}</h1>
        </div>
        <div className="flex-grow flex-col bg-white rounded-lg p-6 mx-auto shadow-sm dark:bg-gray-600 text-black dark:text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={user.Avatar}
              className="w-48 h-48 border-2 border-black rounded-full"
            ></img>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{user.Name}</h2>
              <p>{user.Email}</p>
              <p>
                <span className="font-bold">{user.Friends}</span> Friends
              </p>
            </div>
            <div className="flex gap-2 sm:ml-auto justify-center">
              <button
                type="button"
                className="flex items-center justify-center w-16 h-12 text-white bg-gray-800 hover:bg-gray-900 font-bold rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer"
              >
                <FaPen />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-32 h-12 text-white bg-gray-800 hover:bg-gray-900 font-bold rounded-lg text-md dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer"
              >
                Add friend
              </button>
            </div>
          </div>
          <div className="flex-grow mt-8">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <li className="py-3 sm:py-4">
                <div className="text-justify">
                  <div className="font-bold text-lg">About me:</div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, nunc a dapibus volutpat, quam velit euismod est, a
                  bibendum augue tortor sed nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, nunc a dapibus volutpat, quam velit euismod est, a
                  bibendum augue tortor sed nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, nunc a dapibus volutpat, quam velit euismod est, a
                  bibendum augue tortor sed nulla.
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div>
                  <span className="font-bold text-lg">Phone number:</span> {user.PhoneNumber}
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div>
                  <span className="font-bold text-lg">Gender:</span> {user.Gender === 1 ? "Male" : "Female"}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}