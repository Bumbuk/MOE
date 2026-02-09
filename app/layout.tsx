import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Магазин",
  description: "Каталог товаров",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      {/* Use CSS variables for colours instead of hardcoded dark palette.
         The pastel palette is defined in globals.css. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader />
        {props.children}
        <SiteFooter />
      </body>
    </html>
  );
}
