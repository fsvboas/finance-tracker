import LoginForm from "@/src/app/entrar/components/login-form";
import AuthGuard from "@/src/components/utils/auth-guard";
import Column from "@/src/components/utils/column";

export default function LoginScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <Column className="space-y-4 items-center justify-center w-full mx-2">
        <Column className="w-fit items-end">
          <h1 className="text-4xl md:text-5xl font-bold">Finance Tracker</h1>
          <span className="text-xs">~ainda to pensando em um nome</span>
        </Column>
        <LoginForm />
      </Column>
    </AuthGuard>
  );
}
