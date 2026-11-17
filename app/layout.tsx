import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xcerebro",
  description: "Explore Xcerebro and access your client experience.",
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
