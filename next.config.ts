import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore canvas module which is an optional dependency for pdfjs-dist
  serverExternalPackages: ['canvas'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
