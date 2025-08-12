import LoginForm from "@/src/app/entrar/components/login-form";
import { AuthGuard } from "@/src/components/utils/auth-guard";

export default function LoginScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <LoginForm />
    </AuthGuard>
  );
}
