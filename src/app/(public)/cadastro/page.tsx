import RegisterForm from "@/src/app/(public)/cadastro/components/register-form";
import AppTitle from "@/src/components/app-title";
import AuthGuard from "@/src/components/utils/auth-guard";
import Column from "@/src/components/utils/column";

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
