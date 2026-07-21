"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import {
  COUNTRIES,
  isOldEnough,
  isValidEmail,
  isValidPhone,
  lettersOnly,
} from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50";

export default function RegisterPage() {
  const router = useRouter();

  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [countryQuery]);

  function handleSignUp(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const first = form.firstName.value.trim();
    const last = form.lastName.value.trim();
    const email = form.email.value.trim();
    const dob = form.dob.value;
    const next = {};

    if (!lettersOnly(first)) next.firstName = "First name: only letters are allowed.";
    if (!lettersOnly(last)) next.lastName = "Last name: only letters are allowed.";
    if (!isValidEmail(email)) next.email = "Enter a valid email with @ and a domain.";
    if (email.toLowerCase() === "taken@email.com") next.email = "This email is already registered.";
    if (!isValidPhone(phone)) next.phone = "Phone must be digits only within the accepted length.";
    if (!isOldEnough(dob, 10)) next.dob = "Users below 10 years are not allowed.";
    if (!country) next.country = "Select a country from the list.";

    setErrors(next);
    if (Object.keys(next).length) return;

    const name = [first, last].filter(Boolean).join(" ");
    localStorage.setItem(
      "itrustld_user",
      JSON.stringify({ name, email, phone: `${country.code}${phone}`, country: country.name })
    );
    router.push("/dashboard");
  }

  return (
    <UserAuthLayout>
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
        <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-theme-green-action/15 blur-2xl" />
          <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/20 blur-2xl" />
          <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/15 blur-3xl" />
          <div className="relative flex h-full w-full flex-col justify-between p-10 text-white lg:p-14">
            <div>
              <Link href="/" className="inline-block">
                <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
              </Link>
              <p className="mt-8 text-xs uppercase tracking-[0.22em] text-white/65">Get started</p>
              <h1 className="mt-3 text-4xl font-semibold">Sign Up</h1>
              <p className="mt-2 text-sm text-white/55">KYC onboarding with personal & residential details</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-medium">Registration rules</p>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>- Searchable country + auto phone code</li>
                <li>- Names: letters only · Email unique format</li>
                <li>- Age must be 10 years or above</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.04] p-4">
              <p className="text-sm text-white/80">Already registered?</p>
              <Link href="/login" className="mt-1 inline-block text-lg font-semibold text-theme-green-action">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <Link href="/" className="inline-block w-fit lg:hidden">
            <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
          </Link>
          <h1 className="mt-7 text-3xl font-semibold text-white lg:mt-0">Lets get you Started!</h1>
          <p className="mt-2 text-sm text-white/55">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-theme-green-action hover:underline">
              Sign in
            </Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSignUp} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" className={fieldClass} placeholder="Enter first name" defaultValue="Avishka" />
                {errors.firstName ? <p className="mt-1 text-xs text-theme-red-action">{errors.firstName}</p> : null}
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input name="lastName" className={fieldClass} placeholder="Enter last name" defaultValue="Perera" />
                {errors.lastName ? <p className="mt-1 text-xs text-theme-red-action">{errors.lastName}</p> : null}
              </div>
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                name="email"
                type="email"
                className={fieldClass}
                placeholder="Enter your email"
                defaultValue="avishka@email.com"
              />
              {errors.email ? <p className="mt-1 text-xs text-theme-red-action">{errors.email}</p> : null}
            </div>

            <div className="relative">
              <label className={labelClass}>Country *</label>
              <input
                className={fieldClass}
                placeholder="Search country name or code"
                value={countryOpen ? countryQuery : `${country.name} (${country.code})`}
                onFocus={() => {
                  setCountryOpen(true);
                  setCountryQuery("");
                }}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setCountryOpen(true);
                }}
              />
              {countryOpen ? (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/15 bg-[#141A2E] shadow-lg">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.iso}
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                      onClick={() => {
                        setCountry(c);
                        setCountryOpen(false);
                        setCountryQuery("");
                      }}
                    >
                      <span>{c.name}</span>
                      <span className="text-white/45">{c.code}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-white/45">No countries found</p>
                  ) : null}
                </div>
              ) : null}
              {errors.country ? <p className="mt-1 text-xs text-theme-red-action">{errors.country}</p> : null}
            </div>

            <div>
              <label className={labelClass}>Mobile Number *</label>
              <div className="flex gap-2">
                <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-2 text-sm font-medium text-white">
                  {country.code}
                </span>
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              {errors.phone ? (
                <p className="mt-1 text-xs text-theme-red-action">{errors.phone}</p>
              ) : (
                <p className="mt-1 text-xs text-white/40">Digits only after country code</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date of Birth *</label>
                <input name="dob" type="date" className={`${fieldClass} [color-scheme:dark]`} defaultValue="2000-01-15" />
                {errors.dob ? <p className="mt-1 text-xs text-theme-red-action">{errors.dob}</p> : null}
              </div>
              <div>
                <label className={labelClass}>Language *</label>
                <select className={`${fieldClass} [color-scheme:dark]`} defaultValue="English">
                  <option className="bg-[#0B1020]">English</option>
                  <option className="bg-[#0B1020]">Sinhala</option>
                  <option className="bg-[#0B1020]">Tamil</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Address *</label>
                <input className={fieldClass} placeholder="Enter address" defaultValue="12 Flower Road" />
              </div>
              <div>
                <label className={labelClass}>Street *</label>
                <input className={fieldClass} placeholder="Enter street" defaultValue="Colombo 07" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>City/Town *</label>
                <input className={fieldClass} placeholder="Enter city" defaultValue="Colombo" />
              </div>
              <div>
                <label className={labelClass}>Zip Code *</label>
                <input className={fieldClass} placeholder="Enter zip code" defaultValue="00700" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Password *</label>
                <input type="password" className={fieldClass} placeholder="Enter password" defaultValue="password" />
              </div>
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <input type="password" className={fieldClass} placeholder="Re-enter password" defaultValue="password" />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 pt-1 text-xs text-white/55">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/30 bg-transparent text-theme-green-action"
                defaultChecked
              />
              I accept Terms and Conditions
            </label>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_22px_rgba(13,159,27,0.35)] transition hover:brightness-110"
            >
              Sign Up
            </button>
          </form>
        </section>
      </div>
    </UserAuthLayout>
  );
}
