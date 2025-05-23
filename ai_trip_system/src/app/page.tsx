'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IntroPage from './intro/page';

// Main page with auth check
export default function HomePage() {
  const router = useRouter();

  // Redirect to dashboard if logged in
  useEffect(() => {
    // Check localStorage directly for immediate decision
    const isUserLoggedIn = typeof window !== 'undefined' &&
      localStorage.getItem('isLoggedIn') === 'true';

    if (isUserLoggedIn) {
      router.replace('/dashboard');
    }
  }, [router]);

  // Show intro page while checking or if not logged in
  return <IntroPage />;
}