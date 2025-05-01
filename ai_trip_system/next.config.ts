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
    ],
  },
};

export default nextConfig;
