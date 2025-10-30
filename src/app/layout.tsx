import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Color Palette Generator",
  description:
    "Create beautiful and inspiring color palettes instantly. Powered by the Colormind API, this free online tool helps designers find perfect color combinations for any project.",
  keywords: [
    "color palette generator",
    "colormind",
    "color inspiration",
    "design tool",
    "palette maker",
    "color design",
  ],
  openGraph: {
    title: "Color Palette Generator",
    description:
      "Generate beautiful color palettes instantly with this free online tool powered by Colormind. Perfect for designers and artists seeking color inspiration.",
    url: "https://color-palette-generator.tanenhao.com",
    siteName: "Enhao Tan",
    images: [
      {
        url: "https://color-palette-generator.tanenhao.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Color Palette Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator",
    description:
      "Create beautiful and inspiring color palettes instantly. Powered by the Colormind API.",
    images: ["https://color-palette-generator.tanenhao.com/og-image.png"],
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
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
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
