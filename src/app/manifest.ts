import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Niva",
    short_name: "Niva",
    description: "Tu centro personal de control financiero.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FAFBFC",
    theme_color: "#111827",
    lang: "es-MX",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
