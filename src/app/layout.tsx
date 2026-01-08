import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "../components/core/sonner";
import Providers from "../providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Finance Tracker",
    template: "%s | Finance Tracker",
  },
  description:
    "O Finance Tracker foi criado para que você possa controlar receitas, despesas e acompanhar seu orçamento pessoal de forma rápida e prática. Sem complicações.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased `}>
        <Providers>
          <NextTopLoader
            color="##00c951"
            height={3}
            showSpinner={true}
            speed={300}
            crawl={false}
            easing="ease"
            showAtBottom={false}
          />
          <main className="flex min-h-screen w-full">{children}</main>
          <Toaster visibleToasts={1} />
        </Providers>
      </body>
    </html>
  );
}
