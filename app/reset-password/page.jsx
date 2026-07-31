"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import { resetPassword } from "@/lib/auth";
import { isValidEmail } from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white/50">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const nextEmail = email.trim();

    if (!token) {
      setError("Invalid or missing reset token. Request a new reset link.");
      return;
    }
    if (!isValidEmail(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!PASSWORD_PATTERN.test(password)) {
      setError("Password must be 8+ chars with upper, lower, number, and symbol.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await resetPassword({
        email: nextEmail,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(result.message || "Password reset successfully.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserAuthLayout>
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/12 bg-white/[0.04] p-7 sm:p-9">
          <h1 className="text-center text-3xl font-semibold text-white">Set New Password</h1>
          <p className="mt-4 text-center text-sm text-white/55">
            Choose a strong password for your account.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" role="status">
                {success}
              </p>
            ) : null}

            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="passwordConfirmation">
                Confirm password
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={fieldClass}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating…" : "Reset password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-theme-green-action hover:underline">
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
}
