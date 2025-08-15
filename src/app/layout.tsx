import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/footer";
import Header from "../components/header";
import { Toaster } from "../components/sonner";
import TopLoadingBar from "../components/top-loading-bar";
import { UserPinProvider } from "../contexts/user-pin-context";
import { TanstackQueryProvider } from "../libs/tanstack-query";
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
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <TanstackQueryProvider>
          <UserPinProvider>
            <TopLoadingBar />
            <Header />
            <main className="min-h-screen w-full flex bg-white">
              {children}
            </main>
            <Footer />
          </UserPinProvider>
        </TanstackQueryProvider>
        <Toaster visibleToasts={1} />
      </body>
    </html>
  );
}
