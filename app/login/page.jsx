import Link from "next/link";
import UserAuthLayout from "@/components/layouts/user-auth-layout";

export default function LoginPage() {
  return (
    <UserAuthLayout>
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_28px_90px_rgba(8,12,30,0.5)]">
        <div className="grid md:grid-cols-2">
          <section className="p-7 sm:p-10 lg:p-12">
            <Link href="/" className="inline-block">
              <img src="/assets/img/logos/logo-itrustld-wide-dark.svg" alt="iTrustLD" className="h-10 w-auto" />
            </Link>
            <h1 className="mt-7 text-3xl font-semibold text-theme-blue-dark">Welcome back</h1>
            <p className="mt-2 text-sm text-theme-gray">Sign in to continue to your secure iTrustLD dashboard.</p>

            <form className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-theme-gray">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue="john12@gmail.com"
                  className="w-full rounded-lg border border-[#CDD5E0] bg-[#F7F9FC] px-3 py-2.5 text-sm text-theme-black outline-none ring-0 transition focus:border-theme-blue-dark focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-theme-gray">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue="........"
                  className="w-full rounded-lg border border-[#CDD5E0] bg-[#F7F9FC] px-3 py-2.5 text-sm text-theme-black outline-none ring-0 transition focus:border-theme-blue-dark focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs text-theme-gray">
                  <input type="checkbox" className="h-4 w-4 rounded border-theme-gray-border text-theme-green-action" defaultChecked />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-theme-blue-dark hover:text-theme-green-action">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="button"
                className="mt-1 w-full rounded-lg bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_22px_rgba(13,159,27,0.35)] transition hover:brightness-110"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-xs text-theme-gray">Protected by 256-bit encryption and session security controls.</p>
          </section>

          <section className="relative hidden min-h-[520px] overflow-hidden bg-gradient-to-br from-theme-blue-dark via-theme-blue-darkshade to-[#2B2B7A] md:block">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/25 blur-2xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/20 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between p-10 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/65">Security Layer</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  Enterprise-grade
                  <br />
                  account protection
                </h2>
              </div>

              <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium">Active Controls</p>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  <li>- Encrypted login sessions</li>
                  <li>- Device activity monitoring</li>
                  <li>- Multi-layer fraud checks</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/30 bg-black/20 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80">New to iTrustLD?</p>
                <Link href="/register" className="mt-1 inline-block text-lg font-semibold text-theme-green-action">
                  Create your account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </UserAuthLayout>
  );
}
