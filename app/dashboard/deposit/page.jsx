"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import BottomMessage from "@/components/dashboard/bottom-message";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  Check,
  Copy,
  Plus,
  Trash2,
  User,
  Wallet,
} from "lucide-react";

const RECENT_TOPUPS = ["100.00", "10.00", "105.00", "121.00", "11.00"];
const CURRENCIES = ["USD", "EUR", "GBP"];
const DAILY_RATE_LKR = 320;
const LOCAL_DEPOSITOR_ID = "67104269";

const METHODS = [
  { id: "xm", label: "XM", subtitle: "Local top-up", min: 5, max: 20000, icon: "xm" },
  { id: "usdt", label: "USDT", subtitle: "Tether crypto", min: 10, max: 20000, icon: "usdt" },
  { id: "skrill", label: "Skrill", subtitle: "E-wallet", min: 100, max: 20000, icon: "skrill" },
  { id: "neteller", label: "Neteller", subtitle: "E-wallet", min: 100, max: 20000, icon: "neteller" },
  { id: "pm", label: "Perfect Money", subtitle: "U + 8 digits", min: 50, max: 20000, icon: "pm" },
  { id: "binance", label: "Binance", subtitle: "BTC & crypto", min: 10, max: 20000, icon: "btc" },
  { id: "bank", label: "Bank Transfer", subtitle: "Local banks", min: 5, max: 20000, icon: "bank" },
];

const PAYMENT_OPTIONS = ["Bank Transfer", "Online Transfer", "ATM Top-up"];

const RECEIVER_BANK = {
  accountNumber: "015710000872",
  name: "GLOBIX (PVT) LTD",
  bank: "Sampath Bank",
  branch: "Sooriyawawa",
};

const XM_CONDITIONS = [
  `Log in to members area. Go to subscribe to local depositor under Account tab. Enter Member_ID No - ${LOCAL_DEPOSITOR_ID} of our local depositor and subscribe.`,
  `Log in to members area. Account tab එක යටතේ ඇති subscribe to local depositer වෙතට යන්න. අපගේ දේශීය තැන්පත්කරුගේ Member_ID No - ${LOCAL_DEPOSITOR_ID} ඇතුළත් කර subscribe කරන්න.`,
  "If you are sending an online transaction, type the XM Account ID in the description/remark.",
  "If you top-up money into your account, write your XM Account ID on your slip and send it.",
  "In the Transaction Photo you send, you must enter the Date, Time, Description/remark, account number.",
  "The above are mandatory. Otherwise top-ups will be rejected. We are non refundable them.",
  "We are not responsible for any irregularities in other banks & platforms.",
  "Your payment proof is valid only for the date mentioned in it.",
  "ඔබ ඔන්ලයින් ගනුදෙනුවක් යවන්නේ නම්, Description / Remark වලට XM Account ID ටයිප් කරන්න.",
  "ඔබ ඔබේ ගිණුමට ATM මගින් මුදල් තැන්පත් කරන්නේ නම්, ඔබේ XM Account ID රිසිට් පතෙහි පෑනකින් ලියන්න.",
  "ඔබ එවන ගනුදෙනු ඡායාරූපයෙහි, දිනය, වේලාව, Description, පැහැදිලිව පෙනෙන ලෙස ඇතුළත් කළ යුතුය.",
  "ඉහත කරුණු අනිවාර්ය වේ. එසේ නොමැතිනම් තැන්පතු ප්‍රතික්ෂේප කරනු ලැබේ.",
  "වෙනත් බැංකු සහ වේදිකාවල සිදුවන කිසියම් අක්‍රමිකතා සඳහා අප වගකියනු නොලැබෙ.",
  "ඔබගේ payment proof එක වලංගු වන්නේ එහි සදහන් දිනයට පමණි.",
];

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";

function MethodIcon({ type }) {
  if (type === "usdt") {
    return (
      <div className="coin-glow-usdt relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-theme-green-action to-theme-green-dark">
        <span className="pointer-events-none absolute inset-[-10px] rounded-full bg-theme-green-action/30 coin-glow-ring" />
        <span className="relative z-10 text-2xl font-bold text-white">₮</span>
      </div>
    );
  }
  if (type === "btc") {
    return (
      <div className="coin-glow-btc relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-theme-green-shaded to-theme-green-dark">
        <span className="pointer-events-none absolute inset-[-10px] rounded-full bg-theme-green-shaded/35 coin-glow-ring" />
        <span className="relative z-10 text-2xl font-bold text-white">₿</span>
      </div>
    );
  }
  if (type === "pm") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-dark/25 ring-1 ring-theme-green-shaded/40">
        <span className="text-lg font-black text-theme-green-shaded">PM</span>
      </div>
    );
  }
  if (type === "xm") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/35">
        <span className="text-xl font-black tracking-tight text-theme-green-action">XM</span>
      </div>
    );
  }
  if (type === "skrill") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-shaded/15 ring-1 ring-theme-green-shaded/35">
        <Wallet className="h-7 w-7 text-theme-green-shaded" />
      </div>
    );
  }
  if (type === "neteller") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/35">
        <span className="text-lg font-bold text-theme-green-action">N</span>
      </div>
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/35">
      <Building2 className="h-7 w-7 text-theme-green-action" />
    </div>
  );
}

function StepIndicator({ step }) {
  const labels = ["Top-up", "Details", "Proof"];
  return (
    <div className="mb-8 flex items-center gap-2 sm:gap-3">
      {labels.map((label, index) => {
        const n = index + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active || done
                  ? "bg-theme-green-action text-white"
                  : "border border-white/15 bg-white/5 text-white/45"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`hidden text-sm font-medium sm:inline ${active ? "text-white" : "text-white/40"}`}>
              {label}
            </span>
            {index < labels.length - 1 ? (
              <div className={`h-px flex-1 ${done ? "bg-theme-green-action/50" : "bg-white/10"}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function CopyRow({ label, value, onCopy }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/8 py-3 last:border-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-theme-green-shaded">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value)}
        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-theme-green-action"
        aria-label={`Copy ${label}`}
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function DepositPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("100.00");
  const [currency, setCurrency] = useState("USD");
  const [methodId, setMethodId] = useState(null);
  const [paymentOption, setPaymentOption] = useState("Bank Transfer");
  const [xmAccountId, setXmAccountId] = useState("");
  const [slipName, setSlipName] = useState("");
  const [slipPreview, setSlipPreview] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState("Avishka Sevvandi");
  const [accountId, setAccountId] = useState("16421936534");
  const topRef = useRef(null);
  const lenis = useLenis();

  const method = useMemo(() => METHODS.find((m) => m.id === methodId) || null, [methodId]);

  const rateDate = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  }, []);

  const paymentLkr = useMemo(() => {
    const n = Number(amount);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * DAILY_RATE_LKR);
  }, [amount]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserName(parsed.name);
        if (parsed?.accountId) setAccountId(String(parsed.accountId));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  function clearSlip() {
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipName("");
    setSlipPreview("");
    setSubmitted(false);
  }

  function handleSlipChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, slip: "Only image files are allowed (JPG, PNG, WEBP)." }));
      clearSlip();
      return;
    }

    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipName(file.name);
    setSlipPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, slip: undefined }));
  }

  function scrollToPageTop() {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const target = topRef.current;
    if (lenis) {
      if (target) {
        lenis.scrollTo(target, { immediate: true, force: true, offset: -8 });
      } else {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      return;
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    target?.scrollIntoView({ behavior: "auto", block: "start" });
  }

  useEffect(() => {
    scrollToPageTop();
    const frame = requestAnimationFrame(scrollToPageTop);
    const timer = window.setTimeout(scrollToPageTop, 80);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [step, lenis]);

  function validateStep1() {
    const next = {};
    const amt = String(amount || "").trim();
    if (!/^\d+(\.\d+)?$/.test(amt)) {
      next.amount = "Only numeric characters are allowed.";
    } else if (method) {
      const n = Number(amt);
      if (n < method.min || n > method.max) {
        next.amount = `Amount must be between ${currency} ${method.min.toLocaleString()} and ${currency} ${method.max.toLocaleString()}.`;
      }
    }
    if (!methodId) next.method = "Select a top-up method to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2() {
    const next = {};
    const id = xmAccountId.trim();
    if (id.length < 7 || id.length > 12) {
      next.xmAccountId = "Enter a valid XM Account ID (7–12 characters).";
    }
    if (!paymentOption) next.paymentOption = "Select a payment option.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3() {
    const next = {};
    if (!slipName) next.slip = "Please attach a payment slip or screenshot.";
    if (!acceptedTerms) next.terms = "You must accept the Terms and Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
      return;
    }
    if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
      return;
    }
    if (step === 3 && validateStep3()) {
      setSubmitted(true);
    }
  }

  function goBack() {
    setSubmitted(false);
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleCopy(value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  return (
    <div
      id="deposit-flow-top"
      ref={topRef}
      className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8"
    >
      <StepIndicator step={step} />

      {step === 1 ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Top-up</h1>
            <p className="mt-2 text-sm text-white/50 sm:text-base">
              Select a top-up method and amount from below to proceed.
            </p>
          </div>

          <div className="space-y-0">
            <section className="py-6">
              <label className="mb-3 block text-sm font-semibold text-white">Top-up Amount</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value.replace(/[^\d.]/g, ""));
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`${fieldClass} flex-1 ${errors.amount ? "border-theme-red-action/50" : ""}`}
                  placeholder="Enter amount"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm font-medium text-white outline-none sm:min-w-[120px]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-[#141A2E]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.amount ? <p className="mt-2 text-xs text-theme-red-action">{errors.amount}</p> : null}

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-white">Recent Topups</p>
                <div className="flex flex-wrap gap-2">
                  {RECENT_TOPUPS.map((value) => {
                    const active = amount === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAmount(value);
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.04] text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {currency} {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="border-t border-white/20 py-6">
              <h2 className="text-lg font-semibold text-white">Top-up Method</h2>
              <p className="mt-1 text-sm text-white/45">Choose how you want to fund your account</p>
              {errors.method ? <p className="mt-2 text-xs text-theme-red-action">{errors.method}</p> : null}

              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {METHODS.map((m) => {
                  const active = methodId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMethodId(m.id);
                        setErrors((prev) => ({ ...prev, method: undefined }));
                      }}
                      className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl px-4 py-6 text-center transition ${
                        active
                          ? "bg-theme-green-action/10"
                          : "bg-white/[0.03] hover:bg-white/[0.06]"
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
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,159,27,0.3)] transition hover:brightness-110"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Top-up Details</h1>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-green-dark text-white">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-white/45">Account Name</p>
                  <p className="text-base font-semibold text-white">{userName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-4 py-3">
              <MethodIcon type={method?.icon || "xm"} />
              <div>
                <p className="text-sm font-semibold text-white">{method?.label}</p>
                <p className="text-xs text-white/45">{method?.subtitle}</p>
              </div>
            </div>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/55">
            Please choose the option you want to pay us. Enter your amount and XM account. The amount payable and the
            amount you will receive will then be displayed. Then click Next and proceed to the next step.
          </p>

          <section className="border-t border-white/20 py-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Payment Option
                  </label>
                  <select
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value)}
                    className={fieldClass}
                  >
                    {PAYMENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#141A2E]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Currency & Amount
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="rounded-xl border border-white/12 bg-[#0B1020]/60 px-4 py-3 text-sm font-medium text-white outline-none sm:min-w-[110px]"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} className="bg-[#141A2E]">
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                      className={`${fieldClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={xmAccountId}
                      onChange={(e) => {
                        setXmAccountId(e.target.value);
                        setErrors((prev) => ({ ...prev, xmAccountId: undefined }));
                      }}
                      placeholder="Your XM Account"
                      className={`${fieldClass} flex-1 ${errors.xmAccountId ? "border-theme-red-action/50" : ""}`}
                    />
                  </div>
                  {errors.xmAccountId ? (
                    <p className="mt-2 text-xs text-theme-red-action">{errors.xmAccountId}</p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-white/50">Payment Amount</p>
                  <p className="mt-1 text-3xl font-bold text-theme-green-action">
                    LKR {paymentLkr.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-2xl border border-theme-green-action/25 bg-theme-green-dark p-5 text-white shadow-[0_16px_40px_rgba(20,83,91,0.35)]">
                  <p className="text-sm text-white/80">Daily Buying Rate per $1</p>
                  <p className="mt-1 text-xs text-white/55">{rateDate}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <ArrowLeftRight className="h-5 w-5 text-theme-green-shaded" />
                    <p className="text-2xl font-bold text-white">
                      LKR {DAILY_RATE_LKR.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="hidden items-end justify-center rounded-2xl border border-white/10 bg-[#141A2E]/80 p-6 lg:flex">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex h-16 w-12 items-center justify-center rounded-lg bg-gradient-to-b from-theme-green-shaded/40 to-theme-green-dark text-lg font-bold text-white shadow-lg"
                        style={{ marginTop: i * 8 }}
                      >
                        $
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,159,27,0.3)] transition hover:brightness-110"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Payment Proof</h1>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-green-dark text-white">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-white">
                    Account Name: <span className="font-semibold">{userName}</span>
                  </p>
                  <p className="text-sm text-white/50">Account ID: {accountId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-4 py-3">
              <MethodIcon type={method?.icon || "xm"} />
              <div>
                <p className="text-sm font-semibold text-white">{method?.label}</p>
                <p className="text-xs text-white/45">{paymentOption}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="border-t border-white/20 py-6">
              <p className="text-sm text-white/50">Payment Amount</p>
              <p className="mt-1 text-3xl font-bold text-theme-green-action">
                LKR {paymentLkr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-[#141A2E] px-4 py-2">
                <CopyRow label="Account Number" value={RECEIVER_BANK.accountNumber} onCopy={handleCopy} />
                <CopyRow label="Name" value={RECEIVER_BANK.name} onCopy={handleCopy} />
                <CopyRow label="Bank" value={RECEIVER_BANK.bank} onCopy={handleCopy} />
                <CopyRow label="Branch" value={RECEIVER_BANK.branch} onCopy={handleCopy} />
              </div>
              {copied ? (
                <p className="mt-2 text-xs text-theme-green-action">Copied: {copied}</p>
              ) : null}
            </section>

            <section className="border-t border-white/20 py-6">
              <h2 className="text-lg font-bold text-white">XM Conditions</h2>
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                className="mt-4 max-h-[280px] space-y-3 overflow-y-auto overscroll-contain pr-2 text-sm leading-relaxed text-white/85"
              >
                {XM_CONDITIONS.map((line, index) => (
                  <p key={index}>* {line}</p>
                ))}
              </div>
            </section>
          </div>

          <section className="border-t border-white/20 py-6">
            <p className="text-sm text-white/55">
              Please attach a payment slip or a screenshot to prove your transaction.
            </p>

            {!slipPreview ? (
              <label className="mt-4 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-8 text-center transition hover:border-theme-green-action/40 hover:bg-theme-green-action/5">
                <Plus className="h-8 w-8 text-white/40" />
                <span className="mt-2 text-sm text-white/50">Add your image here</span>
                <span className="mt-1 text-xs text-white/35">JPG, PNG or WEBP only</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  onChange={handleSlipChange}
                />
              </label>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-theme-green-action/25 bg-theme-green-action/10 p-3">
                <img
                  src={slipPreview}
                  alt="Payment proof preview"
                  className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                />
                <p className="min-w-0 flex-1 truncate text-sm text-theme-green-action">{slipName}</p>
                <button
                  type="button"
                  onClick={clearSlip}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            )}
            {errors.slip ? <p className="mt-2 text-xs text-theme-red-action">{errors.slip}</p> : null}

            <label className="mt-5 flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent text-theme-green-action focus:ring-theme-green-action"
              />
              <span>
                I accept{" "}
                <a href="/help" className="font-medium text-theme-green-action hover:underline">
                  Terms and Conditions
                </a>
              </span>
            </label>
            {errors.terms ? <p className="mt-2 text-xs text-theme-red-action">{errors.terms}</p> : null}

            {submitted ? (
              <BottomMessage
                title="Top-up submitted"
                variant="success"
                onClose={() => setSubmitted(false)}
                primaryAction={{ label: "View Transactions", href: "/dashboard/transactions" }}
                secondaryAction={{ label: "Close", onClick: () => setSubmitted(false) }}
              >
                Top-up request submitted (frontend demo). Status: Pending · {currency} {amount} via {method?.label} ·
                Payable LKR {paymentLkr.toLocaleString()} · XM Account {xmAccountId}.
              </BottomMessage>
            ) : null}
          </section>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,159,27,0.3)] transition hover:brightness-110"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
