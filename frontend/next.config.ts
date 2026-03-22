import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  generateBuildId: async () => null,
  turbopack: {
    root: path.resolve(__dirname),
  },
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
