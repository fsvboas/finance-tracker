"use client";

import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  const CardBackgroundColors: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <Column
      className={`items-center justify-between border rounded-lg hover:opacity-80 transition-opacity duration-300 p-4 w-60 h-fit gap-2 ${
        CardBackgroundColors[card.color]
      }`}
    >
      <Column className="items-center">
        <p className="text-xl font-medium capitalize">{card.name}</p>
        <p className="capitalize text-sm">{card.type}</p>
      </Column>
      <Row className="w-full items-center justify-between">
        <Column className="mt-2">
          <span className="text-xs font-medium">Vencimento:</span>
          <span className="text-sm">{card?.dueDate}</span>
        </Column>
        <Column className="mt-2">
          <span className="text-xs font-medium">Limite:</span>
          <span className="text-sm">{card?.limit}</span>
        </Column>
      </Row>
    </Column>
  );
};

export default Card;
