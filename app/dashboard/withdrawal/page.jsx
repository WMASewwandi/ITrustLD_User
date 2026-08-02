"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import BottomMessage from "@/components/dashboard/bottom-message";
import AddPaymentAccountForm from "@/components/dashboard/add-payment-account-form";
import {
  mapCreatedAccountToReceivingOption,
  paymentOptionNameToAccountType,
} from "@/lib/payment-accounts";
import {
  cashoutAccountPlaceholder,
  cashoutMethodIconKey,
  createWithdrawal,
  divideAndRound,
  fetchWithdrawalBootstrap,
  fetchWithdrawalMethodDetails,
  fetchWithdrawalPaymentProofContext,
  findWithdrawalRate,
  multiplyAndRound,
  uploadWithdrawalProof,
  validateCashoutAccountId,
} from "@/lib/withdrawals";
import { getUserSession, hasUserSession } from "@/lib/auth";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  Check,
  Copy,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  User,
  Wallet,
} from "lucide-react";

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
  if (type === "redeposit") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-green-shaded/15 ring-1 ring-theme-green-shaded/35">
        <RefreshCcw className="h-7 w-7 text-theme-green-shaded" />
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
  const labels = ["Cash-out", "Details", "Proof"];
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

function parseReceivingAccountSelection(value) {
  if (!value) return { selectedAccountType: "", selectedAccountId: "" };
  const separatorIndex = value.indexOf(":");
  if (separatorIndex === -1) return { selectedAccountType: "", selectedAccountId: "" };
  return {
    selectedAccountType: value.slice(0, separatorIndex),
    selectedAccountId: value.slice(separatorIndex + 1),
  };
}

export default function WithdrawalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState("");

  const [bootstrap, setBootstrap] = useState(null);
  const [methodDetails, setMethodDetails] = useState(null);
  const [proofContext, setProofContext] = useState(null);

  const [amount, setAmount] = useState("100.00");
  const [cashoutCurrency] = useState("USD");
  const [methodId, setMethodId] = useState(null);
  const [paymentOptionId, setPaymentOptionId] = useState(null);
  const [currencySwitch, setCurrencySwitch] = useState("USD");
  const [receivingAmount, setReceivingAmount] = useState("");
  const [cashoutAccountId, setCashoutAccountId] = useState("");

  const [withdrawalId, setWithdrawalId] = useState(null);
  const [transactionId, setTransactionId] = useState("");

  const [slipFile, setSlipFile] = useState(null);
  const [slipName, setSlipName] = useState("");
  const [slipPreview, setSlipPreview] = useState("");
  const [receivingAccountSelection, setReceivingAccountSelection] = useState("");
  const [showAddReceivingAccount, setShowAddReceivingAccount] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topRef = useRef(null);
  const lenis = useLenis();

  const cashoutMethod = useMemo(() => {
    if (methodDetails?.cashout_method) return methodDetails.cashout_method;
    return bootstrap?.cashout_methods?.find((m) => m.id === methodId) || null;
  }, [bootstrap, methodDetails, methodId]);

  const selectedPaymentOption = useMemo(
    () => methodDetails?.payment_options?.find((opt) => opt.id === paymentOptionId) || null,
    [methodDetails, paymentOptionId],
  );

  const selectedRate = useMemo(() => {
    if (!methodDetails || !paymentOptionId || !methodId) return null;
    return findWithdrawalRate(methodDetails.withdrawal_rates, methodId, paymentOptionId);
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

  const receivingCurrency =
    selectedPaymentOption?.currency || methodDetails?.initial_receiving_currency || "LKR";
  const canSwitchToReceivingCurrency = receivingCurrency !== "USD";
  const editingCashoutAmount = currencySwitch === cashoutCurrency;

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
        const data = await fetchWithdrawalBootstrap();
        if (cancelled) return;
        if (!data.verification_complete) {
          router.replace("/verify");
          return;
        }
        setBootstrap(data);
        if (data.recent_amounts?.[0]) setAmount(data.recent_amounts[0]);
        if (data.cashout_methods?.[0]) setMethodId(data.cashout_methods[0].id);
      } catch (err) {
        if (!cancelled) {
          if (err.status === 403) {
            setPageError("You do not have permission to make cash-outs.");
          } else {
            setPageError(err.message || "Failed to load cash-out options.");
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

    const cashoutValue = Number(amount);
    if (!Number.isFinite(cashoutValue) || cashoutValue <= 0) return;

    if (editingCashoutAmount) {
      setReceivingAmount(String(multiplyAndRound(cashoutValue, selectedRate.rate)));
    } else {
      const receivingValue = Number(receivingAmount);
      if (!Number.isFinite(receivingValue) || receivingValue <= 0) return;
      setAmount(String(divideAndRound(receivingValue, selectedRate.rate)));
    }
  }, [amount, editingCashoutAmount, methodDetails, paymentOptionId, receivingAmount, selectedRate]);

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
    const method = bootstrap?.cashout_methods?.find((m) => m.id === methodId);
    if (!/^\d+(\.\d+)?$/.test(amt)) {
      next.amount = "Only numeric characters are allowed.";
    } else if (method) {
      const n = Number(amt);
      if (n < method.minLimit || n > method.maxLimit) {
        next.amount = `Amount must be between USD ${method.minLimit.toLocaleString()} and USD ${method.maxLimit.toLocaleString()}.`;
      }
    }
    if (!methodId) next.method = "Select a cash-out method to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2() {
    const next = {};
    const accountError = validateCashoutAccountId(cashoutMethod?.name, cashoutAccountId);
    if (accountError) next.cashoutAccountId = accountError;
    if (!paymentOptionId) next.paymentOption = "Select a receiving payment option.";

    const cashoutValue = Number(amount);
    if (!Number.isFinite(cashoutValue) || cashoutValue <= 0) {
      next.amount = "Please enter a valid cash-out amount.";
    } else if (cashoutMethod) {
      if (cashoutValue < cashoutMethod.minLimit || cashoutValue > cashoutMethod.maxLimit) {
        next.amount = `Cash-out amount must be between USD ${cashoutMethod.minLimit} and USD ${cashoutMethod.maxLimit}.`;
      }
    }

    const recvValue = Number(receivingAmount);
    if (!Number.isFinite(recvValue) || recvValue <= 0) {
      next.receivingAmount = "Please enter a valid receiving amount.";
    }

    if (!selectedRate) next.paymentOption = "No rate is available for the selected payment option.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep3() {
    const next = {};
    if (!slipFile) next.slip = "Please attach a payment slip or screenshot.";
    if (!receivingAccountSelection) next.receivingAccount = "Select a receiving account.";
    if (!acceptedTerms) next.terms = "You must accept the Terms and Conditions.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function loadMethodDetails(targetMethodId = methodId) {
    const details = await fetchWithdrawalMethodDetails({
      cashoutMethodId: targetMethodId,
      cashoutAmount: amount,
      cashoutAmountCurrency: cashoutCurrency,
    });
    setMethodDetails(details);
    const defaultOptionId =
      details.priority_rate?.paymentOptionId || details.payment_options?.[0]?.id || null;
    setPaymentOptionId(defaultOptionId);
    setCurrencySwitch(cashoutCurrency);
    if (details.initial_receiving_amount != null) {
      setReceivingAmount(String(details.initial_receiving_amount));
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
        setPageError(err.message || "Failed to load cash-out details.");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (step === 2) {
      if (!validateStep2()) return;
      setBusy(true);
      try {
        const created = await createWithdrawal({
          receiving_payment_option_id: paymentOptionId,
          cashout_amount_currency: cashoutCurrency,
          cashout_amount: Number(amount),
          receiving_amount_currency: receivingCurrency,
          receiving_amount: Number(receivingAmount),
          cashout_method_id: methodId,
          receiving_payment_option_rate: selectedRate.rate,
          receiving_payment_option_rate_id: selectedRate.id,
          cashout_account_id: cashoutAccountId.trim(),
        });
        setWithdrawalId(created.id);
        setTransactionId(created.transaction_id);
        const context = await fetchWithdrawalPaymentProofContext(created.id);
        setProofContext(context);
        setReceivingAccountSelection("");
        setStep(3);
        setErrors({});
      } catch (err) {
        setPageError(err.message || "Failed to create cash-out.");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (step === 3 && validateStep3()) {
      setBusy(true);
      try {
        const { selectedAccountType, selectedAccountId } =
          parseReceivingAccountSelection(receivingAccountSelection);
        const result = await uploadWithdrawalProof(withdrawalId, slipFile, {
          selectedAccountType,
          selectedAccountId,
        });
        if (result?.error) {
          setErrors((prev) => ({
            ...prev,
            slip: result.message,
            receivingAccount: result.message?.toLowerCase().includes("select") ? result.message : undefined,
          }));
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
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  function handlePaymentOptionChange(nextId) {
    const option = methodDetails?.payment_options?.find((opt) => opt.id === Number(nextId));
    const rate = findWithdrawalRate(methodDetails?.withdrawal_rates, methodId, Number(nextId));
    setPaymentOptionId(Number(nextId));
    if (option?.currency && option.currency !== "USD") {
      setCurrencySwitch(cashoutCurrency);
    }
    if (rate && Number(amount) > 0) {
      setReceivingAmount(String(multiplyAndRound(Number(amount), rate.rate)));
    }
  }

  const termsLines = useMemo(() => {
    const raw = proofContext?.terms || cashoutMethod?.terms || "";
    return String(raw)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [proofContext, cashoutMethod]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading cash-out options…
      </div>
    );
  }

  return (
    <div
      id="withdrawal-flow-top"
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
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Cash-out</h1>
            <p className="mt-2 text-sm text-white/50 sm:text-base">
              Select a cash-out method and amount from below to proceed.
            </p>
          </div>

          <div className="space-y-0">
            <section className="py-6">
              <label className="mb-3 block text-sm font-semibold text-white">Cash-out Amount</label>
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
                  value={cashoutCurrency}
                  disabled
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
                  <p className="mb-3 text-sm font-semibold text-white">Recent Cash-outs</p>
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
                          {cashoutCurrency} {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>

            <section className="border-t border-white/20 py-6">
              <h2 className="text-lg font-semibold text-white">Cash-out Method</h2>
              <p className="mt-1 text-sm text-white/45">Choose where to receive your funds</p>
              {errors.method ? <p className="mt-2 text-xs text-theme-red-action">{errors.method}</p> : null}

              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {(bootstrap?.cashout_methods || []).map((m) => {
                  const active = methodId === m.id;
                  const icon = cashoutMethodIconKey(m.name);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMethodId(m.id);
                        setErrors((prev) => ({ ...prev, method: undefined }));
                      }}
                      className={`flex flex-col items-center gap-3 rounded-2xl border px-4 py-6 text-center transition ${
                        active
                          ? "border-theme-green-action/50 bg-theme-green-action/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <MethodIcon type={icon} />
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="mt-1 text-xs text-white/45">
                          USD {m.minLimit} – {m.maxLimit.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={goNext}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}

      {step === 2 && methodDetails ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Cash-out Details</h1>
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
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-4 py-3 w-fit">
              <MethodIcon type={cashoutMethodIconKey(cashoutMethod?.name)} />
              <div>
                <p className="text-sm font-semibold text-white">{cashoutMethod?.name}</p>
                <p className="text-xs text-white/45">
                  {cashoutCurrency} {amount}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/55">
            Please choose how you want to receive payment. Choose the currency that is convenient for you, enter your
            cash-out platform account, and review the receiving amount before continuing.
          </p>

          <section className="border-t border-white/20 py-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    Receiving Payment Option
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
                      <option value={cashoutCurrency} className="bg-[#141A2E]">
                        {cashoutCurrency}
                      </option>
                      {canSwitchToReceivingCurrency ? (
                        <option value={receivingCurrency} className="bg-[#141A2E]">
                          {receivingCurrency}
                        </option>
                      ) : null}
                    </select>
                    {editingCashoutAmount ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value.replace(/[^\d.]/g, ""));
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }}
                        placeholder="Cash-out Amount"
                        className={`${fieldClass} ${errors.amount ? "border-theme-red-action/50" : ""}`}
                      />
                    ) : (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={receivingAmount}
                        onChange={(e) => {
                          setReceivingAmount(e.target.value.replace(/[^\d.]/g, ""));
                          setErrors((prev) => ({ ...prev, receivingAmount: undefined }));
                        }}
                        placeholder="Receiving Amount"
                        className={`${fieldClass} ${errors.receivingAmount ? "border-theme-red-action/50" : ""}`}
                      />
                    )}
                  </div>
                  {errors.amount || errors.receivingAmount ? (
                    <p className="mt-2 text-xs text-theme-red-action">
                      {errors.amount || errors.receivingAmount}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45">
                    {cashoutAccountPlaceholder(cashoutMethod?.name)}
                  </label>
                  <input
                    type="text"
                    value={cashoutAccountId}
                    onChange={(e) => {
                      setCashoutAccountId(e.target.value);
                      setErrors((prev) => ({ ...prev, cashoutAccountId: undefined }));
                    }}
                    placeholder={cashoutAccountPlaceholder(cashoutMethod?.name)}
                    className={`${fieldClass} ${errors.cashoutAccountId ? "border-theme-red-action/50" : ""}`}
                  />
                  {errors.cashoutAccountId ? (
                    <p className="mt-2 text-xs text-theme-red-action">{errors.cashoutAccountId}</p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-white/50">Receiving Amount</p>
                  <p className="mt-1 text-3xl font-bold text-theme-green-action">
                    {receivingCurrency}{" "}
                    {Number(receivingAmount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Cash-out: {cashoutCurrency}{" "}
                    {Number(amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-2xl border border-theme-green-action/25 bg-theme-green-dark p-5 text-white shadow-[0_16px_40px_rgba(20,83,91,0.35)]">
                  <p className="text-sm text-white/80">Daily Selling Rate per $1</p>
                  <p className="mt-1 text-xs text-white/55">{rateDate}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <ArrowLeftRight className="h-5 w-5 text-theme-green-shaded" />
                    <p className="text-2xl font-bold text-white">
                      {receivingCurrency} {selectedRate?.rate?.toFixed?.(2) ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={busy}
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
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
              <MethodIcon type={cashoutMethodIconKey(proofContext.withdrawal.cashout_method_name)} />
              <div>
                <p className="text-sm font-semibold text-white">{proofContext.withdrawal.cashout_method_name}</p>
                <p className="text-xs text-white/45">{proofContext.withdrawal.payment_option_name}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="border-t border-white/20 py-6">
              <p className="text-sm text-white/50">Receiving Amount</p>
              <p className="mt-1 text-3xl font-bold text-theme-green-action">
                {proofContext.withdrawal.receiving_amount_currency}{" "}
                {Number(proofContext.withdrawal.receiving_amount).toLocaleString(undefined, {
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
              <h2 className="text-lg font-bold text-white">
                {proofContext.withdrawal.cashout_method_name} Conditions
              </h2>
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                className="custom-scrollbar mt-4 max-h-[280px] space-y-3 overflow-y-auto overscroll-contain pr-1 text-sm leading-relaxed text-white/85"
              >
                {termsLines.length ? (
                  termsLines.map((line, index) => <p key={index}>* {line}</p>)
                ) : (
                  <p className="text-white/50">No terms available for this method.</p>
                )}
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

            <div className="mt-6">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                  Receiving Account
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddReceivingAccount((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/75 transition hover:border-theme-green-action/40 hover:text-theme-green-action"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add account
                </button>
              </div>
              <select
                value={receivingAccountSelection}
                onChange={(e) => {
                  setReceivingAccountSelection(e.target.value);
                  setErrors((prev) => ({ ...prev, receivingAccount: undefined }));
                }}
                className={`${fieldClass} ${errors.receivingAccount ? "border-theme-red-action/50" : ""}`}
              >
                <option value="" className="bg-[#141A2E]">
                  Select receiving account
                </option>
                {(proofContext.receiving_accounts || []).map((account) => (
                  <option
                    key={`${account.accountType}:${account.id}`}
                    value={`${account.accountType}:${account.id}`}
                    className="bg-[#141A2E]"
                  >
                    {account.label}
                  </option>
                ))}
              </select>
              {showAddReceivingAccount ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <AddPaymentAccountForm
                    compact
                    fixedAccountType={paymentOptionNameToAccountType(
                      proofContext.withdrawal?.payment_option_name,
                    )}
                    onCancel={() => setShowAddReceivingAccount(false)}
                    onSuccess={async (result) => {
                      const accountType = paymentOptionNameToAccountType(
                        proofContext.withdrawal?.payment_option_name,
                      );
                      const mapped = mapCreatedAccountToReceivingOption(
                        result.payment_option,
                        accountType,
                      );
                      if (mapped) {
                        setProofContext((prev) => ({
                          ...prev,
                          receiving_accounts: [...(prev.receiving_accounts || []), mapped],
                        }));
                        setReceivingAccountSelection(`${mapped.accountType}:${mapped.id}`);
                      } else if (withdrawalId) {
                        const refreshed = await fetchWithdrawalPaymentProofContext(withdrawalId);
                        setProofContext(refreshed);
                        const first = refreshed.receiving_accounts?.[0];
                        if (first) {
                          setReceivingAccountSelection(`${first.accountType}:${first.id}`);
                        }
                      }
                      setShowAddReceivingAccount(false);
                      setErrors((prev) => ({ ...prev, receivingAccount: undefined }));
                    }}
                  />
                </div>
              ) : null}
              {!proofContext.receiving_accounts?.length && !showAddReceivingAccount ? (
                <p className="mt-2 text-xs text-white/45">
                  No receiving accounts found for this payment option. Add one above or from{" "}
                  <a href="/dashboard/profile/accounts" className="text-theme-green-action hover:underline">
                    Payment Accounts
                  </a>
                  .
                </p>
              ) : null}
              {errors.receivingAccount ? (
                <p className="mt-2 text-xs text-theme-red-action">{errors.receivingAccount}</p>
              ) : null}
            </div>

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
                <a href="/support" className="font-medium text-theme-green-action hover:underline">
                  Terms and Conditions
                </a>
              </span>
            </label>
            {errors.terms ? <p className="mt-2 text-xs text-theme-red-action">{errors.terms}</p> : null}

            {submitted ? (
              <BottomMessage
                title="Cash-out submitted"
                variant="success"
                onClose={() => setSubmitted(false)}
                primaryAction={{ label: "View Transactions", href: "/dashboard/transactions" }}
                secondaryAction={{
                  label: "New Cash-out",
                  onClick: () => {
                    setSubmitted(false);
                    setStep(1);
                    setWithdrawalId(null);
                    setTransactionId("");
                    setProofContext(null);
                    setMethodDetails(null);
                    clearSlip();
                    setAcceptedTerms(false);
                    setCashoutAccountId("");
                    setReceivingAccountSelection("");
                  },
                }}
              >
                Your cash-out request has been submitted successfully. Transaction ID {transactionId} is now pending
                review.
              </BottomMessage>
            ) : null}
          </section>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={busy}
              className="rounded-xl border border-white/20 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
