import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "../components/button";
import Column from "../components/utils/column";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 | Finance Tracker",
  description: "A página que você está tentando acessar não existe.",
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Column>
          <h1 className="text-9xl">
            <Column className="items-center">
              <strong>404</strong>
              <span className="text-xl">Página não encontrada</span>
            </Column>
          </h1>
          <p className="text-sm">
            A página que você está tentando acessar não existe
          </p>
        </Column>
        <Link href="/dashboard">
          <Button className="cursor-pointer" type="button">
            Voltar para o Finance Tracker
          </Button>
        </Link>
      </body>
    </html>
  );
}
