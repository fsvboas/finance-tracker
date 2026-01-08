import Header from "@/src/components/core/header";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex min-h-screen w-full">{children}</main>
    </>
  );
}
