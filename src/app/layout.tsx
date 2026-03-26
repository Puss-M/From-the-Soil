import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "千里江山 · 建筑方言",
  description: "从土而生 · 探索中国传统民居的气候适应性智慧 | Algorithmic Architectural Dialects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        style={{ fontFamily: 'var(--font-sans), "Noto Sans SC", system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
