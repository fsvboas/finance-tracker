import Flex from "@/src/components/utils/flex";
import Show from "@/src/components/utils/show";
import Card from "./financial-summary-card";
import FinancialSummarySkeleton from "./skeleton/financial-summary-skeleton";

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  total: number;
  pending: boolean;
}

const FinancialSummary = ({
  totalIncome,
  totalExpense,
  totalInvestment,
  total,
  pending,
}: FinancialSummaryProps) => {
  return (
    <Show when={!pending} fallback={<FinancialSummarySkeleton />}>
      <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
        <Card title="Entradas" value={totalIncome} />
        <Card title="Saídas" value={totalExpense} />
        <Card title="Investidos" value={totalInvestment} />
        <Card title="Disponível" value={total} />
      </Flex>
    </Show>
  );
};

export default FinancialSummary;
