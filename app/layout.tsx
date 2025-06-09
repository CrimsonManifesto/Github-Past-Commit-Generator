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

export const metadata = {
  title: "GitHub Time Travel (Fake Commit History)",
  description:
    "Generate fake GitHub commit histories with an interactive contribution graph and batch script generator.",
  openGraph: {
    title: "GitHub Time Travel (Fake Commit History)",
    description:
      "Generate fake GitHub commit histories with an interactive contribution graph and batch script generator.",
    url: "https://fake-commit-history-github.vercel.app", // Change to your deployed URL
    siteName: "GitHub Time Travel",
    images: [
      {
        url: "/thumbnail.png", // Make sure this image exists in your public/ folder
        width: 1200,
        height: 630,
        alt: "GitHub Time Travel App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Time Travel (Fake Commit History)",
    description:
      "Generate fake GitHub commit histories with an interactive contribution graph and batch script generator.",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
