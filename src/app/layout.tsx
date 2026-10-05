import type { Metadata } from "next";
import { Playfair_Display, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/modules/order/context/cart-context";
import { ToastProvider } from "@/components/storefront/ui/ToastProvider";
import { Navbar } from "@/components/storefront/navigation/Navbar";
import { Footer } from "@/components/storefront/navigation/Footer";
import { CartDrawer } from "@/components/storefront/cart/CartDrawer";
import { env } from "@/config/env";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: `LUXE | Clothing Store - Everyday Looks Better On You`,
  description:
    "Premium streetwear crafted with comfort, quality, and effortless style. 280 GSM heavyweight tees, relaxed lowers, and tailored trousers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${outfit.variable} antialiased`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#fafaf8] text-[#121212] selection:bg-[#121212] selection:text-white">
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
