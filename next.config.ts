import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    domains: [
      "flagcdn.com", "images.unsplash.com", "cdn.example.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "443",
      }, 
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      }
    ]
  }
};

export default nextConfig;
