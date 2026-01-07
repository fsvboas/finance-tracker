import LoginForm from "@/src/app/(public)/entrar/components/login-form";
import AppTitle from "@/src/components/app-title";
import AuthGuard from "@/src/components/core/auth-guard";
import Column from "@/src/components/core/column";

export default function LoginScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/transacoes">
      <Column className="space-y-4 items-center justify-center w-full mx-2">
        <AppTitle />
        <LoginForm />
      </Column>
    </AuthGuard>
  );
}
