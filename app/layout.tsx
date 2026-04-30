import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MetaPixel from "@/components/MetaPixel";
import SaleStrip from "@/components/SaleStrip";

export const metadata: Metadata = {
  title: "Luna Blades — Lightsabers, made for the people who love them",
  description:
    "High-quality lightsabers at honest prices. T6 aluminum hilts, dueling-grade polycarbonate blades, real sound. Built for fans, gifted by people who get it.",
  metadataBase: new URL("https://lunablades.com"),
  openGraph: {
    title: "Luna Blades",
    description: "Lightsabers, made for the people who love them.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <MetaPixel />
        <div className="relative z-[2]">
          <SaleStrip />
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
        <CartDrawer />
      </body>
    </html>
  );
}
