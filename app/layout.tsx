import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Cerebro — Voice Command Center",
  description: "JARVIS-style AI operating system with an Obsidian-style memory graph.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
