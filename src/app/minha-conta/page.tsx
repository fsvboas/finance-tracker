import AuthGuard from "@/src/components/utils/auth-guard";
import MyAccountSections from "./components/my-account-sections";

export default function MyAccountScreen() {
  return (
    <AuthGuard requireAuth>
      <MyAccountSections />
    </AuthGuard>
  );
}
