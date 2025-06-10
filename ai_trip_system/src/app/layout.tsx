import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_DK_Loopet } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";
import "leaflet/dist/leaflet.css";
import ClientLayout from "@/components/ClientLayout";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import { DataProvider } from "@/context/DataContext";
import Script from "next/script";

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
  title: "Explavue – Trợ lý AI lên kế hoạch chuyến đi",
  description:
    "Ứng dụng du lịch AI giúp bạn khám phá địa điểm, lập kế hoạch thông minh và tùy chỉnh hành trình theo sở thích cá nhân.",
  metadataBase: new URL("https://ai-trip-system.vercel.app"),
  keywords: [
    "du lịch",
    "kế hoạch du lịch",
    "AI travel planner",
    "Explavue",
    "trip planner",
  ],
  openGraph: {
    title: "Explavue – Trợ lý AI du lịch thông minh",
    description: "Khám phá và lên lịch trình nhanh chóng với Explavue.",
    url: "https://ai-trip-system.vercel.app",
    siteName: "Explavue",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Explavue – Ứng dụng lập kế hoạch du lịch bằng AI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explavue – Trợ lý AI cho chuyến đi của bạn",
    description: "Lập kế hoạch du lịch thông minh và đơn giản cùng AI.",
    images: ["/og-image.jpg"],
  },
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
        <Script id="ld-json" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Explavue",
            url: "https://ai-trip-system.vercel.app",
            applicationCategory: "TravelApplication",
            operatingSystem: "All",
            description:
              "Ứng dụng AI lập kế hoạch du lịch thông minh và cá nhân hóa.",
            inLanguage: "vi",
          })}
        </Script>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"
        />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
