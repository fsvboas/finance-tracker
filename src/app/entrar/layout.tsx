import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | Finance Tracker",
  description:
    "O Finance Tracker foi criado para que você possa, facilmente, controlar receitas, despesas e acompanhar seu orçamento pessoal de forma rápida e prática. Sem complicações.",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
