import RegisterForm from "@/src/app/cadastro/components/register-form";
import { AuthGuard } from "@/src/components/utils/auth-guard";

export default function RegisterScreen() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <RegisterForm />
    </AuthGuard>
  );
}
