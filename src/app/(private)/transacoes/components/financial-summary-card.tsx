import Column from "@/src/components/core/column";
import Row from "@/src/components/core/row";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  PiggyBank,
} from "lucide-react";

interface FinancialSummaryCardProps {
  title: "Entradas" | "Saídas" | "Investimentos" | "Disponível";
  value: number;
}
const FinancialSummaryCard = ({ title, value }: FinancialSummaryCardProps) => {
  const isNegativeValue = value < 0;

  const availableBalanceStyle =
    title === "Disponível" && isNegativeValue ? "text-red-600" : "text-primary";

  return (
    <Column className="p-4 bg-neutral-100 dark:bg-[#202020] w-full justify-between rounded h-22">
      <Row className="justify-between">
        <p className="text-gray-500 text-sm sm:text-base">{title}</p>
        <span>{cardIconMap[title]}</span>
      </Row>
      <p className={`text-lg sm:text-2xl font-medium ${availableBalanceStyle}`}>
        <CurrencyFormatter>{value}</CurrencyFormatter>
      </p>
    </Column>
  );
};

export default FinancialSummaryCard;

const cardIconMap = {
  Entradas: <BanknoteArrowUp className="text-green-600" />,
  Saídas: <BanknoteArrowDown className="text-red-600" />,
  Investimentos: <PiggyBank className="text-yellow-600" />,
  Disponível: <Banknote />,
};
