import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "千里江山 · 建筑方言",
  description: "Algorithmic Architectural Dialects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <body
        className={`${notoSerif.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
