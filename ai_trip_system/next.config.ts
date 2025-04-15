import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['bcp.cdnchinhphu.vn'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bcp.cdnchinhphu.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
