import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "DevElo | Gamified Technical Practice & Mock Interview Arena",
  description: "Practice realistic developer tasks, coding challenges, system designs, and hackathons with interactive, code-observant AI interviewers. Level up your ELO rating and Offer Readiness.",
};

import { StoreProvider } from "@/lib/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D1117]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
