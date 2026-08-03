"use client";

import Link from "next/link";
import { useState } from "react";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import { requestPasswordReset } from "@/lib/auth";
import { isValidEmail } from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const nextEmail = email.trim();

    if (!isValidEmail(nextEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(nextEmail);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "An error occurred while sending the reset link. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserAuthLayout>
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/12 bg-white/[0.04] p-7 sm:p-9">
          <h1 className="text-center text-3xl font-semibold text-white">Reset Password Request</h1>
          <p className="mt-4 text-center text-sm text-white/55">
            To reset your password, enter the email address you used for your iTrustLD account. We&apos;ll
            send a reset link to your inbox.
          </p>

          {submitted ? (
            <div
              className="mt-8 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200"
              role="status"
            >
              <p className="font-medium">We have sent an email. Please check your inbox.</p>
              <p className="mt-2 text-emerald-100/80">
                If an account exists for that address, you will receive a password reset link shortly.
              </p>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              {error ? (
                <p
                  className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  role="alert"
                >
                  {error}
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
                  placeholder="Enter email"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending…" : "Email Password Reset Link"}
              </button>
            </form>
          )}

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
