'use client'
import { FaChevronLeft, FaPen, FaXmark, FaCamera, FaUserCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr"

interface ProfilePageProps {
  userID: string;
}

export default function ProfilePage({ userID = "US1b80" }: ProfilePageProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userEdit, setUserEdit] = useState<UserBase>();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  const accessToken = localStorage.getItem("token");

  // Get user info
  const fetcher = (url: string) => fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json())
  const { data: userData, error, isLoading } = useSWR<UserResponse>(`https://aitripsystem-api.onrender.com/api/v1/users/idUser?lookup=${userID}`, fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  console.log(userData);
  if (error) return <div>Failed to load user data: {error.message}</div>
  if (isLoading) return <div>Loading...</div>

  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
    { label: "Other", value: 2 }
  ]

  const renderGender = () => {
    const gender = genderOptions.find(option => option.value === userData?.gender);
    return <span>{gender ? gender.label : 'Other'}</span>;
  }

  const handleBtnBack = () => {
    router.push("/");
  };

  const openEditModal = () => {
    if (userData) {
      setUserEdit({ ...userData });
    }
    setPreviewAvatar(null);
    setStep(1);
    setShowEditModal(true);
  }

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check valid image
    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserEdit(prev => ({
      ...prev!,
      name: value
    }))
  }

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setUserEdit(prev => ({
      ...prev!,
      gender: value
    }))
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserEdit(prev => ({
      ...prev!,
      description: value
    }))
  }

  const handleSaveBtn = async () => {
    const payload = {
      name: userEdit?.name,
      gender: userEdit?.gender,
      description: userEdit?.description
    }

    console.log(payload);
    try {
      const res = await fetch(
        `https://aitripsystem-api.onrender.com/api/v1/users/${userID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Failed to update user info.');

      // Revalidate SWR to fetch the updated data
      await mutate(
        `https://aitripsystem-api.onrender.com/api/v1/users/idUser?lookup=${userID}`
      );

      console.log("Cập nhật dữ liệu người dùng thành công");
    } catch (error) {
      console.error("Error updating user info:", error);
    } finally {
      setShowEditModal(false);
      setStep(1);
    }
  };

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
          <h1 className="text-2xl font-bold text-black dark:text-white">{userData?.name}</h1>
        </div>
        <div className="flex-grow flex-col bg-white rounded-lg p-6 mx-auto shadow-sm dark:bg-transparent text-black dark:text-white dark:border-2 border-gray-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Image
              src={userData?.avatar && (userData.avatar.startsWith("http://") || userData.avatar.startsWith("https://"))
                ? userData.avatar : "/profile.svg"}
              priority={true}
              width={200}
              height={200}
              alt="avatar"
              className="border-2 dark:text-white border-black rounded-full object-cover"
              style={{ width: '200px', height: '200px' }}
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{userData?.name}</h2>
              <p>{userData?.email}</p>
              {/* <p>
                <span className="font-bold">{userData?.friends}</span> Friends
              </p> */}
            </div>
            <div className="flex gap-2 sm:ml-auto justify-center">
              <button
                onClick={openEditModal}
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
                  {userData?.description}
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div>
                  <span className="font-bold text-lg">Phone number:</span> {userData?.phonenumber}
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
                      src={previewAvatar
                        ? previewAvatar : userData?.avatar && (userData.avatar.startsWith("http://") || userData.avatar.startsWith("https://"))
                          ? userData.avatar : "/profile.svg"}
                      width={200}
                      height={200}
                      alt="avatar"
                      className="border-2 border-black dark:border-gray-400 rounded-full object-cover"
                      style={{ width: '200px', height: '200px' }}
                    />

                    <label
                      htmlFor="avatarUpload"
                      className="absolute bottom-0 right-0 text-xl m-4 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer"
                    >
                      <FaCamera />
                    </label>

                    <input
                      id="avatarUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
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

              {/* {Name update modal} */}
              {
                step === 2 &&
                <>
                  <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setStep(prev => prev - 1)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaChevronLeft />
                    </button>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Change your name?</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-xl p-2 ml-auto rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200 cursor-pointer">
                      <FaXmark />
                    </button>
                  </div>

                  <div className="p-4 text-gray-700 dark:text-white">
                    <input
                      type="text"
                      value={userEdit?.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={handleNameChange}
                      placeholder="Your name" />
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

              {/* {Gender update modal} */}
              {
                step === 3 &&
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
                      value={userEdit?.gender}
                      onChange={handleGenderChange}
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

              {/* {Description update modal} */}
              {
                step === 4 &&
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
                      rows={6}
                      placeholder="Write your bio here..."
                      value={userEdit?.description ?? ""}
                      onChange={handleDescriptionChange}
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
                step === 5 &&
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
