import type { Metadata } from "next";
import "./globals.css";

const TITLE = "ZBS GG — memory that knows what matters";
const DESCRIPTION =
  "Independent research lab building empathic memory for AI companions. Garden.Pulse (engine), Garden.Heart (chat), Garden.Emo.Bench (public benchmark). MIT, one person, phuket.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zbs.gg"),
  title: {
    default: TITLE,
    template: "%s · ZBS GG",
  },
  description: DESCRIPTION,
  keywords: [
    "AI memory",
    "empathic memory",
    "AI companion",
    "retrieval",
    "anchor-aware decay",
    "state-aware retrieval",
    "Garden.Pulse",
    "open source",
    "MIT",
  ],
  authors: [{ name: "Nikita Shilov", url: "https://github.com/nikshilov" }],
  creator: "Nikita Shilov",
  applicationName: "ZBS GG",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zbs.gg",
    siteName: "ZBS GG",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Independent research lab. Garden.Pulse engine, Garden.Heart chat, public bench. MIT, my own money.",
    creator: "@nikshilov",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://zbs.gg",
  },
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
