import LoginForm from "@/src/app/entrar/components/login-form";
import AppTitle from "@/src/components/app-title";
import AuthGuard from "@/src/components/utils/auth-guard";
import Column from "@/src/components/utils/column";

export default function LoginScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <Column className="space-y-4 items-center justify-center w-full mx-2">
        <AppTitle />
        <LoginForm />
      </Column>
    </AuthGuard>
  );
}
