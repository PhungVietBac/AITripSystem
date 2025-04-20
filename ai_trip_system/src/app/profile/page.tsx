'use client'
import { FaChevronLeft, FaPen, FaXmark, FaCamera, FaUserCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState({
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
    Aboutme: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedeuismod, nunc a dapibus volutpat, quam velit euismod est, bibendum augue tortor sed nulla.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedeuismod, nunc a dapibus volutpat, quam velit euismod est, abibendum augue tortor sed nulla.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sedeuismod, nunc a dapibus volutpat, quam velit euismod est, abibendum augue tortor sed nulla."
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  const genderOptions = [
    { label: "Male", value: 1 },
    { label: "Female", value: 2 },
    { label: "None", value: 3 }
  ]

  const renderGender = () => {
    const gender = genderOptions.find(option => option.value === user.Gender);
    return <span>{gender ? gender.label : 'None'}</span>;
  }

  const handleBtnBack = () => {
    router.push("/");
  };

  const handleSaveBtn = () => {
    setUser(editedUser);
    setStep(1);
    setShowEditModal(false);
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedUser(prev => ({
        ...prev,
        Avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: name === "Gender" ? parseInt(value) : value, // Parse Gender to integer
    }));
  };

  const handleOpenEditModal = () => {
    setEditedUser({ ...user });
    setStep(1);
    setShowEditModal(true);
  }

  const handleFriendRequestSent = () => {
    setIsFriendRequestSent(true);
  }

  return (
    <div className="flex flex-col">
      <main className="flex-grow w-full mx-auto px-4 md:px-16 pt-8 pb-16 dark:bg-gradient-to-b from-black via-gray-800 to-blue-950 dark:border-b-2 border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleBtnBack}
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
            <FaChevronLeft />
          </button>
          <h1 className="text-2xl font-bold text-black dark:text-white">{user.Name}</h1>
        </div>
        <div className="flex-grow flex-col bg-white rounded-lg p-6 mx-auto shadow-sm dark:bg-transparent text-black dark:text-white dark:border-2 border-gray-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Image
              src={user.Avatar}
              width={200}
              height={200}
              alt="avatar"
              className="border-2 border-black rounded-full object-cover"
              style={{ width: '200px', height: '200px' }}
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{user.Name}</h2>
              <p>{user.Email}</p>
              <p>
                <span className="font-bold">{user.Friends}</span> Friends
              </p>
            </div>
            <div className="flex gap-2 sm:ml-auto justify-center">
              <button
                onClick={handleOpenEditModal} // Use the new handler
                className="flex items-center justify-center w-16 h-12 font-bold rounded-lg text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer transition-colors duration-200"
              >
                <FaPen />
              </button>
              <button
                onClick={handleFriendRequestSent}
                className="flex items-center justify-center w-32 h-12 font-bold rounded-lg text-md text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer transition-colors duration-200"
              >
                {isFriendRequestSent ? (<><FaUserCheck className="mr-2" /> Friend</>) : ("Add friend")}
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
                  {user.Aboutme}
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div>
                  <span className="font-bold text-lg">Phone number:</span> {user.PhoneNumber}
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div>
                  <span className="font-bold text-lg">Gender:</span> {renderGender()}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {
        showEditModal && (
          <div className="flex fixed inset-0 z-50 items-center justify-center bg-black/50" draggable="false">
            <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg w-full h-108 md:h-100 max-w-2xl mx-4">

              {/* {Avatar update modal} */}
              {
                step === 1 &&
                <>
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Choose your profile picture</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-xl p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaXmark />
                    </button>
                  </div>

                  <div className="relative p-4 text-gray-700 dark:text-white mx-auto">
                    <Image
                      src={editedUser.Avatar}
                      width={200}
                      height={200}
                      alt="avatar"
                      className="border-2 border-black dark:border-gray-400 rounded-full object-cover"
                      style={{ width: '200px', height: '200px' }}
                    />

                    <button
                      onClick={handleAvatarUpload}
                      className="absolute bottom-0 right-0 text-xl m-4 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaCamera />
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex p-4 mt-auto">
                    <button
                      onClick={() => setStep(prev => prev + 1)}
                      className="w-full h-12 text-md font-bold rounded-4xl cursor-pointer text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-black dark:border-gray-600 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </>
              }

              {/* {Gender update modal} */}
              {
                step === 2 &&
                <>
                  <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setStep(prev => prev - 1)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaChevronLeft />
                    </button>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">What's your gender?</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-xl p-2 ml-auto rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaXmark />
                    </button>
                  </div>

                  <div className="p-4 text-gray-700 dark:text-white">
                    <select
                      name="Gender"
                      value={editedUser.Gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 rounded-lg border-2 text-md text-black bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                    >
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex p-4 mt-auto">
                    <button
                      onClick={() => setStep(prev => prev + 1)}
                      className="w-full h-12 text-md font-bold rounded-4xl cursor-pointer text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-black dark:border-gray-600 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </>
              }

              {/* {About me update modal} */}
              {
                step === 3 &&
                <>
                  <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setStep(prev => prev - 1)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaChevronLeft />
                    </button>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">About you</h3>
                    <button
                      onClick={() => { setShowEditModal(false); setStep(1) }}
                      className="text-xl p-2 ml-auto rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaXmark />
                    </button>
                  </div>

                  <div className="p-4 text-gray-700 dark:text-white">
                    <textarea
                      name="Aboutme"
                      rows={6}
                      placeholder="Write your bio here..."
                      value={editedUser.Aboutme}
                      onChange={handleInputChange}
                      className="resize-none w-full p-2.5 text-sm rounded-lg border text-gray-900 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="flex p-4 mt-auto">
                    <button
                      onClick={() => setStep(prev => prev + 1)}
                      className="w-full h-12 text-md font-bold rounded-4xl cursor-pointer text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-black dark:border-gray-600 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </>
              }

              {/* {Save update modal} */}
              {
                step === 4 &&
                <>
                  <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setStep(prev => prev - 1)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaChevronLeft />
                    </button>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Click to save updates</h3>
                    <button
                      onClick={() => { setShowEditModal(false); setStep(1) }}
                      className="text-xl p-2 ml-auto rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaXmark />
                    </button>
                  </div>

                  <div className="flex p-4 m-auto">
                    <button
                      onClick={handleSaveBtn}
                      className="w-72 md:w-84 h-12 text-md font-bold rounded-4xl cursor-pointer text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-black dark:border-gray-600 transition-colors duration-200">
                      Save
                    </button>
                  </div>
                </>
              }
            </div>
          </div>
        )
      }
    </div>
  );
}
