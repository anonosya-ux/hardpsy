import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NeuroRoast — AI Анти-Коуч",
  description:
    "Токсичный AI-аддиктолог на базе КПТ. Пришли своё оправдание — получи жёсткую прожарку и реальный план действий.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NeuroRoast",
  },
};

export const viewport = {
  themeColor: "#ef4444",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-neutral-950`}>
        {children}
      </body>
    </html>
  );
}
