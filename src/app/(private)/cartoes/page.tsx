import Cards from "@/src/app/(private)/cartoes/components/cards";
import CardsScreenHeader from "@/src/app/(private)/cartoes/components/cards-screen-header";
import { Container } from "@/src/components/core/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartões",
};

export default function CardsScreen() {
  return (
    <Container variant="page">
      <CardsScreenHeader />
      <Cards />
    </Container>
  );
}
