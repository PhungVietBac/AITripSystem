"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import MainSidebar from "@/components/MainSidebar";
import Providers from "@/components/Providers";
import { ConversationProvider, useConversation } from "@/context/ConversationContext";
import { useAuth } from "@/context/AuthContext";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Providers>
      <ClientLayoutWithAuth>{children}</ClientLayoutWithAuth>
    </Providers>
  );
}

// Component that uses AuthContext
function ClientLayoutWithAuth({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("authStateChanged", handleAuthChange);
      return () => {
        window.removeEventListener("authStateChanged", handleAuthChange);
      };
    }
  }, []);

  // Check if current route is a private route
  const isPrivateRoute = pathname?.startsWith('/home') ||
                        pathname?.startsWith('/explore') ||
                        pathname?.startsWith('/favorites') ||
                        pathname?.startsWith('/saved') ||
                        pathname?.startsWith('/expert') ||
                        pathname?.startsWith('/profile') ||
                        pathname?.startsWith('/trips') ||
                        pathname?.startsWith('/yourbooking') ||
                        pathname?.startsWith('/booking') ||
                        pathname?.startsWith('/chatbot') ||
                        pathname?.startsWith('/detail') ||
                        pathname?.startsWith('/friend') ||
                        pathname?.startsWith('/map') ||
                        pathname?.startsWith('/result');

  // Show sidebar when logged in AND on private route
  const showSidebar = isLoggedIn && isPrivateRoute;
  // Show header when NOT logged in OR on public route
  const showHeader = !isLoggedIn || !isPrivateRoute;

  return (
    <ConversationProvider>
      <ClientLayoutContent
        showSidebar={showSidebar}
        showHeader={showHeader}
      >
        {children}
      </ClientLayoutContent>
    </ConversationProvider>
  );
}

// Separate component to use conversation context
function ClientLayoutContent({
  showSidebar,
  showHeader,
  children
}: {
  showSidebar: boolean;
  showHeader: boolean;
  children: ReactNode;
}) {
  const {
    currentConversationId,
    handleConversationSelect,
    handleNewConversation,
  } = useConversation();

  return (
    <>
      {showSidebar ? (
        // Layout with sidebar for logged-in users on private routes
        <div className="flex h-screen overflow-hidden">
          <MainSidebar
            currentConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
          />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      ) : (
        // Layout with header for public routes or non-logged-in users
        <>
          {showHeader && <Header />}
          <main className={`flex-grow ${showHeader ? 'pt-[80px]' : ''}`}>
            {children}
          </main>
        </>
      )}
    </>
  );
}
