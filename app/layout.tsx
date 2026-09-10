import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OES Global Leadership Dashboard",
  description: "Weekly leadership reporting for OES Global Inc.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Suspense fallback={null}>
          <NavBar />
        </Suspense>
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
