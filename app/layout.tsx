// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./bootstrap.css";
import BootstrapClient from './bootstrap';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movies App",
  description: "A movie browsing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      {/* Preload a common placeholder image or critical image */}
      <link
        rel="preload"
        href="https://image.tmdb.org/t/p/w500/common-poster.jpg"
        as="image"
        type="image/jpeg"
      />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <BootstrapClient />
      {children}
    </body>
  </html>
  );
}