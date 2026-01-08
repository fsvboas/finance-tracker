import Column from "@/src/components/core/column";
import UpdatePasswordForm from "./components/update-password-form";
import UpdateUserInfosForm from "./components/update-user-infos-form";
import UserDataSection from "./components/user-data-section";

export default function AccountScreen() {
  return (
    <Column className="space-y-4 items-center w-full justify-center h-fit sm:max-w-5xl mx-auto mt-16 lg:py-4">
      <UpdateUserInfosForm />
      <UpdatePasswordForm />
      <UserDataSection />
    </Column>
  );
}
