import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_DK_Loopet } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";
import "leaflet/dist/leaflet.css";
import ClientLayout from "@/components/ClientLayout";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import { DataProvider } from "@/context/DataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playwriteDKLoopet = Playwrite_DK_Loopet({
  variable: "--font-playwrite",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Explavue - AI Trip System",
  description: "Hệ thống đề xuất lộ trình du lịch thông minh dựa trên AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwriteDKLoopet.variable} antialiased min-h-screen flex flex-col`}
      >
        <NoSSRWrapper>
          <ClientLayout>
            <DataProvider>{children}</DataProvider>
          </ClientLayout>
        </NoSSRWrapper>
        <Footer />
      </body>
    </html>
  );
}
