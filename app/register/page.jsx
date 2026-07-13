import Link from "next/link";
import UserAuthLayout from "@/components/layouts/user-auth-layout";

export default function RegisterPage() {
  const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-theme-gray";
  const fieldClass =
    "w-full rounded-lg border border-[#CDD5E0] bg-[#F7F9FC] px-3 py-2 text-[13px] text-theme-black outline-none ring-0 transition focus:border-theme-blue-dark focus:bg-white";

  return (
    <UserAuthLayout>
      <div className="register-fit mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_28px_90px_rgba(8,12,30,0.5)]">
        <div className="grid lg:grid-cols-2">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-theme-blue-dark via-theme-blue-darkshade to-[#2B2B7A] lg:block">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/25 blur-2xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/20 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between p-10 text-white">
              <div>
                <Link href="/" className="inline-block">
                  <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
                </Link>
                <h1 className="mt-6 text-4xl font-semibold">Sign Up</h1>
                <p className="mt-1 text-sm text-white/80">Sign up to create a new account</p>
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/65">Create Account</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  Start your secure
                  <br />
                  digital exchange journey
                </h2>
              </div>

              <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium">Why join iTrustLD</p>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  <li>- Fast account verification process</li>
                  <li>- Local and international transactions</li>
                  <li>- Security-first user platform</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/30 bg-black/20 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80">Already registered?</p>
                <Link href="/login" className="mt-1 inline-block text-lg font-semibold text-theme-green-action">
                  Sign in
                </Link>
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-6 lg:p-7">
            <h1 className="text-center text-4xl font-semibold text-theme-blue-dark lg:hidden">Sign Up</h1>
            <p className="mt-1 text-center text-sm text-theme-gray lg:hidden">Sign up to create a new account</p>

            <form className="mt-2 space-y-3 lg:mt-1">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input className={fieldClass} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input className={fieldClass} placeholder="Enter last name" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" className={fieldClass} placeholder="Enter your email" />
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input className={fieldClass} placeholder="+94 Mobile number" />
                  <p className="mt-1 text-[11px] text-theme-red-action">Please enter a valid mobile number</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Language *</label>
                  <select className={fieldClass}>
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Address *</label>
                  <input className={fieldClass} placeholder="Enter address" />
                </div>
                <div>
                  <label className={labelClass}>Street *</label>
                  <input className={fieldClass} placeholder="Enter street" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>City/Town *</label>
                  <input className={fieldClass} placeholder="Enter city" />
                </div>
                <div>
                  <label className={labelClass}>Zip Code *</label>
                  <input className={fieldClass} placeholder="Enter zip code" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Country *</label>
                <select className={fieldClass}>
                  <option>Sri Lanka</option>
                  <option>India</option>
                  <option>Singapore</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Password *</label>
                  <input type="password" className={fieldClass} placeholder="Enter password" />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <input type="password" className={fieldClass} placeholder="Re-enter password" />
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-theme-gray sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-theme-gray-border text-theme-green-action" />
                  I accept <span className="text-theme-green-action">Terms and Conditions</span>
                </label>
                <p>
                  <span className="text-theme-green-action">Privacy Policy</span> |{" "}
                  <span className="text-theme-green-action">Cookie Policy</span>
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 rounded-md border border-theme-gray-border bg-theme-gray-white px-3 py-2 text-xs text-theme-black">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-theme-green-action text-white">✓</span>
                  <span>Success!</span>
                  <span className="ml-6 text-[10px] uppercase tracking-wide text-theme-gray">Cloudflare Turnstile</span>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-theme-green-action px-10 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(13,159,27,0.35)] transition hover:brightness-110"
                >
                  Sign up
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </UserAuthLayout>
  );
}
