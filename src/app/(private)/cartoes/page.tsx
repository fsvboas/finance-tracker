"use client";

import Card from "@/src/app/(private)/cartoes/components/card";
import CardsScreenHeader from "@/src/app/(private)/cartoes/components/cards-screen-header";
import { getCards } from "@/src/app/(private)/cartoes/services";
import AuthGuard from "@/src/components/utils/auth-guard";
import { Container } from "@/src/components/utils/container";
import { useQuery } from "@tanstack/react-query";

export default function CardsScreen() {
  const { data, isPending: pendingGetCards } = useQuery({
    queryFn: getCards,
    queryKey: ["cards"],
  });

  const cards = data || [];

  return (
    <AuthGuard requireAuth>
      <Container variant="page">
        <CardsScreenHeader />
        <div className="w-full grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-2">
          {cards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </Container>
    </AuthGuard>
  );
}
