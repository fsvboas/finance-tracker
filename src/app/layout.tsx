import "@/src/styles/nprogress.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/footer";
import Header from "../components/header";
import { Toaster } from "../components/sonner";
import TopLoadingBar from "../components/top-loading-bar";
import { UserSecretsProvider } from "../contexts/user-secrets-context";
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
          <UserSecretsProvider>
            <TopLoadingBar />
            <Header />
            <main className="min-h-screen w-full flex bg-white">
              {children}
            </main>
            <Footer />
          </UserSecretsProvider>
        </TanstackQueryProvider>
        <Toaster visibleToasts={1} className="!mb-8" />
      </body>
    </html>
  );
}
