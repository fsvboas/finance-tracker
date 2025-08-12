import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "../components/sonner";
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
      <body className={`${inter} antialiased`}>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster expand={true} />
      </body>
    </html>
  );
}
