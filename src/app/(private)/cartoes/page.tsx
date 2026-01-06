import Card from "@/src/app/(private)/cartoes/components/card";
import CardsScreenHeader from "@/src/app/(private)/cartoes/components/cards-screen-header";
import AuthGuard from "@/src/components/utils/auth-guard";
import { Container } from "@/src/components/utils/container";

export default function CardsScreen() {
  return (
    <AuthGuard requireAuth>
      <Container variant="page">
        <CardsScreenHeader />
        <Card
          card={{
            name: "Nubank",
            type: "credit",
            limit: "R$ 1.000,00",
            dueDate: "15/04/2024",
            closingDate: "01/04/2024",
            color: "purple",
          }}
        />
      </Container>
    </AuthGuard>
  );
}
