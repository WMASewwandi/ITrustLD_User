"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Check, Wallet } from "lucide-react";

const RECENT_TOPUPS = ["100.00", "10.00", "105.00", "121.00", "11.00"];
const CURRENCIES = ["USD", "EUR", "GBP"];

const METHODS = [
  {
    id: "xm",
    label: "XM",
    subtitle: "Local deposit",
    min: 5,
    max: 20000,
    accent: "#E11D48",
    icon: "xm",
  },
  {
    id: "usdt",
    label: "USDT",
    subtitle: "Tether crypto",
    min: 10,
    max: 20000,
    accent: "#26A17B",
    icon: "usdt",
  },
  {
    id: "skrill",
    label: "Skrill",
    subtitle: "E-wallet",
    min: 100,
    max: 20000,
    accent: "#8B2BE2",
    icon: "skrill",
  },
  {
    id: "neteller",
    label: "Neteller",
    subtitle: "E-wallet",
    min: 100,
    max: 20000,
    accent: "#00A651",
    icon: "neteller",
  },
  {
    id: "pm",
    label: "Perfect Money",
    subtitle: "U + 8 digits",
    min: 50,
    max: 20000,
    accent: "#D4AF37",
    icon: "pm",
  },
  {
    id: "binance",
    label: "Binance",
    subtitle: "BTC & crypto",
    min: 10,
    max: 20000,
    accent: "#F0B90B",
    icon: "btc",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    subtitle: "Local banks",
    min: 5,
    max: 20000,
    accent: "#3B82F6",
    icon: "bank",
  },
];

const BANKS = [
  { id: "1", label: "Commercial Bank — 8001234567" },
  { id: "2", label: "Hatton National Bank — 0690123456" },
];

function MethodIcon({ type }) {
  if (type === "usdt") {
    return (
      <div className="coin-glow-usdt relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#26A17B] to-[#1A7A5C]">
        <span className="pointer-events-none absolute inset-[-10px] rounded-full bg-[#26A17B]/30 coin-glow-ring" />
        <span className="relative z-10 text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">₮</span>
      </div>
    );
  }

  if (type === "btc") {
    return (
      <div className="coin-glow-btc relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F7931A] to-[#E27602]">
        <span className="pointer-events-none absolute inset-[-10px] rounded-full bg-[#F7931A]/35 coin-glow-ring" />
        <span className="relative z-10 text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">₿</span>
      </div>
    );
  }

  if (type === "pm") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40">
        <span className="text-lg font-black text-[#F5D76E]">PM</span>
      </div>
    );
  }

  if (type === "xm") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E11D48]/15 ring-1 ring-[#E11D48]/35">
        <span className="text-xl font-black tracking-tight text-[#FB7185]">XM</span>
      </div>
    );
  }

  if (type === "skrill") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B2BE2]/15 ring-1 ring-[#8B2BE2]/35">
        <Wallet className="h-7 w-7 text-[#C084FC]" />
      </div>
    );
  }

  if (type === "neteller") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00A651]/15 ring-1 ring-[#00A651]/35">
        <span className="text-lg font-bold text-[#4ADE80]">N</span>
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B82F6]/15 ring-1 ring-[#3B82F6]/35">
      <Building2 className="h-7 w-7 text-[#60A5FA]" />
    </div>
  );
}

function validate(method, amount, details) {
  const errors = {};
  const amt = String(amount || "").trim();

  if (!/^\d+(\.\d+)?$/.test(amt)) {
    errors.amount = "Only numeric characters are allowed.";
  } else {
    const n = Number(amt);
    if (n < method.min || n > method.max) {
      errors.amount = `Amount must be between USD ${method.min.toLocaleString()} and USD ${method.max.toLocaleString()}.`;
    }
  }

  if (method.id === "xm") {
    const id = details.accountId || "";
    if (id.length < 7 || id.length > 9) errors.accountId = "XM Account ID must be 7–9 characters.";
  }

  if (["skrill", "neteller", "binance", "usdt"].includes(method.id)) {
    const email = details.email || "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\s/.test(email)) {
      errors.email = "Enter a valid email with @ and a domain.";
    }
  }

  if (method.id === "pm") {
    const digits = details.pmId || "";
    if (!/^\d{8}$/.test(digits)) errors.pmId = "Enter the remaining 8 digits after U.";
  }

  if (method.id === "bank" && !details.bank) {
    errors.bank = "Select a saved bank account.";
  }

  return errors;
}

export default function DepositPage() {
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("USD");
  const [methodId, setMethodId] = useState(null);
  const [details, setDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const method = useMemo(() => METHODS.find((m) => m.id === methodId) || null, [methodId]);

  function pickRecent(value) {
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: undefined }));
    setSubmitted(false);
  }

  function selectMethod(id) {
    setMethodId(id);
    setDetails({});
    setErrors({});
    setSubmitted(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!method) return;
    const next = validate(method, amount, details);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitted(true);
  }

  const fieldClass =
    "w-full rounded-xl border border-white/12 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">Funding</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Deposit</h1>
        <p className="mt-2 text-sm text-white/50 sm:text-base">
          Select a top up method and amount from below to proceed.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Amount panel */}
        <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-7">
          <label className="mb-3 block text-sm font-semibold text-white">Topup Amount</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/[^\d.]/g, ""));
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                  setSubmitted(false);
                }}
                className={`${fieldClass} ${errors.amount ? "border-rose-400/50" : ""}`}
                placeholder="Enter amount"
              />
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-xl border border-white/12 bg-[#0B1020]/60 px-4 py-3 text-sm font-medium text-white outline-none sm:min-w-[120px]"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-[#141A2E]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          {errors.amount ? <p className="mt-2 text-xs text-rose-300">{errors.amount}</p> : null}
          {method ? (
            <p className="mt-2 text-xs text-white/40">
              {method.label}: min {currency} {method.min.toLocaleString()} · max {currency}{" "}
              {method.max.toLocaleString()}
            </p>
          ) : null}

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-white">Recent Topups</p>
            <div className="flex flex-wrap gap-2">
              {RECENT_TOPUPS.map((value) => {
                const active = amount === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => pickRecent(value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-theme-green-action text-white shadow-[0_8px_20px_rgba(13,159,27,0.35)]"
                        : "border border-white/12 bg-white/[0.04] text-white/75 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {currency} {value}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-7">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Top up Method</h2>
              <p className="mt-1 text-sm text-white/45">Choose how you want to fund your account</p>
            </div>
            {method ? (
              <span className="hidden rounded-full border border-theme-green-action/30 bg-theme-green-action/10 px-3 py-1 text-xs font-medium text-theme-green-action sm:inline-flex">
                {method.label} selected
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {METHODS.map((m) => {
              const active = methodId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMethod(m.id)}
                  className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border px-4 py-6 text-center transition ${
                    active
                      ? "border-theme-green-action/50 bg-theme-green-action/10 shadow-[0_0_0_1px_rgba(13,159,27,0.2),0_16px_40px_rgba(0,0,0,0.35)]"
                      : "border-white/10 bg-[#141A2E]/80 hover:border-white/25 hover:bg-[#1A2238]"
                  }`}
                >
                  {active ? (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-theme-green-action text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                  <MethodIcon type={m.icon} />
                  <div>
                    <p className="text-base font-semibold text-white">{m.label}</p>
                    <p className="mt-0.5 text-xs text-white/45">{m.subtitle}</p>
                  </div>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 opacity-0 transition group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)` }}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Method details */}
        {method ? (
          <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-7">
            <h2 className="mb-1 text-lg font-semibold text-white">Complete {method.label} details</h2>
            <p className="mb-5 text-sm text-white/45">
              Amount: <span className="font-medium text-white">{currency} {amount || "—"}</span>
            </p>

            <div className="space-y-4">
              {method.id === "xm" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    XM Account ID *
                  </label>
                  <input
                    className={`${fieldClass} ${errors.accountId ? "border-rose-400/50" : ""}`}
                    value={details.accountId || ""}
                    onChange={(e) => setDetails((d) => ({ ...d, accountId: e.target.value }))}
                    placeholder="7–9 characters"
                  />
                  {errors.accountId ? <p className="mt-1 text-xs text-rose-300">{errors.accountId}</p> : null}
                </div>
              ) : null}

              {["skrill", "neteller", "binance", "usdt"].includes(method.id) ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    {method.id === "usdt"
                      ? "Wallet / Platform Email *"
                      : method.id === "binance"
                        ? "Binance Email ID *"
                        : `${method.label} Email ID *`}
                  </label>
                  <input
                    type="email"
                    className={`${fieldClass} ${errors.email ? "border-rose-400/50" : ""}`}
                    value={details.email || ""}
                    onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                    placeholder="name@example.com"
                  />
                  {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
                </div>
              ) : null}

              {method.id === "pm" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Perfect Money ID *
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-xl border border-white/12 bg-white/[0.06] px-3 font-semibold text-white">
                      U
                    </span>
                    <input
                      className={`${fieldClass} ${errors.pmId ? "border-rose-400/50" : ""}`}
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="12345678"
                      value={details.pmId || ""}
                      onChange={(e) =>
                        setDetails((d) => ({
                          ...d,
                          pmId: e.target.value.replace(/\D/g, "").slice(0, 8),
                        }))
                      }
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-white/35">Pre-typed U + remaining 8 digits</p>
                  {errors.pmId ? <p className="mt-1 text-xs text-rose-300">{errors.pmId}</p> : null}
                </div>
              ) : null}

              {method.id === "bank" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Saved bank account *
                  </label>
                  <select
                    className={`${fieldClass} ${errors.bank ? "border-rose-400/50" : ""}`}
                    value={details.bank || ""}
                    onChange={(e) => setDetails((d) => ({ ...d, bank: e.target.value }))}
                  >
                    <option value="" className="bg-[#141A2E]">
                      Select saved bank
                    </option>
                    {BANKS.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#141A2E]">
                        {b.label}
                      </option>
                    ))}
                  </select>
                  {errors.bank ? <p className="mt-1 text-xs text-rose-300">{errors.bank}</p> : null}
                  <Link href="/dashboard/profile" className="mt-2 inline-block text-xs text-theme-green-action hover:underline">
                    Manage saved banks
                  </Link>
                </div>
              ) : null}

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                  Payment slip (optional)
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:border-white/35">
                  Upload proof
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      setDetails((d) => ({ ...d, slip: e.target.files?.[0]?.name || "" }))
                    }
                  />
                </label>
                {details.slip ? <p className="mt-2 text-xs text-theme-green-action">{details.slip}</p> : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,159,27,0.35)] transition hover:brightness-110"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethodId(null);
                  setDetails({});
                  setErrors({});
                  setSubmitted(false);
                }}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                Change method
              </button>
            </div>

            {submitted ? (
              <p className="mt-4 rounded-xl border border-theme-green-action/30 bg-theme-green-action/10 px-4 py-3 text-sm text-theme-green-action">
                Deposit request submitted (frontend demo). Status: Pending · {currency} {amount} via{" "}
                {method.label}.
              </p>
            ) : null}
          </section>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-6 text-center text-sm text-white/45">
            Select a top up method above to continue.
          </p>
        )}
      </form>
    </div>
  );
}
