import LoginForm from "@/src/app/(public)/entrar/components/login-form";
import AppTitle from "@/src/components/app-title";
import { Container } from "@/src/components/core/container";

export default function LoginScreen() {
  return (
    <Container className="flex flex-col gap-4 items-center justify-center">
      <AppTitle />
      <LoginForm />
    </Container>
  );
}
