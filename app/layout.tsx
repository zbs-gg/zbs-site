import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZBS GG Consulting",
  description:
    "Independent research lab. We build Garden — empathic memory for AI companions. Pulse, Hearth, public benchmark.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
