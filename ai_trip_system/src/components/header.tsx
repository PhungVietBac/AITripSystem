// src/app/components/header.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import { getCookie } from "cookies-next";

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return {};
  }
}

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("current_user_id"));
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Xóa cookie token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Reset states
    setIsLogin(false);
    setCurrentUser("");
    setIsDropdownOpen(false);
    // Redirect to login page
    router.push("/login");
  };

  // Check if user is logged in with cookie
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      const decodedToken = decodeJWT(String(token));
      setIsLogin(true);
      setCurrentUser(String(decodedToken.sub));
    } else {
      setIsLogin(false);
      setCurrentUser("");
    }
  }, []);

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
      <header className="bg-gradient-to-r from-[#000080] to-[#00BFFF] flex justify-between items-center h-[60px] fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="flex w-1/2 justify-start items-center p-4 gap-3">
          <div className="w-[40px] h-[40px]">
            <Link href="/">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="logo"
                className="w-[40px] h-[40px]"
              />
            </Link>
          </div>
          <div>
            <Link href="/">
              <b className="text-white text-2xl font-bold">Top Gun Flyover</b>
            </Link>
          </div>
        </div>

        <div className="flex w-1/2 justify-end items-center p-4 md:gap-[30px]">
          <div className="hidden md:flex items-center">
            <Link
              href="/product"
              className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
              aria-label="Product"
            >
              <span className="text-sm text-white">
                Product
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/use-cases"
              className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
              aria-label="Use Cases"
            >
              <span className="text-sm text-white">
                Use Cases
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/templates"
              className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
              aria-label="Templates"
            >
              <span className="text-sm text-white">
                Templates
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/resources"
              className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
              aria-label="Resources"
            >
              <span className="text-sm text-white">
                Resources
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/pricing"
              className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
              aria-label="Pricing"
            >
              <span className="text-sm text-white">
                Pricing
              </span>
            </Link>
          </div>

          {!isLogin && (
            <div className="hidden md:flex items-center">
              <Link
                href="/login"
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3 bg-transparent border border-white rounded-md px-4 py-1"
                aria-label="Login"
              >
                <span className="text-sm text-white">
                  Log In
                </span>
              </Link>
            </div>
          )}

          {!isLogin && (
            <div className="hidden md:flex items-center">
              <Link
                href="/color-finder"
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3 bg-[#4B3DB5] rounded-md px-4 py-1"
                aria-label="Color Name Finder"
              >
                <span className="text-sm">
                  COLOR NAME FINDER
                </span>
              </Link>
            </div>
          )}

          {isLogin && (
            <div className="hidden md:flex items-center">
              <Link
                href={`/profile/${currentUser}`}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 mx-3"
                aria-label="Profile"
              >
                <Image src="/profile.svg" width={24} height={24} alt="profile" />
                <span className="ml-2 text-sm text-white">
                  Profile
                </span>
              </Link>
            </div>
          )}

          <div className="md:hidden relative inline-block" ref={dropdownRef}>
            <div
              className="flex items-center text-white hover:opacity-70 transition-opacity duration-300"
              onClick={toggleDropdown}
              role="button"
              aria-expanded={isDropdownOpen}
              aria-label="Menu"
            >
              <Image src="/hamburger.svg" width={24} height={24} alt="menu" />
            </div>
            <div
              className={`absolute top-[60px] right-0 bg-white min-w-[200px] shadow-lg rounded-md z-50 opacity-0 transition-all duration-300 transform -translate-y-2 ${isDropdownOpen
                  ? "block opacity-100 translate-y-0"
                  : "hidden"
                }`}
            >
              <div className="flex flex-col md:hidden">
                <Link
                  href="/product"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Product
                </Link>
                <Link
                  href="/use-cases"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Use Cases
                </Link>
                <Link
                  href="/templates"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Pricing
                </Link>

                {!isLogin && (
                  <Link
                    href="/login"
                    className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Log In
                  </Link>
                )}

                {!isLogin && (
                  <Link
                    href="/color-finder"
                    className="flex items-center text-white p-3 no-underline hover:bg-opacity-90 bg-[#4B3DB5]"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    COLOR NAME FINDER
                  </Link>
                )}

                {isLogin && (
                  <Link
                    href="/profile"
                    className="flex items-center text-black p-3 no-underline hover:bg-gray-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Image src="/profile.svg" width={24} height={24} alt="profile" className="mr-2" />
                    Profile
                  </Link>
                )}

                {/* Logout button for mobile menu if logged in */}
                {isLogin && (
                  <div
                    className="flex items-center text-black p-3 no-underline hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mr-2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log out
                  </div>
                )}
              </div>

              {/* We don't need desktop dropdown menu anymore since we have the nav items in the header */}
              <div className="hidden">
                {/* Empty - desktop menu items are now in the header */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;