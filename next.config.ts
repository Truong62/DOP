import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.tgdd.vn",
      },
      {
        protocol: "https",
        hostname: "bazantravel.com",
      },
      {
        protocol: "https",
        hostname: "inhat.vn",
      },
      {
        protocol: "https",
        hostname: "assets.unileversolutions.com",
      },
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
      },
      {
        protocol: "https",
        hostname: "afamilycdn.com",
      },
      {
        protocol: "https",
        hostname: "vnaroma.com",
      },
    ],
  },
};

export default nextConfig;
