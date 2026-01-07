import RegisterForm from "@/src/app/(public)/cadastro/components/register-form";
import AppTitle from "@/src/components/app-title";
import AuthGuard from "@/src/components/core/auth-guard";
import Column from "@/src/components/core/column";

export default function RegisterScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/transacoes">
      <Column className="space-y-4 items-center justify-center w-full mx-2">
        <AppTitle />
        <RegisterForm />
      </Column>
    </AuthGuard>
  );
}
