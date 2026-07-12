import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Niva",
  title: { default: "Niva", template: "%s · Niva" },
  description: "Tu centro personal de control financiero.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
