"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import { resolveSessionUser } from "@/lib/accounts";
import { isValidEmail } from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email?.value?.trim() || "";
    if (!isValidEmail(email)) {
      setError("Enter a valid email with @ and a domain. Spaces are not allowed.");
      return;
    }
    if (email.toLowerCase() === "unknown@email.com") {
      setError("This email address is not registered in the system.");
      return;
    }
    setError("");
    const name = email.split("@")[0] || "User";
    const sessionUser = resolveSessionUser({
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
    });
    localStorage.setItem("itrustld_user", JSON.stringify(sessionUser));
    router.push("/dashboard");
  }

  return (
    <UserAuthLayout>
      <div className="mx-auto grid min-h-screen w-full max-w-6xl md:grid-cols-2">
        <section className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <Link href="/" className="inline-block w-fit">
            <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
          </Link>
          <h1 className="mt-7 text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-white/55">Sign in to continue to your secure iTrustLD dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSignIn} noValidate>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue="partner@itrustld.com"
                placeholder="partner@itrustld.com"
                onChange={() => setError("")}
                className={fieldClass}
              />
              {error ? <p className="mt-1 text-xs text-theme-red-action">{error}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                defaultValue="........"
                className={fieldClass}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-white/55">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-transparent text-theme-green-action"
                  defaultChecked
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-white/70 transition hover:text-theme-green-action"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-xs text-white/40">
            Protected by 256-bit encryption and session security controls.
          </p>

          <div className="mt-8 border-t border-white/10 pt-6 md:hidden">
            <p className="text-sm text-white/55">New to iTrustLD?</p>
            <Link href="/register" className="mt-1 inline-block text-base font-semibold text-theme-green-action">
              Create your account
            </Link>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden border-l border-white/10 md:flex">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-theme-green-action/15 blur-2xl" />
          <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/20 blur-2xl" />
          <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/15 blur-3xl" />

          <div className="relative flex h-full w-full flex-col justify-between p-10 text-white lg:p-14">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/65">Security Layer</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight">
                Enterprise-grade
                <br />
                account protection
              </h2>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-medium">Active Controls</p>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>- Encrypted login sessions</li>
                <li>- Device activity monitoring</li>
                <li>- Multi-layer fraud checks</li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/12 bg-white/[0.04] p-4">
              <p className="text-sm text-white/80">New to iTrustLD?</p>
              <Link href="/register" className="mt-1 inline-block text-lg font-semibold text-theme-green-action">
                Create your account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </UserAuthLayout>
  );
}
