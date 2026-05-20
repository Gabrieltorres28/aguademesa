import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gestión de Reparto",
    short_name: "Reparto",
    description: "Sistema de gestión operativa para reparto de agua",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#3b5998",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
