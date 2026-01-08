import { Metadata } from "next";
import FinancialDashboard from "./components/financial-dashboard";

export const metadata: Metadata = {
  title: "Transações",
};

export default function TransactionsScreen() {
  return <FinancialDashboard />;
}
