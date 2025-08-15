import Flex from "@/src/components/utils/flex";
import Show from "@/src/components/utils/show";
import Card from "./financial-summary-card";
import FinancialSummarySkeleton from "./skeleton/financial-summary-skeleton";

interface FinancialSummaryProps {
  totalIncoming: number;
  totalOutcoming: number;
  total: number;
  pending: boolean;
}

export default function FinancialSummary({
  totalIncoming,
  totalOutcoming,
  total,
  pending,
}: FinancialSummaryProps) {
  return (
    <Show when={!pending} fallback={<FinancialSummarySkeleton />}>
      <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
        <Card title="Entradas" value={totalIncoming} />
        <Card title="Saídas" value={totalOutcoming} />
        <Card title="Disponível" value={total} />
      </Flex>
    </Show>
  );
}
