import Card from "./financial-summary-card";
import Flex from "./utils/flex";

interface FinancialSummaryProps {
  totalIncoming: number;
  totalOutcoming: number;
  total: number;
}

export default function FinancialSummary({
  totalIncoming,
  totalOutcoming,
  total,
}: FinancialSummaryProps) {
  return (
    <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
      <Card title="Entradas" value={totalIncoming} />
      <Card title="Saídas" value={totalOutcoming} />
      <Card title="Disponível" value={total} />
    </Flex>
  );
}
