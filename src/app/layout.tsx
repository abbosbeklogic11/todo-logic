import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Todo Logic — Maqsadlaringizni boshqaring",
  description:
    "Vazifalar, maqsadlar, odatlar va fokus vaqtini bir joyda boshqarish uchun premium darajadagi vosita.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('todo-logic-theme')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uz"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        <Script id="theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
