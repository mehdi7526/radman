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
    { path: "./fonts/IRANYekanXFaNum-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-iran-yekan",
  display: "swap",
  preload: true
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
    siteName: siteConfig.name,
    images: [{ url: "/brand/radman-logo.png", width: 512, height: 512, alt: siteConfig.name }]
  },
  icons: {
    icon: "/brand/radman-logo.png",
    apple: "/brand/radman-logo.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={iranYekan.variable}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          رفتن به محتوای اصلی
        </a>
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
