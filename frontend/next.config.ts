import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuración para imágenes locales y remotas
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      // Agregar aquí dominios externos cuando sea necesario
      {
        protocol: "https",
        hostname: "ohxnsqyjcocbaeyqybpn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
