import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.175.70.154"],

  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;