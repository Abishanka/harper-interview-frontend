import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://harper-interview-service.onrender.com/api/:path*",
      },
    ];
  },
  experimental: {
    allowedDevOrigins: [
      "https://harper-interview-service.onrender.com", // Add your specific origin here
    ],
  },
};

export default nextConfig;
