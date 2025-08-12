import Header from "@/src/components/header";
import { AuthGuard } from "@/src/components/utils/auth-guard";
import FinancialDashboard from "./components/financial-dashboard";

export default function Home() {
  return (
    <AuthGuard requireAuth redirectTo="/entrar">
      <div className="min-h-screen w-full flex bg-[#f4f2ee] items-center sm:justify-center">
        <div className="items-center space-y-2 w-full">
          <Header />
          <FinancialDashboard />
        </div>
      </div>
    </AuthGuard>
  );
}
