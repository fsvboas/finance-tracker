import FinancialDashboard from "@/src/components/financial-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex bg-[#f4f2ee] items-center sm:justify-center">
      <div className="items-center space-y-2 w-full max-w-3xl">
        <FinancialDashboard />
      </div>
    </div>
  );
}
