"use client";

import Link from "next/link";
import UserAuthLayout from "@/components/layouts/user-auth-layout";

export default function BannedPage() {
  return (
    <UserAuthLayout>
      <div className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-white">
          <h1 className="text-2xl font-semibold text-theme-red-action">Account banned</h1>
          <p className="mt-3 text-sm text-white/60">
            Your account has been restricted. Please contact iTrustLD support if you believe this is a mistake.
          </p>
          <Link
            href="/support"
            className="mt-6 inline-flex rounded-xl bg-theme-green-action px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Contact support
          </Link>
        </div>
      </div>
    </UserAuthLayout>
  );
}
