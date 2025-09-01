"use client";

import Column from "@/src/components/utils/column";
import { CardType } from "../types/card-type";
import CardBox from "./card-box";
import CardDetails from "./card-details";

const CardsList = () => {
  return (
    <Column className="h-fit w-full max-w-5xl max-lg:px-4 mt-16 py-4 items-center justify-center mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
        <CardBox type="new" />
        <CardBox type="all" />
        {mockCards?.map((card, index) => (
          <CardBox key={index} card={card} type="card" />
        ))}
      </div>
      <CardDetails />
    </Column>
  );
};

export default CardsList;

const mockCards: CardType[] = [
  {
    name: "Nubank",
    color: "bg-purple-700",
    type: "credit",
  },
  {
    name: "PicPay",
    color: "bg-green-700",
    type: "debit",
  },
  {
    name: "Banco do Brasil",
    color: "bg-yellow-600",
    type: "credit",
  },
];
