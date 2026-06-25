import { Toaster } from "@/components/ui/toaster";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BTD Portal",
  description: "Portal for Before the Dates application",
  icons: {
    icon: "/fav/favicon.ico",
    apple: "/fav/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetaPixel />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
