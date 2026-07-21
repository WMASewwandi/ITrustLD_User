import Link from "next/link";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import PrimaryButton from "@/components/ui/primary-button";

export default function ForgotPasswordPage() {
  return (
    <UserAuthLayout>
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/12 bg-white/[0.04] p-7 sm:p-9">
          <h1 className="text-center text-3xl font-semibold text-white">Reset Password</h1>
          <p className="mt-4 text-center text-sm text-white/55">
            Password reset form UI will be added next. This page is a route placeholder for auth flow.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/login">
              <PrimaryButton className="px-12">Back to Sign in</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
}
