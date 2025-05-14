import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bcp.cdnchinhphu.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ifqvsthceyghtkdrkuze.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

export default nextConfig;
