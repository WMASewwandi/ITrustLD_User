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
  isStrongPassword,
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

function fieldCls(hasError) {
  return `${fieldClass} ${hasError ? fieldErrorClass : ""}`;
}

function getFieldError(name, value, ctx = {}) {
  switch (name) {
    case "firstName":
      return lettersOnly(value) ? "" : "First name: only letters are allowed.";
    case "lastName":
      return lettersOnly(value) ? "" : "Last name: only letters are allowed.";
    case "email":
      return isValidEmail(String(value || "").trim()) ? "" : "Enter a valid email with @ and a domain.";
    case "phone": {
      if (isValidPhoneForCountry(value, ctx.countryIso)) return "";
      const { min, max } = getNationalPhoneRules(ctx.countryIso);
      return min === max
        ? `Enter ${min} digits for ${ctx.countryName} (e.g. ${getNationalPhoneExample(ctx.countryIso)}).`
        : `Enter ${min}–${max} digits for ${ctx.countryName}.`;
    }
    case "dob":
      if (!isValidCalendarDate(value)) return "Date must be valid.";
      if (!isOldEnough(value, 10)) return "Users below 10 years are not allowed.";
      return "";
    case "password":
      return isStrongPassword(value)
        ? ""
        : "Password must be 8+ chars with upper, lower, number, and symbol.";
    case "passwordConfirmation":
      return value === ctx.password ? "" : "Passwords do not match.";
    case "addressNumber":
      return String(value || "").trim() ? "" : "Address is required.";
    case "street":
      return String(value || "").trim() ? "" : "Street is required.";
    case "city":
      return String(value || "").trim() ? "" : "City/Town is required.";
    case "zipCode":
      return String(value || "").trim() ? "" : "Zip code is required.";
    case "terms":
      return value ? "" : "You must accept the Terms and Conditions.";
    default:
      return "";
  }
}

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
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    language: "English",
    addressNumber: "",
    street: "",
    city: "",
    zipCode: "",
    password: "",
    passwordConfirmation: "",
    terms: false,
  });
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

  function patchError(name, message, current) {
    const next = { ...current };
    if (message) next[name] = message;
    else delete next[name];
    return next;
  }

  function liveValidate(name, value, extras = {}) {
    const countryIso = extras.countryIso ?? country.iso;
    const countryName = extras.countryName ?? country.name;
    const password = extras.password ?? form.password;
    const confirmation = extras.passwordConfirmation ?? form.passwordConfirmation;
    const empty = name === "terms" ? !value : String(value || "").trim() === "";

    setErrors((prev) => {
      if (empty) {
        let next = patchError(name, "", prev);
        if (name === "password" && String(confirmation || "").trim() === "") {
          next = patchError("passwordConfirmation", "", next);
        }
        return next;
      }

      let next = patchError(
        name,
        getFieldError(name, value, { countryIso, countryName, password }),
        prev,
      );
      if (name === "password" && String(confirmation || "").trim()) {
        next = patchError(
          "passwordConfirmation",
          getFieldError("passwordConfirmation", confirmation, { password: value }),
          next,
        );
      }
      return next;
    });
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    liveValidate(name, value, name === "password" ? { password: value } : {});
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const first = form.firstName.trim();
    const last = form.lastName.trim();
    const email = form.email.trim();
    const dob = form.dob;
    const password = form.password;
    const passwordConfirmation = form.passwordConfirmation;
    const language = form.language;
    const addressNumber = form.addressNumber.trim();
    const street = form.street.trim();
    const city = form.city.trim();
    const zipCode = form.zipCode.trim();
    const ctx = { countryIso: country.iso, countryName: country.name, password };
    const next = {};

    const assign = (name, value) => {
      const message = getFieldError(name, value, ctx);
      if (message) next[name] = message;
    };

    assign("firstName", first);
    assign("lastName", last);
    assign("email", email);
    assign("phone", phone);
    assign("dob", dob);
    assign("password", password);
    assign("passwordConfirmation", passwordConfirmation);
    assign("addressNumber", addressNumber);
    assign("street", street);
    assign("city", city);
    assign("zipCode", zipCode);
    assign("terms", form.terms);
    if (!country) next.country = "Select a country from the list.";
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
                  <input
                    name="firstName"
                    className={fieldCls(errors.firstName)}
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    aria-invalid={Boolean(errors.firstName)}
                    required
                  />
                  {errors.firstName ? <p className="mt-1 text-xs text-theme-red-action">{errors.firstName}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    name="lastName"
                    className={fieldCls(errors.lastName)}
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    aria-invalid={Boolean(errors.lastName)}
                    required
                  />
                  {errors.lastName ? <p className="mt-1 text-xs text-theme-red-action">{errors.lastName}</p> : null}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  name="email"
                  type="email"
                  className={fieldCls(errors.email)}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
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
                          const nextPhone = normalizeNationalPhoneDigits(phone, c.iso);
                          setPhone(nextPhone);
                          if (phone) {
                            liveValidate("phone", nextPhone, {
                              countryIso: c.iso,
                              countryName: c.name,
                            });
                          }
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
                    className={fieldCls(errors.phone)}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={getNationalPhoneExample(country.iso)}
                    value={formatNationalPhone(phone, country.iso)}
                    onChange={(e) => {
                      const nextPhone = normalizeNationalPhoneDigits(e.target.value, country.iso);
                      setPhone(nextPhone);
                      liveValidate("phone", nextPhone);
                    }}
                    aria-invalid={Boolean(errors.phone)}
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
                    className={fieldCls(errors.dob)}
                    value={form.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    aria-invalid={Boolean(errors.dob)}
                    required
                  />
                  {errors.dob ? <p className="mt-1 text-xs text-theme-red-action">{errors.dob}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Language *</label>
                  <select
                    name="language"
                    className={fieldClass}
                    value={form.language}
                    onChange={(e) => updateField("language", e.target.value)}
                  >
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Address *</label>
                  <input
                    name="addressNumber"
                    className={fieldCls(errors.addressNumber)}
                    placeholder="Enter address"
                    value={form.addressNumber}
                    onChange={(e) => updateField("addressNumber", e.target.value)}
                    aria-invalid={Boolean(errors.addressNumber)}
                    required
                  />
                  {errors.addressNumber ? (
                    <p className="mt-1 text-xs text-theme-red-action">{errors.addressNumber}</p>
                  ) : null}
                </div>
                <div>
                  <label className={labelClass}>Street *</label>
                  <input
                    name="street"
                    className={fieldCls(errors.street)}
                    placeholder="Enter street"
                    value={form.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    aria-invalid={Boolean(errors.street)}
                    required
                  />
                  {errors.street ? <p className="mt-1 text-xs text-theme-red-action">{errors.street}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>City/Town *</label>
                  <input
                    name="city"
                    className={fieldCls(errors.city)}
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    aria-invalid={Boolean(errors.city)}
                    required
                  />
                  {errors.city ? <p className="mt-1 text-xs text-theme-red-action">{errors.city}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Zip Code *</label>
                  <input
                    name="zipCode"
                    className={fieldCls(errors.zipCode)}
                    placeholder="Enter zip code"
                    value={form.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    aria-invalid={Boolean(errors.zipCode)}
                    required
                  />
                  {errors.zipCode ? <p className="mt-1 text-xs text-theme-red-action">{errors.zipCode}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Password *</label>
                  <PasswordInput
                    name="password"
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className={fieldCls(errors.password)}
                    toggleClassName="text-white/40 hover:text-white/70 lg:text-theme-gray lg:hover:text-theme-blue-dark"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
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
                    className={fieldCls(errors.passwordConfirmation)}
                    toggleClassName="text-white/40 hover:text-white/70 lg:text-theme-gray lg:hover:text-theme-blue-dark"
                    value={form.passwordConfirmation}
                    onChange={(e) => updateField("passwordConfirmation", e.target.value)}
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
                  checked={form.terms}
                  onChange={(e) => updateField("terms", e.target.checked)}
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
                  onToken={setTurnstileToken}
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
