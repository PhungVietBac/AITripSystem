"use client";

import { useState, FormEvent } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://aitripsystem-api.onrender.com/api/v1/auth/register?username=${encodeURIComponent(
          formData.username
        )}&password=${encodeURIComponent(formData.password)}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error details:", errorData);
        throw new Error(
          `Đăng ký thất bại! (${response.status}): ${
            errorData.detail || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log(data);

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Đã có lỗi xảy ra.");
        console.error(err);
      } else {
        setError("Đã có lỗi xảy ra.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-2 sm:pt-2 md:pt-2 pb-4 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left side - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-48 ml-48">
            <div className="rounded-2xl shadow-xl filter backdrop-blur-md bg-yellow-50 border border-[#d1d9e0] p-4 sm:p-6 md:p-8">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Explavue Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16"
                  width={500}
                  height={500}
                />
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Đăng ký tài khoản mới 👋
                </h2>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Nhập tên đăng nhập của bạn"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <FaEnvelope />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Tạo mật khẩu mới"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <FaLock />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Nhập lại mật khẩu"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <FaLock />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-white py-3 px-4 rounded-xl hover:bg-cyan-600 transition duration-200 font-medium mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading message="Đang xử lý..." /> : "Đăng ký"}
                </button>
              </form>

              <div className="mt-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                      fill="#EA4335"
                    />
                  </svg>
                  Đăng ký với Google
                </button>
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Bạn đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="text-cyan-600 font-medium hover:text-cyan-500"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Vietnam Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <Image
                src="/images/vietnam.png"
                alt="Vietnam"
                className="w-full h-auto max-w-md mx-auto"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
