// src/app/components/header.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Use the auth context for login status
  const { isLoggedIn, logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to scroll to section with memoization to prevent unnecessary re-renders
  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    // Prevent default behavior to avoid page reload
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Find the element and scroll to it
    const element = document.getElementById(id);
    if (element) {
      // Use a small timeout to ensure the UI updates before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    }

    // Close dropdown if it's open
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    // Close dropdown first if open
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }

    // Use setTimeout to ensure UI updates before logout processing
    setTimeout(() => {
      // Use the logout function from auth context
      logout();

      // Redirect to home page using router.replace to avoid adding to history
      router.replace("/");
    }, 10);
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

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow when scrolled down (e.g., 50px from top)
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Call once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full">
      <header className={`bg-gradient-to-r from-[#000080] to-[#00BFFF] flex items-center h-[80px] fixed top-0 left-0 right-0 z-50 ${scrolled ? 'shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-b border-black/30' : ''}`}>
        {/* Left side - Logo */}
        <div className="flex justify-start items-center p-4 gap-3 w-1/4">
          <div className="flex items-center justify-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(isLoggedIn ? "/dashboard" : "/");
              }}
              className="cursor-pointer"
            >
              <Image
                src="/logo.png"
                width={70}
                height={70}
                alt="logo"
                className="w-[70px] h-[70px] -my-1"
                priority
              />
            </div>
          </div>
          <div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(isLoggedIn ? "/dashboard" : "/");
              }}
              className="cursor-pointer"
            >
              <span className="text-white text-4xl font-[var(--font-playwrite)] tracking-wide">TravelGO!</span>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="flex justify-center items-center p-4 w-2/4">
          {/* Center menu items - only show when not logged in */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center justify-center mx-auto gap-20">
              <button
                onClick={(e) => scrollToSection('about', e)}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300"
                aria-label="About"
              >
                <span className="text-lg text-white font-medium">
                  About
                </span>
              </button>

              <button
                onClick={(e) => scrollToSection('features', e)}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300"
                aria-label="Features"
              >
                <span className="text-lg text-white font-medium">
                  Features
                </span>
              </button>

              <button
                onClick={(e) => scrollToSection('contact', e)}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300"
                aria-label="Contact"
              >
                <span className="text-lg text-white font-medium">
                  Contact
                </span>
              </button>
            </div>
          )}

          {/* Menu for logged in users */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center justify-center mx-auto gap-20">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/dashboard");
                }}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 cursor-pointer"
              >
                <span className="text-lg text-white font-medium">
                  Dashboard
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/trips");
                }}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 cursor-pointer"
              >
                <span className="text-lg text-white font-medium">
                  My Trips
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/explore");
                }}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 cursor-pointer"
              >
                <span className="text-lg text-white font-medium">
                  Explore
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Buttons */}
        <div className="flex justify-end items-center p-4 w-1/4">
          {/* Login/Signup buttons - only show when not logged in */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-3">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/login");
                }}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 bg-transparent border border-white rounded-md px-5 py-2 cursor-pointer"
                aria-label="Login"
              >
                <span className="text-base font-medium">
                  Login
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/register");
                }}
                className="flex items-center no-underline text-white hover:opacity-90 transition-opacity duration-300 bg-[#4B3DB5] rounded-md px-5 py-2 cursor-pointer"
                aria-label="Sign Up"
              >
                <span className="text-base font-medium">
                  Sign Up
                </span>
              </div>
            </div>
          )}

          {/* Profile and Logout buttons - only show when logged in */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-3">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/profile");
                }}
                className="flex items-center no-underline text-white hover:opacity-70 transition-opacity duration-300 bg-transparent border border-white rounded-md px-5 py-2 cursor-pointer"
                aria-label="Profile"
              >
                <Image src="/profile.svg" width={24} height={24} alt="profile" className="mr-2" />
                <span className="text-base font-medium">
                  Profile
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center no-underline text-white hover:opacity-90 transition-opacity duration-300 bg-[#4B3DB5] rounded-md px-5 py-2"
                aria-label="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                <span className="text-base font-medium">
                  Logout
                </span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden relative inline-block ml-auto" ref={dropdownRef}>
            <div
              className="flex items-center text-white hover:opacity-70 transition-opacity duration-300"
              onClick={toggleDropdown}
              role="button"
              aria-expanded={isDropdownOpen}
              aria-label="Menu"
            >
              <Image src="/hamburger.svg" width={28} height={28} alt="menu" />
            </div>
            <div
              className={`absolute top-[80px] right-0 bg-white min-w-[200px] shadow-lg rounded-md z-50 opacity-0 transition-all duration-300 transform -translate-y-2 ${
                isDropdownOpen
                  ? "block opacity-100 translate-y-0"
                  : "hidden"
              }`}
            >
              <div className="flex flex-col md:hidden">
                {/* Menu items for non-logged in users */}
                {!isLoggedIn && (
                  <>
                    <button
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={(e) => {
                        // Close dropdown first
                        setIsDropdownOpen(false);
                        // Use setTimeout to ensure dropdown closes before scrolling
                        setTimeout(() => {
                          scrollToSection('about', e);
                        }, 50);
                      }}
                    >
                      About
                    </button>
                    <button
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={(e) => {
                        // Close dropdown first
                        setIsDropdownOpen(false);
                        // Use setTimeout to ensure dropdown closes before scrolling
                        setTimeout(() => {
                          scrollToSection('features', e);
                        }, 50);
                      }}
                    >
                      Features
                    </button>
                    <button
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={(e) => {
                        // Close dropdown first
                        setIsDropdownOpen(false);
                        // Use setTimeout to ensure dropdown closes before scrolling
                        setTimeout(() => {
                          scrollToSection('contact', e);
                        }, 50);
                      }}
                    >
                      Contact
                    </button>

                    <Link
                      href="/login"
                      key="mobile-login"
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={() => {
                        // Close dropdown first
                        setIsDropdownOpen(false);
                      }}
                      prefetch={false}
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      key="mobile-signup"
                      className="flex items-center text-white p-3 no-underline hover:bg-opacity-90 bg-[#4B3DB5] w-full text-left"
                      onClick={() => {
                        // Close dropdown first
                        setIsDropdownOpen(false);
                      }}
                      prefetch={false}
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {/* Menu items for logged in users */}
                {isLoggedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      key="mobile-dashboard"
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={() => setIsDropdownOpen(false)}
                      prefetch={false}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/trips"
                      key="mobile-trips"
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={() => setIsDropdownOpen(false)}
                      prefetch={false}
                    >
                      My Trips
                    </Link>

                    <Link
                      href="/explore"
                      key="mobile-explore"
                      className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                      onClick={() => setIsDropdownOpen(false)}
                      prefetch={false}
                    >
                      Explore
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <Link
                    href="/profile"
                    key="mobile-profile"
                    className="flex items-center text-black p-3 no-underline hover:bg-gray-200 w-full text-left"
                    onClick={() => setIsDropdownOpen(false)}
                    prefetch={false}
                  >
                    <Image src="/profile.svg" width={24} height={24} alt="profile" className="mr-2" />
                    Profile
                  </Link>
                )}

                {/* Logout button for mobile menu if logged in */}
                {isLoggedIn && (
                  <div
                    className="flex items-center text-black p-3 no-underline hover:bg-gray-200 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      // Close dropdown first
                      setIsDropdownOpen(false);
                      // Use setTimeout to ensure dropdown closes before logout
                      setTimeout(() => {
                        handleLogout();
                      }, 50);
                    }}
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
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;