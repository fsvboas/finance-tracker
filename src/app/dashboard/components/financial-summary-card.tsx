import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import CurrencyFormatter from "@/src/helpers/currency-formatter";
import { Banknote, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

interface CardProps {
  title: "Entradas" | "Saídas" | "Disponível";
  value?: number | string;
}
const Card = ({ title, value }: CardProps) => {
  return (
    <Column className="p-4 bg-white w-full justify-between rounded">
      <Row className="justify-between">
        <p>{title}</p>
        <span>{cardIconMap[title]}</span>
      </Row>
      <p className="text-2xl font-medium">
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
