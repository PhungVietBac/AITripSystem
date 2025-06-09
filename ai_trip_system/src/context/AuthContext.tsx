"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null; // Thêm token vào context
  login: (token: string) => void;
  logout: () => void;
  socialLogin: (provider: string) => void;
  userId: string | null; // Thêm userId để sử dụng
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  socialLogin: () => {},
  userId: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null); // Lưu token trong state
  const [userId, setUserId] = useState<string | null>(null); // Lưu userId
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo trạng thái từ cookie khi component mount
  useEffect(() => {
    const storedToken = getCookie("token")?.toString();
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true); // Đặt isLoggedIn dựa trên sự hiện diện của token
    }

    // Lấy userId từ localStorage (nếu có)
    const storedUserId = localStorage.getItem("current_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    setIsInitialized(true);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsLoggedIn(true);
    setCookie("token", newToken, {
      maxAge: 24 * 60 * 60, // 24 giờ
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // (Tùy chọn) Lấy userId từ API profile
    fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          setUserId(data.userId);
          localStorage.setItem("current_user_id", data.userId);
        }
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  };

  const socialLogin = (provider: string) => {
    console.log("Social login temporarily disabled:", provider);
    // Thêm logic signIn nếu cần (ví dụ: window.location.href = `/api/auth/${provider}`);
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
    deleteCookie("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("current_user_id");
    console.log("Logout executed");
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token, // Cung cấp token cho các component
        login,
        logout,
        socialLogin,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};