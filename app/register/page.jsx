"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import { checkEmailAvailable, registerUser, setUserSession } from "@/lib/auth";
import {
  COUNTRIES,
  isOldEnough,
  isValidEmail,
  isValidPhone,
  lettersOnly,
} from "@/lib/validation";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-theme-gray";
const fieldClass =
  "w-full rounded-lg border border-[#CDD5E0] bg-[#F7F9FC] px-3 py-2.5 text-sm text-theme-black outline-none ring-0 transition placeholder:text-theme-gray/70 focus:border-theme-blue-dark focus:bg-white";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-theme-gray">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const affiliateCode = searchParams.get("code") || "";

  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleSignUp(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const first = form.firstName.value.trim();
    const last = form.lastName.value.trim();
    const email = form.email.value.trim();
    const dob = form.dob.value;
    const password = form.password.value;
    const passwordConfirmation = form.passwordConfirmation.value;
    const language = form.language.value;
    const addressNumber = form.addressNumber.value.trim();
    const street = form.street.value.trim();
    const city = form.city.value.trim();
    const zipCode = form.zipCode.value.trim();
    const next = {};

    if (!lettersOnly(first)) next.firstName = "First name: only letters are allowed.";
    if (!lettersOnly(last)) next.lastName = "Last name: only letters are allowed.";
    if (!isValidEmail(email)) next.email = "Enter a valid email with @ and a domain.";
    if (!isValidPhone(phone)) next.phone = "Phone must be digits only within the accepted length.";
    if (!isOldEnough(dob, 10)) next.dob = "Users below 10 years are not allowed.";
    if (!country) next.country = "Select a country from the list.";
    if (!PASSWORD_PATTERN.test(password)) {
      next.password = "Password must be 8+ chars with upper, lower, number, and symbol.";
    }
    if (password !== passwordConfirmation) {
      next.passwordConfirmation = "Passwords do not match.";
    }
    if (!form.terms.checked) {
      next.terms = "You must accept the Terms and Conditions.";
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    setFormError("");
    setLoading(true);

    try {
      const emailCheck = await checkEmailAvailable(email);
      if (emailCheck.exists) {
        setErrors({ email: "This email is already registered." });
        return;
      }

      const result = await registerUser({
        first_name: first,
        last_name: last,
        email,
        password,
        password_confirmation: passwordConfirmation,
        language,
        mobile_number: `${country.code}${phone}`,
        date_of_birth: dob,
        address_number: addressNumber,
        street,
        city,
        country: country.name,
        zip_code: zipCode,
        is_affiliated: Boolean(affiliateCode),
        affiliate_code: affiliateCode || undefined,
      });

      setUserSession({ token: result.token, user: result.user });
      localStorage.removeItem("itrustld_verification");
      router.push(result.redirect_to || "/verify");
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserAuthLayout>
      <div className="flex min-h-screen w-full items-stretch justify-center p-0 sm:p-4 lg:p-6">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden bg-white shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:rounded-3xl lg:grid-cols-2">
          <section className="relative hidden min-h-full overflow-hidden bg-[#0B1020] lg:flex">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-theme-green-action/15 blur-2xl" />
            <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/20 blur-2xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/15 blur-3xl" />
            <div className="relative flex h-full w-full flex-col justify-between p-10 text-white lg:p-14">
              <div>
                <Link href="/" className="inline-block">
                  <img src="/assets/img/logos/apple-touch-icon.png" alt="iTrustLD" className="h-12 w-12 rounded-xl" />
                </Link>
                <p className="mt-8 text-xs uppercase tracking-[0.22em] text-white/65">Get started</p>
                <h1 className="mt-3 text-4xl font-semibold">Sign Up</h1>
                <p className="mt-2 text-sm text-white/55">KYC onboarding with personal & residential details</p>
                {affiliateCode ? (
                  <p className="mt-3 text-xs text-theme-green-action">Referred by partner: {affiliateCode}</p>
                ) : null}
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

          <section className="flex flex-col justify-center bg-white px-5 py-8 text-theme-black sm:px-8 lg:px-12">
            <Link href="/" className="inline-block w-fit lg:hidden">
              <img src="/assets/img/logos/apple-touch-icon.png" alt="iTrustLD" className="h-12 w-12 rounded-xl" />
            </Link>
            <h1 className="mt-7 text-3xl font-semibold text-theme-blue-dark lg:mt-0">Lets get you Started!</h1>
            <p className="mt-2 text-sm text-theme-gray">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-theme-green-action hover:underline">
                Sign in
              </Link>
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSignUp} noValidate>
              {formError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input name="firstName" className={fieldClass} placeholder="Enter first name" required />
                  {errors.firstName ? <p className="mt-1 text-xs text-theme-red-action">{errors.firstName}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input name="lastName" className={fieldClass} placeholder="Enter last name" required />
                  {errors.lastName ? <p className="mt-1 text-xs text-theme-red-action">{errors.lastName}</p> : null}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input name="email" type="email" className={fieldClass} placeholder="Enter your email" required />
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
                  <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-[#CDD5E0] bg-white shadow-lg">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.iso}
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-theme-black transition hover:bg-[#F7F9FC]"
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                          setCountryQuery("");
                        }}
                      >
                        <span>{c.name}</span>
                        <span className="text-theme-gray">{c.code}</span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-theme-gray">No countries found</p>
                    ) : null}
                  </div>
                ) : null}
                {errors.country ? <p className="mt-1 text-xs text-theme-red-action">{errors.country}</p> : null}
              </div>

              <div>
                <label className={labelClass}>Mobile Number *</label>
                <div className="flex gap-2">
                  <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-lg border border-[#CDD5E0] bg-[#EEF2F7] px-2 text-sm font-medium text-theme-blue-dark">
                    {country.code}
                  </span>
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    placeholder="Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-xs text-theme-red-action">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-xs text-theme-gray">Digits only after country code</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input name="dob" type="date" className={fieldClass} required />
                  {errors.dob ? <p className="mt-1 text-xs text-theme-red-action">{errors.dob}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Language *</label>
                  <select name="language" className={fieldClass} defaultValue="English">
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Address *</label>
                  <input name="addressNumber" className={fieldClass} placeholder="Enter address" required />
                </div>
                <div>
                  <label className={labelClass}>Street *</label>
                  <input name="street" className={fieldClass} placeholder="Enter street" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>City/Town *</label>
                  <input name="city" className={fieldClass} placeholder="Enter city" required />
                </div>
                <div>
                  <label className={labelClass}>Zip Code *</label>
                  <input name="zipCode" className={fieldClass} placeholder="Enter zip code" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    name="password"
                    type="password"
                    className={fieldClass}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    required
                  />
                  {errors.password ? <p className="mt-1 text-xs text-theme-red-action">{errors.password}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <input
                    name="passwordConfirmation"
                    type="password"
                    className={fieldClass}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                  {errors.passwordConfirmation ? (
                    <p className="mt-1 text-xs text-theme-red-action">{errors.passwordConfirmation}</p>
                  ) : null}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 pt-1 text-xs text-theme-gray">
                <input
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-theme-gray-border text-theme-green-action"
                  required
                />
                I accept Terms and Conditions
              </label>
              {errors.terms ? <p className="text-xs text-theme-red-action">{errors.terms}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account…" : "Sign Up"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </UserAuthLayout>
  );
}
