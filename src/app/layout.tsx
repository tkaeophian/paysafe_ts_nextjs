import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SafePayScript from "@/lib/safepay-script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PaySafe NextJs Example",
  description: "PaySafe NextJs Example",
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
        <SafePayScript />
        {children}
      </body>
    </html>
  );
}
