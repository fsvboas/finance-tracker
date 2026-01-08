import LoginForm from "@/src/app/(public)/entrar/components/login-form";
import AppTitle from "@/src/components/app-title";
import { Container } from "@/src/components/core/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginScreen() {
  return (
    <Container className="flex flex-col gap-4 items-center justify-center">
      <AppTitle />
      <LoginForm />
    </Container>
  );
}
