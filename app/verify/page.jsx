import VerifyAuthGate from "@/components/layouts/verify-auth-gate";
import AccountVerification from "@/components/verify/account-verification";

export default function VerifyPage() {
  return (
    <VerifyAuthGate>
      <AccountVerification />
    </VerifyAuthGate>
  );
}
