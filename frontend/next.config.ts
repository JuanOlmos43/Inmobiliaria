import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuración para imágenes locales y remotas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
