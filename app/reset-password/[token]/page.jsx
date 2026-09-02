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
  const encoded = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  let token = typeof encoded === "string" ? encoded : "";
  try {
    token = decodeURIComponent(token);
  } catch {
    // useParams already decoded most tokens
  }
  const emailFromQuery = searchParams.get("email") || "";

  return <ResetPasswordForm token={token} initialEmail={emailFromQuery} />;
}
