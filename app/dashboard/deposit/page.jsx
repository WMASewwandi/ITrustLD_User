"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import BottomMessage from "@/components/dashboard/bottom-message";
import FlowActions from "@/components/dashboard/flow-actions";
import MethodTerms from "@/components/method-terms";
import {
  createDeposit,
  divideAndRound,
  fetchDepositBootstrap,
  fetchDepositMethodDetails,
  fetchDepositPaymentProofContext,
  findDepositRate,
  multiplyAndRound,
  topupAccountPlaceholder,
  topupMethodIconKey,
  uploadDepositProof,
  validateTopupAccountId,
} from "@/lib/deposits";
import { getUserSession, hasUserSession } from "@/lib/auth";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  ArrowLeftRight,
  Building2,
  Check,
  Copy,
  Loader2,
  Plus,
  Trash2,
  User,
  Wallet,
} from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";

function MethodIcon({ type, logoUrl, name = "" }) {
  const resolvedLogo = String(logoUrl || "").trim();
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [resolvedLogo]);

  if (resolvedLogo && !logoFailed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedLogo}
          alt={name || "Top-up method"}
          className="h-full w-full object-cover"
          onError={() => setLogoFailed(true)}
        />
      </div>
    );
  }
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
    <div className="mb-8 w-full">
      <div className="flex w-full items-center">
        {labels.map((label, index) => {
          const n = index + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div
              key={label}
              className={`flex min-w-0 items-center ${index < labels.length - 1 ? "flex-1" : "shrink-0"}`}
            >
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active || done
                      ? "bg-theme-green-action text-white"
                      : "border border-white/15 bg-white/5 text-white/45"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:inline ${active ? "text-white" : "text-white/40"}`}
                >
                  {label}
                </span>
              </div>
              {index < labels.length - 1 ? (
                <div
                  className={`mx-3 h-px min-w-[1.5rem] flex-1 sm:mx-4 ${
                    done ? "bg-theme-green-action/50" : "bg-white/10"
                  }`}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CopyRow({ label, value, onCopy }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/8 py-3 last:border-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-theme-green-shaded">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white break-all">{value}</p>
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

function PaymentAccountsPanel({ type, accounts, onCopy }) {
  if (!accounts?.length) {
    return <p className="text-sm text-white/50">Payment account details are not available.</p>;
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="rounded-xl border border-white/10 bg-[#141A2E] px-4 py-2">
          {type === "bank_transfer" ? (
            <>
              <CopyRow label="Account Number" value={account.accountNumber} onCopy={onCopy} />
              <CopyRow label="Name" value={account.name} onCopy={onCopy} />
              <CopyRow label="Bank" value={account.bank} onCopy={onCopy} />
              <CopyRow label="Branch" value={account.branch} onCopy={onCopy} />
            </>
          ) : null}
          {type === "binance" ? (
            <>
              <CopyRow label="TRC20 Wallet" value={account.trc20WalletAddress} onCopy={onCopy} />
              <CopyRow label="Binance Email" value={account.binanceEmail} onCopy={onCopy} />
            </>
          ) : null}
          {type === "xm" || type === "perfect_money" ? (
            <CopyRow label="Account ID" value={account.accountId} onCopy={onCopy} />
          ) : null}
          {type === "skrill" || type === "neteller" ? (
            <CopyRow label="Email" value={account.email} onCopy={onCopy} />
          ) : null}
          {type === "card_payment" ? (
            <CopyRow label="Card Payment Link" value={account.cardPaymentLink} onCopy={onCopy} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function formatRateDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState("");

  const [bootstrap, setBootstrap] = useState(null);
  const [methodDetails, setMethodDetails] = useState(null);
  const [proofContext, setProofContext] = useState(null);

  const [amount, setAmount] = useState("100.00");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [methodId, setMethodId] = useState(null);
  const [paymentOptionId, setPaymentOptionId] = useState(null);
  const [currencySwitch, setCurrencySwitch] = useState("USD");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [topupAccountId, setTopupAccountId] = useState("");
  const [commissionNote, setCommissionNote] = useState("");

  const [depositId, setDepositId] = useState(null);
  const [transactionId, setTransactionId] = useState("");

  const [slipFile, setSlipFile] = useState(null);
  const [slipName, setSlipName] = useState("");
  const [slipPreview, setSlipPreview] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topRef = useRef(null);
  const lenis = useLenis();

  const topupMethod = useMemo(() => {
    if (methodDetails?.topup_method) return methodDetails.topup_method;
    return bootstrap?.topup_methods?.find((m) => m.id === methodId) || null;
  }, [bootstrap, methodDetails, methodId]);

  const selectedPaymentOption = useMemo(
    () => methodDetails?.payment_options?.find((opt) => opt.id === paymentOptionId) || null,
    [methodDetails, paymentOptionId],
  );

  const selectedRate = useMemo(() => {
    if (!methodDetails || !paymentOptionId || !methodId) return null;
    return findDepositRate(methodDetails.deposit_rates, methodId, paymentOptionId);
  }, [methodDetails, methodId, paymentOptionId]);

  const userName = useMemo(() => {
    const session = getUserSession();
    if (session?.name) return session.name;
    const ah = bootstrap?.account_holder;
    if (ah?.first_name || ah?.last_name) {
      return [ah.first_name, ah.last_name].filter(Boolean).join(" ");
    }
    return "Account Holder";
  }, [bootstrap]);

  const accountNumber =
    bootstrap?.account_holder?.account_number ||
    getUserSession()?.account_holder?.account_number ||
    getUserSession()?.accountId ||
    "—";

  const paymentCurrency = selectedPaymentOption?.currency || methodDetails?.initial_payment_currency || "LKR";
  const canSwitchToPaymentCurrency = paymentCurrency !== "USD";
  const editingDepositAmount = currencySwitch === depositCurrency;

  const rateDate = formatRateDate();

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
        const data = await fetchDepositBootstrap();
        if (cancelled) return;
        if (!data.verification_complete) {
          router.replace("/verify");
          return;
        }
        setBootstrap(data);
        if (data.recent_amounts?.[0]) setAmount(data.recent_amounts[0]);
        if (data.topup_methods?.[0]) setMethodId(data.topup_methods[0].id);
      } catch (err) {
        if (!cancelled) {
          if (err.status === 403) {
            setPageError("You do not have permission to make deposits.");
          } else {
            setPageError(err.message || "Failed to load deposit options.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  useEffect(() => {
    if (!methodDetails || !selectedRate || !paymentOptionId) return;

    const depositValue = Number(amount);
    if (!Number.isFinite(depositValue) || depositValue <= 0) return;

    const paymentOptionName = selectedPaymentOption?.name || "";
    const isCard = paymentOptionName.toLowerCase() === "card payment";
    let nextDeposit = depositValue;
    let nextPayment = multiplyAndRound(depositValue, selectedRate.rate);
    let note = "";

    if (editingDepositAmount) {
      if (isCard) {
        nextPayment = multiplyAndRound(nextPayment, 1.03);
        note = "+3% commission";
      }
    } else {
      const paymentValue = Number(paymentAmount);
      if (!Number.isFinite(paymentValue) || paymentValue <= 0) return;
      nextPayment = paymentValue;
      if (isCard) {
        const deducted = multiplyAndRound(paymentValue, 0.97);
        nextDeposit = divideAndRound(deducted, selectedRate.rate);
        note = "+3% commission";
      } else {
        nextDeposit = divideAndRound(paymentValue, selectedRate.rate);
      }
      setAmount(String(nextDeposit));
    }

    setPaymentAmount(String(nextPayment));
    setCommissionNote(note);
  }, [
    amount,
    editingDepositAmount,
    methodDetails,
    paymentAmount,
    paymentOptionId,
    selectedPaymentOption,
    selectedRate,
  ]);

  function scrollToPageTop() {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const target = topRef.current;
    if (lenis) {
      if (target) lenis.scrollTo(target, { immediate: true, force: true, offset: -8 });
      else lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }
    window.scrollTo(0, 0);
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

  function clearSlip() {
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipFile(null);
    setSlipName("");
    setSlipPreview("");
  }

  function handleSlipChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const name = file.name.toLowerCase();
    if (
      name.endsWith(".heic") ||
      name.endsWith(".heif") ||
      name.endsWith(".pdf") ||
      !file.type.startsWith("image/")
    ) {
      setErrors((prev) => ({
        ...prev,
        slip: "Only image files are allowed (JPG, PNG, GIF, BMP, WEBP).",
      }));
      clearSlip();
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        slip: "Payment proof should be less than 2Mb. Kindly reupload.",
      }));
      clearSlip();
      return;
    }

    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipFile(file);
    setSlipName(file.name);
    setSlipPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, slip: undefined }));
  }

  function validateStep1() {
    const next = {};
    const amt = String(amount || "").trim();
    const method = bootstrap?.topup_methods?.find((m) => m.id === methodId);
    if (!/^\d+(\.\d+)?$/.test(amt)) {
      next.amount = "Only numeric characters are allowed.";
    } else if (method) {
      const n = Number(amt);
      if (n < method.minLimit || n > method.maxLimit) {
        next.amount = `Amount must be between USD ${method.minLimit.toLocaleString()} and USD ${method.maxLimit.toLocaleString()}.`;
      }
    }
    if (!methodId) next.method = "Select a top-up method to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2() {
    const next = {};
    const accountError = validateTopupAccountId(topupMethod?.name, topupAccountId);
    if (accountError) next.topupAccountId = accountError;
    if (!paymentOptionId) next.paymentOption = "Select a payment option.";

    const depositValue = Number(amount);
    if (!Number.isFinite(depositValue) || depositValue <= 0) {
      next.amount = "Please enter a valid deposit amount.";
    } else if (topupMethod) {
      if (depositValue < topupMethod.minLimit || depositValue > topupMethod.maxLimit) {
        next.amount = `Deposit amount must be between USD ${topupMethod.minLimit} and USD ${topupMethod.maxLimit}.`;
      }
    }

    const payValue = Number(paymentAmount);
    if (!Number.isFinite(payValue) || payValue <= 0) {
      next.paymentAmount = "Please enter a valid payment amount.";
    }

    if (!selectedRate) next.paymentOption = "No rate is available for the selected payment option.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3() {
    const next = {};
    if (!slipFile) next.slip = "Please attach a payment slip or screenshot.";
    if (!acceptedTerms) next.terms = "You must accept the Terms and Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function loadMethodDetails(targetMethodId = methodId) {
    const details = await fetchDepositMethodDetails({
      topupMethodId: targetMethodId,
      depositAmount: amount,
      depositAmountCurrency: depositCurrency,
    });
    setMethodDetails(details);
    const defaultOptionId =
      details.priority_rate?.paymentOptionId || details.payment_options?.[0]?.id || null;
    setPaymentOptionId(defaultOptionId);
    setCurrencySwitch(depositCurrency);
    if (details.initial_payment_amount != null) {
      setPaymentAmount(String(details.initial_payment_amount));
    }
  }

  async function goNext() {
    setPageError("");
    if (step === 1) {
      if (!validateStep1()) return;
      setBusy(true);
      try {
        await loadMethodDetails();
        setStep(2);
        setErrors({});
      } catch (err) {
        setPageError(err.message || "Failed to load deposit details.");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (step === 2) {
      if (!validateStep2()) return;
      setBusy(true);
      try {
        const created = await createDeposit({
          payment_option_id: paymentOptionId,
          deposit_amount_currency: depositCurrency,
          deposit_amount: Number(amount),
          payment_amount_currency: paymentCurrency,
          payment_amount: Number(paymentAmount),
          topup_method_id: methodId,
          payment_option_rate: selectedRate.rate,
          payment_option_rate_id: selectedRate.id,
          topup_account_id: topupAccountId.trim(),
        });
        setDepositId(created.id);
        setTransactionId(created.transaction_id);
        const context = await fetchDepositPaymentProofContext(created.id);
        setProofContext(context);
        setStep(3);
        setErrors({});
      } catch (err) {
        setPageError(err.message || "Failed to create deposit.");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (step === 3 && validateStep3()) {
      setBusy(true);
      try {
        const result = await uploadDepositProof(depositId, slipFile);
        if (result?.error) {
          setErrors((prev) => ({ ...prev, slip: result.message }));
          return;
        }
        setSubmitted(true);
      } catch (err) {
        setPageError(err.message || "Failed to upload payment proof.");
      } finally {
        setBusy(false);
      }
    }
  }

  function goBack() {
    setSubmitted(false);
    setPageError("");
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleCopy(value) {
    try {
      const copiedText = await copyTextToClipboard(value);
      setCopied(copiedText);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  function handlePaymentOptionChange(nextId) {
    const option = methodDetails?.payment_options?.find((opt) => opt.id === Number(nextId));
    const rate = findDepositRate(methodDetails?.deposit_rates, methodId, Number(nextId));
    setPaymentOptionId(Number(nextId));
    setCommissionNote("");
    if (option?.currency && option.currency !== "USD") {
      setCurrencySwitch(depositCurrency);
    }
    if (rate && Number(amount) > 0) {
      setPaymentAmount(String(multiplyAndRound(Number(amount), rate.rate)));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading top-up options…
      </div>
    );
  }

  return (
    <div
      id="deposit-flow-top"
      ref={topRef}
      className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8"
    >
      <StepIndicator step={step} />

      {pageError ? (
        <div className="mb-6 rounded-xl border border-theme-red-action/30 bg-theme-red-action/10 px-4 py-3 text-sm text-theme-red-action">
          {pageError}
        </div>
      ) : null}

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
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className="rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm font-medium text-white outline-none sm:min-w-[120px]"
                >
                  <option value="USD" className="bg-[#141A2E]">
                    USD
                  </option>
                </select>
              </div>
              {errors.amount ? <p className="mt-2 text-xs text-theme-red-action">{errors.amount}</p> : null}

              {bootstrap?.recent_amounts?.length ? (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-white">Recent Topups</p>
                  <div className="flex flex-wrap gap-2">
                    {bootstrap.recent_amounts.map((value) => {
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
                          {depositCurrency} {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>

            <section className="border-t border-white/20 py-6">
              <h2 className="text-lg font-semibold text-white">Top-up Method</h2>
              <p className="mt-1 text-sm text-white/45">Choose how you want to fund your account</p>
              {errors.method ? <p className="mt-2 text-xs text-theme-red-action">{errors.method}</p> : null}

              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {(bootstrap?.topup_methods || []).map((m) => {
                  const active = methodId === m.id;
                  const icon = topupMethodIconKey(m.name);
                  const logoUrl = m.logoUrl || m.logo_url || null;
                  return (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setMethodId(m.id);
                        setErrors((prev) => ({ ...prev, method: undefined }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMethodId(m.id);
                          setErrors((prev) => ({ ...prev, method: undefined }));
                        }
                      }}
                      className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border px-4 py-6 text-center transition ${
                        active
                          ? "border-theme-green-action/50 bg-theme-green-action/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <MethodIcon type={icon} logoUrl={logoUrl} name={m.name} />
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="mt-1 text-xs text-white/45">
                          USD {m.minLimit} – {m.maxLimit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <FlowActions onNext={goNext} busy={busy} />
        </>
      ) : null}

      {step === 2 && methodDetails ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Deposit Details</h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-green-dark text-white">
                <User className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-white">
                  Account Name: <span className="font-semibold">{userName}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 w-fit min-w-[220px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141A2E]">
              <div className="flex items-center gap-3 px-4 py-3">
                <MethodIcon
                  type={topupMethodIconKey(topupMethod?.name)}
                  logoUrl={topupMethod?.logoUrl || topupMethod?.logo_url || null}
                  name={topupMethod?.name}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{topupMethod?.name}</p>
                  <p className="text-xs text-white/45">{depositCurrency} {amount}</p>
                </div>
              </div>
              {(topupMethod?.allowNavigateButton ?? topupMethod?.allow_navigate_button) &&
              (topupMethod?.navigateUrl || topupMethod?.navigate_url) &&
              (topupMethod?.navigateButtonLabel || topupMethod?.navigate_button_label) ? (
                <a
                  href={topupMethod.navigateUrl || topupMethod.navigate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center border-t border-white/10 bg-theme-green-action/10 px-4 py-2.5 text-xs font-semibold text-theme-green-action transition hover:bg-theme-green-action/20"
                >
                  {topupMethod.navigateButtonLabel || topupMethod.navigate_button_label}
                </a>
              ) : null}
            </div>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/55">
            Please choose the option you want to pay us. Choose the currency that is convenient for you, enter your
            platform account, and review the payable amount before continuing.
          </p>

          <section className="border-t border-white/20 py-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Payment Option
                  </label>
                  <select
                    value={paymentOptionId ?? ""}
                    onChange={(e) => handlePaymentOptionChange(e.target.value)}
                    className={fieldClass}
                  >
                    {(methodDetails.payment_options || []).map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#141A2E]">
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  {commissionNote ? (
                    <p className="mt-2 text-xs text-theme-red-action">{commissionNote}</p>
                  ) : null}
                  {errors.paymentOption ? (
                    <p className="mt-2 text-xs text-theme-red-action">{errors.paymentOption}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Currency & Amount
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={currencySwitch}
                      onChange={(e) => setCurrencySwitch(e.target.value)}
                      className={fieldClass}
                    >
                      <option value={depositCurrency} className="bg-[#141A2E]">
                        {depositCurrency}
                      </option>
                      {canSwitchToPaymentCurrency ? (
                        <option value={paymentCurrency} className="bg-[#141A2E]">
                          {paymentCurrency}
                        </option>
                      ) : null}
                    </select>
                    {editingDepositAmount ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value.replace(/[^\d.]/g, ""));
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }}
                        className={`${fieldClass} ${errors.amount ? "border-theme-red-action/50" : ""}`}
                      />
                    ) : (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={paymentAmount}
                        onChange={(e) => {
                          setPaymentAmount(e.target.value.replace(/[^\d.]/g, ""));
                          setErrors((prev) => ({ ...prev, paymentAmount: undefined }));
                        }}
                        className={`${fieldClass} ${errors.paymentAmount ? "border-theme-red-action/50" : ""}`}
                      />
                    )}
                  </div>
                  {errors.amount || errors.paymentAmount ? (
                    <p className="mt-2 text-xs text-theme-red-action">
                      {errors.amount || errors.paymentAmount}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    {topupAccountPlaceholder(topupMethod?.name)}
                  </label>
                  <input
                    type="text"
                    value={topupAccountId}
                    onChange={(e) => {
                      setTopupAccountId(e.target.value);
                      setErrors((prev) => ({ ...prev, topupAccountId: undefined }));
                    }}
                    placeholder={topupAccountPlaceholder(topupMethod?.name)}
                    className={`${fieldClass} ${errors.topupAccountId ? "border-theme-red-action/50" : ""}`}
                  />
                  {errors.topupAccountId ? (
                    <p className="mt-2 text-xs text-theme-red-action">{errors.topupAccountId}</p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-white/50">Payment Amount</p>
                  <p className="mt-1 text-3xl font-bold text-theme-green-action">
                    {paymentCurrency}{" "}
                    {Number(paymentAmount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Deposit: {depositCurrency}{" "}
                    {Number(amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
                      {paymentCurrency} {selectedRate?.rate?.toFixed?.(2) ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <FlowActions onBack={goBack} onNext={goNext} busy={busy} />
        </>
      ) : null}

      {step === 3 && proofContext ? (
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
                  <p className="text-sm text-white/50">Account ID: {accountNumber}</p>
                  <p className="text-sm text-white/50">Transaction ID: {transactionId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-4 py-3">
              <MethodIcon
                type={topupMethodIconKey(proofContext.deposit.topup_method_name)}
                logoUrl={
                  proofContext.deposit.topup_method_logo_url ||
                  topupMethod?.logoUrl ||
                  topupMethod?.logo_url ||
                  null
                }
                name={proofContext.deposit.topup_method_name}
              />
              <div>
                <p className="text-sm font-semibold text-white">{proofContext.deposit.topup_method_name}</p>
                <p className="text-xs text-white/45">{proofContext.deposit.payment_option_name}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="border-t border-white/20 py-6">
              <p className="text-sm text-white/50">Payment Amount</p>
              <p className="mt-1 text-3xl font-bold text-theme-green-action">
                {proofContext.deposit.payment_amount_currency}{" "}
                {Number(proofContext.deposit.payment_amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-white/70">Payment Account Details</p>
                <PaymentAccountsPanel
                  type={proofContext.payment_account_type}
                  accounts={proofContext.payment_accounts}
                  onCopy={handleCopy}
                />
              </div>
              {copied ? <p className="mt-2 text-xs text-theme-green-action">Copied: {copied}</p> : null}
            </section>

            <section className="border-t border-white/20 py-6">
              <h2 className="text-lg font-bold text-white">{proofContext.deposit.topup_method_name} Conditions</h2>
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                className="custom-scrollbar mt-4 max-h-[280px] space-y-3 overflow-y-auto overscroll-contain pr-1 text-sm leading-relaxed text-white/85"
              >
                <MethodTerms html={proofContext?.terms || topupMethod?.terms} />
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
                <span className="mt-1 text-xs text-white/35">JPG, PNG, GIF, BMP or WEBP · Max 2MB</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,.jpg,.jpeg,.png,.gif,.bmp,.webp"
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
                <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="font-medium text-theme-green-action hover:underline">
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
                secondaryAction={{
                  label: "New Deposit",
                  onClick: () => {
                    setSubmitted(false);
                    setStep(1);
                    setDepositId(null);
                    setTransactionId("");
                    setProofContext(null);
                    setMethodDetails(null);
                    clearSlip();
                    setAcceptedTerms(false);
                    setTopupAccountId("");
                  },
                }}
              >
                Your deposit request has been submitted successfully. Transaction ID {transactionId} is now pending
                review.
              </BottomMessage>
            ) : null}
          </section>

          <FlowActions onBack={goBack} onNext={goNext} nextLabel="Submit" busy={busy} />
        </>
      ) : null}
    </div>
  );
}
