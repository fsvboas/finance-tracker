import AuthGuard from "@/src/components/utils/auth-guard";
import Column from "@/src/components/utils/column";

export default function CardsScreen() {
  return (
    <AuthGuard requireAuth>
      <Column className="items-center h-fit w-full max-w-5xl mx-auto mt-16">
        <h1>Meus Cartões</h1>
      </Column>
    </AuthGuard>
  );
}
