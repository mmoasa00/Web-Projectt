import type { MetadataRoute } from "next";

/** PWA manifest (served at /manifest.webmanifest). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "نوا — پخش و کشف موسیقی",
    short_name: "نوا",
    description: "سرویس استریم موسیقی نوا: گوش دادن، پلی‌لیست و انتشار اثر.",
    start_url: "/",
    display: "standalone",
    background_color: "#2a2724",
    theme_color: "#2a2724",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
