"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogoImage } from "@/components/brand-logo";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import TurnstileWidget from "@/components/auth/turnstile-widget";
import PasswordInput from "@/components/ui/password-input";
import { checkEmailAvailable, checkMobileAvailable, fetchAuthConfig, registerUser, setUserSession } from "@/lib/auth";
import {
  COUNTRIES,
  formatNationalPhone,
  getNationalPhoneExample,
  getNationalPhoneRules,
  isOldEnough,
  isValidCalendarDate,
  isValidEmail,
  isValidPhoneForCountry,
  lettersOnly,
  normalizeNationalPhoneDigits,
} from "@/lib/validation";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45 lg:text-theme-gray";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-theme-green-action/50 lg:rounded-lg lg:border-[#CDD5E0] lg:bg-[#F7F9FC] lg:text-theme-black lg:placeholder:text-theme-gray/70 lg:focus:border-theme-blue-dark lg:focus:bg-white";
const fieldErrorClass =
  "border-theme-red-action/70 ring-1 ring-theme-red-action/25 focus:border-theme-red-action lg:border-red-400 lg:focus:border-red-500";
const errorBoxClass =
  "rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 lg:rounded-lg lg:border-red-200 lg:bg-red-50 lg:text-red-700";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-[#0B1020] text-white/50">Loading…</div>}>
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
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileRequired, setTurnstileRequired] = useState(true);
  const countryFieldRef = useRef(null);
  const countryListRef = useRef(null);

  useEffect(() => {
    fetchAuthConfig()
      .then((config) => {
        setTurnstileRequired(Boolean(config?.turnstileRequired));
      })
      .catch(() => {
        setTurnstileRequired(true);
      });
  }, []);

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

  useEffect(() => {
    if (!countryOpen) return;

    function closeIfOutside(event) {
      if (countryFieldRef.current && !countryFieldRef.current.contains(event.target)) {
        setCountryOpen(false);
        setCountryQuery("");
      }
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setCountryOpen(false);
        setCountryQuery("");
      }
    }

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("touchstart", closeIfOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("touchstart", closeIfOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [countryOpen]);

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
    if (!isValidPhoneForCountry(phone, country.iso)) {
      const { min, max } = getNationalPhoneRules(country.iso);
      next.phone =
        min === max
          ? `Enter ${min} digits for ${country.name} (e.g. ${getNationalPhoneExample(country.iso)}).`
          : `Enter ${min}–${max} digits for ${country.name}.`;
    }
    if (!isValidCalendarDate(dob)) {
      next.dob = "Date must be valid.";
    } else if (!isOldEnough(dob, 10)) {
      next.dob = "Users below 10 years are not allowed.";
    }
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
    if (turnstileRequired && !turnstileToken) {
      next.turnstile = "Please complete the security check.";
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

      const nationalDigits = normalizeNationalPhoneDigits(phone, country.iso);
      const mobile = `${country.code}${nationalDigits}`;
      const mobileCheck = await checkMobileAvailable(mobile);
      if (mobileCheck.exists) {
        setErrors({ phone: "This mobile number is already registered." });
        return;
      }

      const result = await registerUser({
        first_name: first,
        last_name: last,
        email,
        password,
        password_confirmation: passwordConfirmation,
        language,
        mobile_number: mobile,
        date_of_birth: dob,
        address_number: addressNumber,
        street,
        city,
        country: country.name,
        zip_code: zipCode,
        is_affiliated: Boolean(affiliateCode),
        affiliate_code: affiliateCode || undefined,
        cf_turnstile_response: turnstileToken || undefined,
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
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
          <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 lg:flex">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-theme-green-action/15 blur-2xl" />
            <div className="absolute right-4 top-8 h-28 w-28 rounded-full bg-theme-green-shaded/20 blur-2xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-theme-green-action/15 blur-3xl" />
            <div className="relative flex h-full w-full flex-col justify-between p-10 text-white lg:p-14">
              <div>
                <Link href="/" className="inline-block w-fit">
                  <BrandLogoImage alt="iTrustLD" className="h-10 w-auto" />
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

          <section className="flex flex-col justify-center px-5 py-8 text-white sm:px-8 lg:bg-white lg:px-12 lg:text-theme-black">
            <Link href="/" className="inline-block w-fit lg:hidden">
              <BrandLogoImage alt="iTrustLD" className="h-10 w-auto" />
            </Link>
            <h1 className="mt-7 text-3xl font-semibold lg:mt-0 lg:text-theme-blue-dark">Lets get you Started!</h1>
            <p className="mt-2 text-sm text-white/55 lg:text-theme-gray">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-theme-green-action hover:underline">
                Sign in
              </Link>
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSignUp} noValidate>
              {formError ? (
                <p className={errorBoxClass} role="alert">
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

              <div className="relative z-30" ref={countryFieldRef}>
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
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setCountryOpen(false);
                      setCountryQuery("");
                      e.currentTarget.blur();
                    }
                  }}
                  autoComplete="off"
                  aria-expanded={countryOpen}
                  aria-controls="country-search-list"
                  role="combobox"
                />
                {countryOpen ? (
                  <div
                    id="country-search-list"
                    ref={countryListRef}
                    role="listbox"
                    className="absolute left-0 right-0 z-40 mt-1 max-h-48 w-full overflow-y-auto overscroll-contain rounded-lg border border-white/20 bg-[#12182b] shadow-lg touch-pan-y lg:border-[#CDD5E0] lg:bg-white"
                    onWheel={(e) => {
                      const el = countryListRef.current;
                      if (!el) return;
                      const atTop = el.scrollTop <= 0 && e.deltaY < 0;
                      const atBottom =
                        el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
                      if (!atTop && !atBottom) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {filteredCountries.map((c) => (
                      <button
                        key={c.iso}
                        type="button"
                        role="option"
                        aria-selected={country.iso === c.iso}
                        className="flex w-full shrink-0 items-center justify-between px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10 lg:text-theme-black lg:hover:bg-[#F7F9FC]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                          setCountryQuery("");
                          setPhone((prev) => normalizeNationalPhoneDigits(prev, c.iso));
                        }}
                      >
                        <span>{c.name}</span>
                        <span className="text-white/55 lg:text-theme-gray">{c.code}</span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-white/55 lg:text-theme-gray">No countries found</p>
                    ) : null}
                  </div>
                ) : null}
                {errors.country ? <p className="mt-1 text-xs text-theme-red-action">{errors.country}</p> : null}
              </div>

              <div>
                <label className={labelClass}>Mobile Number *</label>
                <div className="flex gap-2">
                  <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-2 text-sm font-medium text-white lg:rounded-lg lg:border-[#CDD5E0] lg:bg-[#EEF2F7] lg:text-theme-blue-dark">
                    {country.code}
                  </span>
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={getNationalPhoneExample(country.iso)}
                    value={formatNationalPhone(phone, country.iso)}
                    onChange={(e) =>
                      setPhone(normalizeNationalPhoneDigits(e.target.value, country.iso))
                    }
                    required
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-xs text-theme-red-action">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-xs text-white/45 lg:text-theme-gray">
                    Digits only; formatted for {country.name} (e.g. {getNationalPhoneExample(country.iso)})
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input
                    name="dob"
                    type="date"
                    className={`${fieldClass} ${errors.dob ? fieldErrorClass : ""}`}
                    aria-invalid={Boolean(errors.dob)}
                    required
                  />
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
                  <PasswordInput
                    name="password"
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className={fieldClass}
                    toggleClassName="text-white/40 hover:text-white/70 lg:text-theme-gray lg:hover:text-theme-blue-dark"
                    required
                  />
                  {errors.password ? <p className="mt-1 text-xs text-theme-red-action">{errors.password}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <PasswordInput
                    name="passwordConfirmation"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={fieldClass}
                    toggleClassName="text-white/40 hover:text-white/70 lg:text-theme-gray lg:hover:text-theme-blue-dark"
                    required
                  />
                  {errors.passwordConfirmation ? (
                    <p className="mt-1 text-xs text-theme-red-action">{errors.passwordConfirmation}</p>
                  ) : null}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 pt-1 text-xs text-white/55 lg:text-theme-gray">
                <input
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-transparent text-theme-green-action lg:border-theme-gray-border"
                  required
                />
                I accept{" "}
                <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="text-theme-green-action hover:underline">
                  Terms and Conditions
                </a>
              </label>
              {errors.terms ? <p className="text-xs text-theme-red-action">{errors.terms}</p> : null}

              <p className="text-xs text-white/45 lg:text-theme-gray">
                <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-theme-green-action hover:underline">
                  Privacy Policy
                </a>
                {" | "}
                <a href="/cookie-policy" target="_blank" rel="noreferrer" className="text-theme-green-action hover:underline">
                  Cookie Policy
                </a>
              </p>

              {turnstileRequired ? (
                <TurnstileWidget
                  onToken={(token) => {
                    setTurnstileToken(token);
                  }}
                  onExpire={() => setTurnstileToken("")}
                />
              ) : null}
              {errors.turnstile ? <p className="text-xs text-theme-red-action">{errors.turnstile}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-theme-green-action px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account…" : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6 lg:hidden">
              <p className="text-sm text-white/55">Already registered?</p>
              <Link href="/login" className="mt-1 inline-block text-base font-semibold text-theme-green-action">
                Sign in
              </Link>
            </div>
          </section>
      </div>
    </UserAuthLayout>
  );
}
