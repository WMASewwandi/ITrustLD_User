"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import PasswordInput from "@/components/ui/password-input";
import { resetPassword } from "@/lib/auth";
import { isStrongPassword, isValidEmail } from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50";

export default function ResetPasswordForm({ token = "", initialEmail = "" }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
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
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
      );
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
      setSuccess(result.message || "Your password has been reset. You can now sign in.");
      setTimeout(() => router.push("/login?reset=success"), 1500);
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
          <h1 className="text-center text-3xl font-semibold text-white">Reset Password</h1>
          <p className="mt-4 text-center text-sm text-white/55">
            Use the form below to reset your password on iTrustLD.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p
                className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            {success ? (
              <p
                className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                role="status"
              >
                {success}
              </p>
            ) : null}

            <input type="hidden" name="token" value={token} />

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
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  if (!value) {
                    setPasswordHint("");
                    return;
                  }
                  setPasswordHint(
                    isStrongPassword(value)
                      ? ""
                      : "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
                  );
                }}
                className={fieldClass}
                toggleClassName="text-white/40 hover:text-white/70"
                autoComplete="new-password"
                required
              />
              {passwordHint ? <p className="mt-1 text-xs text-red-300">{passwordHint}</p> : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="passwordConfirmation">
                Confirm password
              </label>
              <PasswordInput
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={fieldClass}
                toggleClassName="text-white/40 hover:text-white/70"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="w-full rounded-lg bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating…" : "Reset Password"}
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
