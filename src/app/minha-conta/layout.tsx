import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta | Finance Tracker",
};

export default function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
