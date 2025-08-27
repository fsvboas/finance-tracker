import Flex from "@/src/components/utils/flex";
import Show from "@/src/components/utils/show";
import FinancialSummaryCard from "./financial-summary-card";
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
      <Flex className="gap-2 w-full justify-center items-center grid grid-cols-2 md:grid-cols-4">
        <FinancialSummaryCard title="Entradas" value={totalIncome} />
        <FinancialSummaryCard title="Saídas" value={totalExpense} />
        <FinancialSummaryCard title="Investimentos" value={totalInvestment} />
        <FinancialSummaryCard title="Disponível" value={total} />
      </Flex>
    </Show>
  );
};

export default FinancialSummary;
