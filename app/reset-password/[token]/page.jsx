"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordWithTokenPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white/50">Loading…</div>}>
      <ResetPasswordWithTokenContent />
    </Suspense>
  );
}

function ResetPasswordWithTokenContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawToken = params?.token;
  const token = typeof rawToken === "string" ? decodeURIComponent(rawToken) : "";
  const emailFromQuery = searchParams.get("email") || "";

  return <ResetPasswordForm token={token} initialEmail={emailFromQuery} />;
}
