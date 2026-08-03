import UserSessionGuard from "@/components/layouts/user-session-guard";
import AccountVerification from "@/components/verify/account-verification";

export default function VerifyPage() {
  return (
    <UserSessionGuard>
      <AccountVerification />
    </UserSessionGuard>
  );
}
