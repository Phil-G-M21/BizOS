import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "172.20.10.*" covers the whole hotspot subnet (matched octet-by-octet,
  // same wildcard mechanism Next.js uses for domain labels), so any device
  // on that hotspot — not just this one phone — can reach the dev server.
  allowedDevOrigins: ["10.175.70.154", "172.20.10.*"],

  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;