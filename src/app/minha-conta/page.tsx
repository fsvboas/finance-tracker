import AuthGuard from "@/src/components/utils/auth-guard";
import Column from "@/src/components/utils/column";
import UpdateUserForm from "./components/update-user-form";

export default function MyAccountScreen() {
  return (
    <AuthGuard requireAuth>
      <Column className="space-y-4 items-center justify-center w-full">
        <UpdateUserForm />
      </Column>
    </AuthGuard>
  );
}
