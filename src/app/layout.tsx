import type { Metadata, Viewport } from "next";
import AuthGuard from "@/components/layout/AuthGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "마음부적",

  description: "AI 마음 치유 서비스",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },

  appleWebApp: {
    capable: true,

    title: "마음부적",

    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#111143",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
