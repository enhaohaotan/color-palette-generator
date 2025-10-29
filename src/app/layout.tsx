import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Random Color Palette Generator",
  description: "Generate random color palettes",
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
        <Toaster
          duration={1500}
          // position="top-center"
          toastOptions={{
            style: {
              boxShadow: "none",
              borderRadius: "0px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
            },
            classNames: {
              description: "!text-neutral-400",
            },
          }}
        />
      </body>
    </html>
  );
}
