"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
// import { useSession, signIn, signOut } from 'next-auth/react';
// import { Session } from 'next-auth';

// Define the shape of our context
interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (token: string, username: string) => void;
  logout: () => void;
  socialLogin: (provider: string) => void;
  session: any | null; // Changed from Session to any
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  login: () => {},
  logout: () => {},
  socialLogin: () => {},
  session: null,
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  // const { data: session, status } = useSession();
  const session = null; // Temporarily disabled

  // Simple login function for traditional login
  const login = (token: string, username: string) => {
    // Set cookie
    setCookie('token', token);

    // Store in localStorage (only if in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
    }

    // Update state
    setIsLoggedIn(true);
    setUsername(username);
  };

  // Function to handle social login
  const socialLogin = (provider: string) => {
    // signIn(provider, { callbackUrl: '/home' });
    console.log('Social login temporarily disabled:', provider);
  };

  // Logout function
  const logout = () => {
    // Clear cookie
    deleteCookie('token');

    // Clear localStorage (only if in browser)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    }

    // Update state
    setIsLoggedIn(false);
    setUsername('');

    // Sign out from NextAuth
    // signOut({ callbackUrl: '/' });
    console.log('NextAuth signOut temporarily disabled');
  };

  // Initialize state from localStorage or session
  useEffect(() => {
    // First check NextAuth session
    if (session && session.user) {
      setIsLoggedIn(true);
      setUsername(session.user.name || session.user.email || '');
      setIsInitialized(true);
      return;
    }

    // If no NextAuth session, check localStorage (for traditional login)
    if (typeof window !== 'undefined') {
      const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUsername = localStorage.getItem('username') || '';

      setIsLoggedIn(storedLoggedIn);
      setUsername(storedUsername);
      setIsInitialized(true);
    }
  }, [session]);

  // Don't render children until auth is initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      username,
      login,
      logout,
      socialLogin,
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
