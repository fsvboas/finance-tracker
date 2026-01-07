"use client";

import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import Column from "@/src/components/utils/column";

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  console.log("card", card);
  return (
    <Column
      className="items-center justify-center border rounded-lg hover:opacity-80 transition-opacity duration-300 p-4 w-full h-26 gap-2 text-white"
      style={{
        backgroundColor: "#181818",
      }}
    >
      <Column className="items-center">
        <p className="text-lg font-semibold capitalize truncate ellipsis text-white">
          {card.card_name}
        </p>
        <p className="capitalize text-sm">{card.card_type}</p>
      </Column>
    </Column>
  );
};

export default Card;
