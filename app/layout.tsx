import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FocusFlow - Distraction-Free Learning for CS Students",
  description:
    "A productivity-first, distraction-free learning platform for computer science students and job seekers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
