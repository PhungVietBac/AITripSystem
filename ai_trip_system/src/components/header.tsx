// src/app/components/header.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="w-full">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 flex justify-between items-center h-[35px] relative">
        <div className="flex w-1/2 justify-between items-center p-0 gap-2">
          <div className="w-[30px] h-[30px] p-0">
            <Link href="/">
              <Image
                src="/logo.png"
                width={30}
                height={30}
                alt="logo"
                className="w-[30px] h-[30px]"
              />
            </Link>
          </div>
          <div className="w-[calc(100%-30px)]">
            <Link href="/">
              <b className="text-black text-2xl">TravelGO!</b>
            </Link>
          </div>
        </div>

        <div className="flex w-1/2 justify-end items-center p-[10px] md:gap-[30px]">
          <div className="hidden md:flex items-center p-0">
            <Link
              href="/favorites"
              className="flex items-center no-underline text-black hover:opacity-70 transition-opacity duration-300"
              aria-label="Yêu thích"
            >
              <Image src="/heart.svg" width={30} height={30} alt="favorite" />
              <span className="ml-2 text-sm text-black">
                <b>Yêu thích</b>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center p-0">
            <Link
              href="/profile"
              className="flex items-center no-underline text-black hover:opacity-70 transition-opacity duration-300"
              aria-label="Profile"
            >
              <Image src="/profile.svg" width={30} height={30} alt="profile" />
              <span className="ml-2 text-sm text-black">
                <b>Profile</b>
              </span>
            </Link>
          </div>

          <div className="relative inline-block" ref={dropdownRef}>
            <div
              className="flex items-center text-black hover:opacity-70 transition-opacity duration-300"
              onClick={toggleDropdown}
              role="button"
              aria-expanded={isDropdownOpen}
              aria-label="Menu"
            >
              <Image src="/hamburger.svg" width={30} height={30} alt="menu" />
              <span className="ml-2 text-sm text-black hidden md:block">
                <b>Menu</b>
              </span>
            </div>
            <div
              className={`absolute top-[35px] right-0 bg-white min-w-[160px] shadow-lg rounded-md z-10 opacity-0 transition-all duration-300 transform -translate-y-2 md:min-w-[120px] md:left-1/2 md:-translate-x-1/2 ${
                isDropdownOpen
                  ? "block opacity-100 translate-y-0"
                  : "hidden"
              }`}
            >
              <div className="flex flex-col md:hidden">
                <Link
                  href="/favorites"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Image src="/heart.svg" width={24} height={24} alt="favorite" className="mr-2" />
                  Yêu thích
                </Link>
                <Link
                  href="/map"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Bản đồ
                </Link>
                <Link
                  href="/friend"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Bạn bè
                </Link>
                <Link
                  href="/booking"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Đặt chỗ
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Image src="/profile.svg" width={24} height={24} alt="profile" className="mr-2" />
                  Trang cá nhân
                </Link>
              </div>

              {/* Menu items cho desktop */}
              <div className="hidden md:flex flex-col">
                <Link
                  href="/map"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Bản đồ
                </Link>
                <Link
                  href="/friend"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Bạn bè
                </Link>
                <Link
                  href="/booking"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Đặt chỗ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;