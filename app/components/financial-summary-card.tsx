import { Banknote, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import CurrencyFormatter from "../helpers/currency-formatter";
import Column from "./utils/column";
import Row from "./utils/row";

interface CardProps {
  title: "Entradas" | "Saídas" | "Total";
  value?: number | string;
}
const Card = ({ title, value }: CardProps) => {
  return (
    <Column className="p-4 bg-white w-full md:max-w-60 min-h-32 justify-between rounded">
      <Row className="justify-between">
        <p>{title}</p>
        <span>{cardIconMap[title]}</span>
      </Row>
      <p className="text-3xl font-medium">
        <CurrencyFormatter>{value}</CurrencyFormatter>
      </p>
    </Column>
  );
};

export default Card;

const cardIconMap = {
  Entradas: <BanknoteArrowUp className="text-green-600" />,
  Saídas: <BanknoteArrowDown className="text-red-600" />,
  Total: <Banknote />,
};
