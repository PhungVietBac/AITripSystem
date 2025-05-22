"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Define the shape of our context
interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (token: string, username: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  login: () => {},
  logout: () => {},
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Simple login function
  const login = (token: string, username: string) => {
    // Set cookie
    setCookie('token', token);

    // Store in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);

    // Update state
    setIsLoggedIn(true);
    setUsername(username);
  };

  // Simple logout function
  const logout = () => {
    // Clear cookie
    deleteCookie('token');

    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    // Update state
    setIsLoggedIn(false);
    setUsername('');
  };

  // Initialize state from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUsername = localStorage.getItem('username') || '';

      setIsLoggedIn(storedLoggedIn);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
