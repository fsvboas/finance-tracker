import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Cartões | Finance Tracker",
};

export default function CardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
