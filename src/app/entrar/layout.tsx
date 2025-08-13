import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | Finance Tracker",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
