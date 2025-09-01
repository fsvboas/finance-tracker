import AuthGuard from "@/src/components/utils/auth-guard";
import CardsList from "./components/cards-list";

export default function CardsScreen() {
  return (
    <AuthGuard requireAuth>
      <CardsList />
    </AuthGuard>
  );
}
