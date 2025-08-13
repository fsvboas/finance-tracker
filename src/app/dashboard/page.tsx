import { AuthGuard } from "@/src/components/utils/auth-guard";
import FinancialDashboard from "./components/financial-dashboard";

export default function Home() {
  return (
    <AuthGuard requireAuth redirectTo="/entrar">
      <FinancialDashboard />
    </AuthGuard>
  );
}
