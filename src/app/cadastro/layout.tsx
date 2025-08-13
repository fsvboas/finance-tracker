import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro | Finance Tracker",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
