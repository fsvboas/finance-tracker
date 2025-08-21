import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  PiggyBank,
} from "lucide-react";

interface CardProps {
  title: "Entradas" | "Saídas" | "Investimentos" | "Disponível";
  value: number;
}
const Card = ({ title, value }: CardProps) => {
  const isNegativeValue = value < 0;

  const availableBalanceStyle =
    title === "Disponível" && isNegativeValue ? "text-red-600" : "text-primary";

  return (
    <Column className="p-4 bg-neutral-100 dark:bg-[#202020] w-full justify-between rounded">
      <Row className="justify-between">
        <p>{title}</p>
        <span>{cardIconMap[title]}</span>
      </Row>
      <p className={`text-2xl font-medium ${availableBalanceStyle}`}>
        <CurrencyFormatter>{value}</CurrencyFormatter>
      </p>
    </Column>
  );
};

export default Card;

const cardIconMap = {
  Entradas: <BanknoteArrowUp className="text-green-600" />,
  Saídas: <BanknoteArrowDown className="text-red-600" />,
  Investimentos: <PiggyBank className="text-yellow-600" />,
  Disponível: <Banknote />,
};
