"use client";

import Card from "@/src/app/(private)/cartoes/components/card";
import { getCards } from "@/src/app/(private)/cartoes/services";
import { useQuery } from "@tanstack/react-query";

const Cards = () => {
  const { data, isPending: pendingGetCards } = useQuery({
    queryFn: getCards,
    queryKey: ["cards"],
  });

  const cards = data || [];

  return (
    <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-2">
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
};

export default Cards;
