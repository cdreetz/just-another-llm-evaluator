import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderBar from '@/components/HeaderBar'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test LLMs",
  description: "Evaluation and compare different LLMs and prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <div className="h-[7%]">
            <HeaderBar />
          </div>
          <div className="flex-grow">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
