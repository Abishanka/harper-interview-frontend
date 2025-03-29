import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://106a3c52-dd77-4008-8678-17b72f2f0177-00-25b6sowovdxnr.worf.replit.dev:8000/api/:path*",
      },
    ];
  },
  experimental: {
    allowedDevOrigins: [
      "http://f32f3e4a-d27e-4055-9b20-02288765e295-00-1ptmmpzgki8xi.kirk.replit.dev", // Add your specific origin here
    ],
  },
};

export default nextConfig;
