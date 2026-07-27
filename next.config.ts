import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6khz2sa0mggxbsdm.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
