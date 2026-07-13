import Link from "next/link";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import PrimaryButton from "@/components/ui/primary-button";

export default function ForgotPasswordPage() {
  return (
    <UserAuthLayout>
      <div className="rounded-2xl border border-theme-gray-border bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-center text-3xl font-semibold text-theme-blue-dark">Reset Password</h1>
        <p className="mt-4 text-center text-theme-gray">
          Password reset form UI will be added next. This page is a route placeholder for auth flow.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/login">
            <PrimaryButton className="px-12">Back to Sign in</PrimaryButton>
          </Link>
        </div>
      </div>
    </UserAuthLayout>
  );
}
