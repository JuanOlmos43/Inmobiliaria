import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuración para imágenes locales y remotas
    remotePatterns: [
      // Agregar aquí dominios externos cuando sea necesario
      // {
      //   protocol: 'https',
      //   hostname: 'ejemplo.com',
      // },
    ],
  },
};

export default nextConfig;
