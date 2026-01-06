import AuthGuard from "@/src/components/utils/auth-guard";
import FinancialDashboard from "./components/financial-dashboard";

export default function TransactionsScreen() {
  return (
    <AuthGuard requireAuth>
      <FinancialDashboard />
    </AuthGuard>
  );
}
