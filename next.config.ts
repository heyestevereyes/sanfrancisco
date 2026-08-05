import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Imágenes servidas desde el CDN de Sanity. El path se acota al
        // proyecto y dataset para no habilitar el optimizador de Next
        // como proxy abierto hacia assets de terceros.
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/o9u4v7pb/**",
      },
    ],
  },
};

export default nextConfig;
