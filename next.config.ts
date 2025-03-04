import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    formats: ['image/webp'],
  },
};

export default nextConfig;
