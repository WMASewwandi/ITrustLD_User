"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/page-header";
import BottomMessage from "@/components/dashboard/bottom-message";
import {
  ALL_COUNTRIES,
  buildInternationalNumber,
  findCountryByName,
  isValidEmail,
  isValidInternationalPhone,
  parseProfileMobileNumber,
  fetchUserProfile,
  updateUserProfile,
} from "@/lib/profile";
import {
  checkEmailAvailable,
  checkMobileAvailable,
  hasUserSession,
  updateUserSession,
} from "@/lib/auth";
import { isOldEnough, lettersOnly } from "@/lib/validation";
import { ArrowRight, Building2, Loader2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const fieldErrorClass =
  "border-theme-red-action/70 ring-1 ring-theme-red-action/25 focus:border-theme-red-action";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const LANGUAGE_OPTIONS = ["English", "Sinhala", "Tamil"];

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
      return isValidEmail(String(value || "").trim()) ? "" : "Please enter a valid email address.";
    case "phone":
      return isValidInternationalPhone(ctx.phoneCountry, value) ? "" : "Please enter a valid mobile number.";
    case "dateOfBirth":
      if (!value) return "Birthday is required.";
      if (!isOldEnough(value, 10)) return "Users below 10 years are not allowed.";
      return "";
    case "language":
      return value ? "" : "Preferred language is required.";
    case "residentialAddress":
      return String(value || "").trim() ? "" : "Residential address is required.";
    case "city":
      return String(value || "").trim() ? "" : "City / town is required.";
    case "zipCode":
      return String(value || "").trim() ? "" : "Zip code is required.";
    case "country":
      return ctx.countryName ? "" : "Select a country from the list.";
    default:
      return "";
  }
}

function formatResidentialAddress(holder) {
  if (!holder) return "";
  const parts = [holder.address_number, holder.street].filter(Boolean);
  return parts.join(", ");
}

function splitResidentialAddress(value) {
  const text = String(value || "").trim();
  if (!text) return { address_number: "", street: "" };
  const commaIndex = text.indexOf(",");
  if (commaIndex === -1) {
    return { address_number: text, street: text };
  }
  return {
    address_number: text.slice(0, commaIndex).trim(),
    street: text.slice(commaIndex + 1).trim() || text.slice(0, commaIndex).trim(),
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [needsReverification, setNeedsReverification] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalMobile, setOriginalMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(ALL_COUNTRIES[0]);
  const [addressCountry, setAddressCountry] = useState(ALL_COUNTRIES[0]);
  const [residentialAddress, setResidentialAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [language, setLanguage] = useState("English");
  const [paymentAccountsCount, setPaymentAccountsCount] = useState(0);

  const mobileNumber = useMemo(
    () => buildInternationalNumber(phoneCountry, phone),
    [phoneCountry, phone],
  );

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setPageError("");
      try {
        const data = await fetchUserProfile();
        if (cancelled) return;

        const holder = data.account_holder || {};
        setFirstName(holder.first_name || "");
        setLastName(holder.last_name || "");
        setEmail(holder.email || data.user?.email || "");
        setOriginalEmail(holder.email || data.user?.email || "");
        setResidentialAddress(formatResidentialAddress(holder));
        setCity(holder.city || "");
        setZipCode(holder.zip_code || "");
        setDateOfBirth(holder.date_of_birth || "");
        setLanguage(holder.language || "English");
        setPaymentAccountsCount(Number(data.payment_accounts_count) || 0);

        const selectedAddressCountry = findCountryByName(ALL_COUNTRIES, holder.country);
        setAddressCountry(selectedAddressCountry);

        const parsedPhone = parseProfileMobileNumber(holder.mobile_number, ALL_COUNTRIES);
        setPhone(parsedPhone.phone);
        if (parsedPhone.country) setPhoneCountry(parsedPhone.country);
        setOriginalMobile(holder.mobile_number || "");
      } catch (err) {
        if (!cancelled) setPageError(err.message || "Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function patchError(name, message, current) {
    const next = { ...current };
    if (message) next[name] = message;
    else delete next[name];
    return next;
  }

  function liveValidate(name, value, extras = {}) {
    const empty = String(value || "").trim() === "";
    setErrors((prev) => {
      if (empty) return patchError(name, "", prev);
      return patchError(
        name,
        getFieldError(name, value, {
          phoneCountry: extras.phoneCountry ?? phoneCountry,
          countryName: extras.countryName ?? addressCountry?.name,
        }),
        prev,
      );
    });
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    const ctx = { phoneCountry, countryName: addressCountry?.name };
    const nextErrors = {};
    const assign = (name, value) => {
      const message = getFieldError(name, value, ctx);
      if (message) nextErrors[name] = message;
    };

    assign("firstName", firstName);
    assign("lastName", lastName);
    assign("email", email);
    assign("phone", phone);
    assign("dateOfBirth", dateOfBirth);
    assign("language", language);
    assign("residentialAddress", residentialAddress);
    assign("city", city);
    assign("zipCode", zipCode);
    assign("country", addressCountry?.name);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setFormError("");
    setSaving(true);
    setNeedsReverification(false);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== originalEmail.trim().toLowerCase()) {
        const emailCheck = await checkEmailAvailable(normalizedEmail);
        if (emailCheck.exists) {
          setErrors({ email: "Email already registered." });
          return;
        }
      }

      if (mobileNumber !== originalMobile) {
        const mobileCheck = await checkMobileAvailable(mobileNumber);
        if (mobileCheck.exists) {
          setErrors({ phone: "Mobile number already registered." });
          return;
        }
      }

      const address = splitResidentialAddress(residentialAddress);
      const result = await updateUserProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        mobile_number: mobileNumber,
        date_of_birth: dateOfBirth,
        language,
        address_number: address.address_number,
        street: address.street,
        city: city.trim(),
        country: addressCountry.name,
        zip_code: zipCode.trim(),
      });

      if (result.user) {
        updateUserSession(result.user);
      }

      const emailChanged = normalizedEmail !== originalEmail.trim().toLowerCase();
      const mobileChanged = mobileNumber !== originalMobile;
      setNeedsReverification(emailChanged || mobileChanged);
      setOriginalEmail(normalizedEmail);
      setOriginalMobile(mobileNumber);
      setSaved(true);
    } catch (err) {
      setFormError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Update phone number and residential address. Save bank accounts to select during top-up, cash-out, and loyalty cash redemption."
      />

      {loading ? (
        <div className="mb-6 flex items-center justify-center py-12 text-white/50">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading profile…
        </div>
      ) : null}

      {pageError ? (
        <div className="mb-6 rounded-xl border border-theme-red-action/30 bg-theme-red-action/10 px-4 py-3 text-sm text-theme-red-action">
          {pageError}
        </div>
      ) : null}

      {formError ? (
        <div className="mb-6 rounded-xl border border-theme-red-action/30 bg-theme-red-action/10 px-4 py-3 text-sm text-theme-red-action">
          {formError}
        </div>
      ) : null}

      {!loading && !pageError ? (
        <form
          onSubmit={handleSaveProfile}
          className="mb-10 space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          noValidate
        >
          <h2 className="text-lg font-semibold text-white">Personal & residential details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name *</label>
              <input
                className={fieldCls(errors.firstName)}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  liveValidate("firstName", e.target.value);
                }}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName ? <p className="mt-1 text-xs text-theme-red-action">{errors.firstName}</p> : null}
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input
                className={fieldCls(errors.lastName)}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  liveValidate("lastName", e.target.value);
                }}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName ? <p className="mt-1 text-xs text-theme-red-action">{errors.lastName}</p> : null}
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                className={fieldCls(errors.email)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  liveValidate("email", e.target.value);
                }}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="mt-1 text-xs text-theme-red-action">{errors.email}</p> : null}
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="flex gap-2">
                <select
                  className={`${fieldClass} max-w-[132px] shrink-0`}
                  value={phoneCountry?.iso || ""}
                  onChange={(e) => {
                    const next = ALL_COUNTRIES.find((item) => item.iso === e.target.value);
                    if (next) {
                      setPhoneCountry(next);
                      if (phone) liveValidate("phone", phone, { phoneCountry: next });
                    }
                  }}
                  aria-label="Phone country code"
                >
                  {ALL_COUNTRIES.map((item) => (
                    <option key={item.iso} value={item.iso} className="bg-[#141A2E]">
                      {item.code}
                    </option>
                  ))}
                </select>
                <input
                  className={fieldCls(errors.phone)}
                  value={phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.startsWith("0")) value = value.slice(1);
                    setPhone(value);
                    liveValidate("phone", value);
                  }}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.phone)}
                />
              </div>
              {errors.phone ? <p className="mt-1 text-xs text-theme-red-action">{errors.phone}</p> : null}
            </div>
            <div>
              <label className={labelClass}>Birthday *</label>
              <input
                type="date"
                className={fieldCls(errors.dateOfBirth)}
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                  liveValidate("dateOfBirth", e.target.value);
                }}
                aria-invalid={Boolean(errors.dateOfBirth)}
              />
              {errors.dateOfBirth ? (
                <p className="mt-1 text-xs text-theme-red-action">{errors.dateOfBirth}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass}>Preferred Language *</label>
              <select
                className={fieldCls(errors.language)}
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  liveValidate("language", e.target.value);
                }}
                aria-invalid={Boolean(errors.language)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#141A2E]">
                    {option}
                  </option>
                ))}
              </select>
              {errors.language ? <p className="mt-1 text-xs text-theme-red-action">{errors.language}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Residential Address *</label>
              <input
                className={fieldCls(errors.residentialAddress)}
                value={residentialAddress}
                onChange={(e) => {
                  setResidentialAddress(e.target.value);
                  liveValidate("residentialAddress", e.target.value);
                }}
                aria-invalid={Boolean(errors.residentialAddress)}
              />
              {errors.residentialAddress ? (
                <p className="mt-1 text-xs text-theme-red-action">{errors.residentialAddress}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass}>City / Town *</label>
              <input
                className={fieldCls(errors.city)}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  liveValidate("city", e.target.value);
                }}
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city ? <p className="mt-1 text-xs text-theme-red-action">{errors.city}</p> : null}
            </div>
            <div>
              <label className={labelClass}>Zip Code *</label>
              <input
                className={fieldCls(errors.zipCode)}
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                  liveValidate("zipCode", e.target.value);
                }}
                aria-invalid={Boolean(errors.zipCode)}
              />
              {errors.zipCode ? <p className="mt-1 text-xs text-theme-red-action">{errors.zipCode}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Country *</label>
              <select
                className={fieldCls(errors.country)}
                value={addressCountry?.name || ""}
                onChange={(e) => {
                  const next = ALL_COUNTRIES.find((item) => item.name === e.target.value);
                  if (next) {
                    setAddressCountry(next);
                    liveValidate("country", next.name, { countryName: next.name });
                  }
                }}
                aria-invalid={Boolean(errors.country)}
              >
                {ALL_COUNTRIES.map((item) => (
                  <option key={item.iso} value={item.name} className="bg-[#141A2E]">
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.country ? <p className="mt-1 text-xs text-theme-red-action">{errors.country}</p> : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            <Link
              href="/dashboard/profile/delete"
              className="rounded-xl border border-theme-red-action/40 px-6 py-2.5 text-sm font-semibold text-theme-red-action transition hover:bg-theme-red-action/10"
            >
              Delete account
            </Link>
            {saved ? (
              <BottomMessage
                title="Profile saved"
                variant="success"
                onClose={() => setSaved(false)}
                primaryAction={{ label: "OK", onClick: () => setSaved(false) }}
                secondaryAction={{ label: "Close", onClick: () => setSaved(false) }}
              >
                Profile saved successfully.
              </BottomMessage>
            ) : null}
          </div>
          {saved ? (
            <div className="space-y-2 text-sm text-white/55">
              <p>Your profile updates will be reviewed and it will take up to 24 hours to be approved.</p>
              {needsReverification ? (
                <p>
                  Email or phone was changed, so verification was reset. Please{" "}
                  <Link href="/verify" className="font-medium text-theme-green-action hover:underline">
                    complete verification again
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          ) : null}
        </form>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Payment accounts</h2>
            <p className="mt-1 max-w-xl text-sm text-white/45">
              Save bank, e-wallet, XM, and other receiving accounts. These are used when you cash out,
              redeem loyalty points, or choose where payouts are sent.
            </p>
            {paymentAccountsCount > 0 ? (
              <p className="mt-2 text-sm text-white/60">
                {paymentAccountsCount} saved account{paymentAccountsCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <Link
            href="/dashboard/profile/accounts"
            className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Manage accounts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-theme-green-action">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-white">Receiving accounts</p>
            <p className="mt-1 text-sm text-white/50">
              Add XM, Skrill, Neteller, Perfect Money, bank transfer, or crypto accounts from the
              accounts page. You can also add an account during cash-out if you do not have one saved
              yet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
