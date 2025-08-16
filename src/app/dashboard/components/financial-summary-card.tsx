import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import { Banknote, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

interface CardProps {
  title: "Entradas" | "Saídas" | "Disponível";
  value: number;
}
const Card = ({ title, value }: CardProps) => {
  const isPositiveBalance = value > 0;
  const isNegativeValue = value < 0;

  const availableBalanceStyle =
    title === "Disponível" && isPositiveBalance
      ? "text-green-600"
      : isNegativeValue
      ? "text-red-600"
      : "text-black";

  return (
    <Column className="p-4 bg-neutral-100 dark:bg-[#202020] w-full justify-between rounded">
      <Row className="justify-between">
        <p>{title}</p>
        <span>{cardIconMap[title]}</span>
      </Row>
      <p
        className={`text-2xl font-medium ${availableBalanceStyle} text-primary`}
      >
        <CurrencyFormatter>{value}</CurrencyFormatter>
      </p>
    </Column>
  );
};

export default Card;

const cardIconMap = {
  Entradas: <BanknoteArrowUp className="text-green-600" />,
  Saídas: <BanknoteArrowDown className="text-red-600" />,
  Disponível: <Banknote />,
};
