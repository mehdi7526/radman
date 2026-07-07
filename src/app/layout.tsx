import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/seo";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartProvider } from "@/components/cart/cart-provider";

const iranYekan = localFont({
  src: [
    { path: "./fonts/IRANYekanXFaNum-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IRANYekanXFaNum-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/IRANYekanXFaNum-DemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/IRANYekanXFaNum-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-iran-yekan",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "fa_IR",
    type: "website",
    siteName: siteConfig.name
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={iranYekan.variable}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
