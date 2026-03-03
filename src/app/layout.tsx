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
