import "@/src/styles/nprogress.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/footer";
import Header from "../components/header";
import { Toaster } from "../components/sonner";
import TopLoadingBar from "../components/top-loading-bar";
import Providers from "../providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description:
    "O Finance Tracker foi criado para que você possa, facilmente, controlar receitas, despesas e acompanhar seu orçamento pessoal de forma rápida e prática. Sem complicações.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased `}>
        <Providers>
          <TopLoadingBar />
          <Header />
          <main className="min-h-screen w-full flex">{children}</main>
          <Footer />
          <Toaster visibleToasts={1} className="!mb-8" />
        </Providers>
      </body>
    </html>
  );
}
