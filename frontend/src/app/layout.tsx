import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

/**
 * Estedad is shipped as a single variable web-font (the `wght` axis covers every
 * weight from 100–900). We expose it as `--font-sans`, which Tailwind's
 * `font-sans` utility and the shadcn tokens read from.
 */
const estedad = localFont({
  src: "../fonts/Estedad-Variable.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "نوا — پخش و کشف موسیقی",
    template: "%s · نوا",
  },
  description:
    "نوا، سرویس استریم موسیقی: گوش دادن، ساخت پلی‌لیست، انتشار اثر برای هنرمندان و داشبورد مدیریت.",
  applicationName: "نوا",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "نوا",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#2a2724" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(estedad.variable, "h-full antialiased")}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
