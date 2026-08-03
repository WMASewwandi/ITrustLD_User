"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white/50">Loading…</div>}>
      <ResetPasswordQueryRedirect />
    </Suspense>
  );
}

function ResetPasswordQueryRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (token) {
      const nextUrl = `/reset-password/${encodeURIComponent(token)}${email ? `?email=${encodeURIComponent(email)}` : ""}`;
      router.replace(nextUrl);
    }
  }, [token, email, router]);

  if (token) {
    return <div className="flex min-h-screen items-center justify-center text-white/50">Loading…</div>;
  }

  return (
    <ResetPasswordForm
      token=""
      initialEmail={email}
    />
  );
}
