import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["10.0.0.67"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
