import { Container } from "@/src/components/core/container";
import UpdatePasswordForm from "./components/update-password-form";
import UpdateUserInfosForm from "./components/update-user-infos-form";
import UserDataSection from "./components/user-data-section";

export default function AccountScreen() {
  return (
    <Container variant="page">
      <h1 className="text-xl font-bold self-start">Conta</h1>
      <UpdateUserInfosForm />
      <UpdatePasswordForm />
      <UserDataSection />
    </Container>
  );
}
