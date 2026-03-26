import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Новостройки в Батуми 2026 — Каталог ЖК | Цены, Рассрочка, Застройщики",
  description:
    "Каталог новостроек в Батуми 2026. Квартиры, виллы, таунхаусы от застройщиков. Цена, рассрочка, сроки, комиссии. 60+ объектов в Грузии.",
  keywords:
    "новостройки в Батуми, ЖК Батуми, квартиры в Батуми, застройщики Батуми, недвижимость Грузия, рассрочка Батуми, цены новостройки Батуми",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-canvas text-text-primary min-h-screen`}
      >
        <a href="#main-content" className="skip-to-content">
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
