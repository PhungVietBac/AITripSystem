import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;

export default nextConfig;
