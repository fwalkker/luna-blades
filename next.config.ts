import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["zustand"],
  },
};

export default config;
