import RegisterForm from "@/src/app/(public)/cadastro/components/register-form";
import AppTitle from "@/src/components/app-title";
import { Container } from "@/src/components/core/container";

export default function RegisterScreen() {
  return (
    <Container className="flex flex-col gap-4 items-center justify-center">
      <AppTitle />
      <RegisterForm />
    </Container>
  );
}
