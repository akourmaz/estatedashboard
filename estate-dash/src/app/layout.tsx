import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EstateDash — Дашборд недвижимости",
  description:
    "Внутренний дашборд для агентов по недвижимости в Грузии. Поиск, фильтрация и просмотр объектов застройщиков.",
  keywords: "недвижимость, Грузия, Батуми, Тбилиси, дашборд, агент",
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
