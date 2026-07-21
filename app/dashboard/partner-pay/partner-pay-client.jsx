"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BottomMessage from "@/components/dashboard/bottom-message";
import { ArrowLeft, CheckCircle2, Trash2, Upload } from "lucide-react";

export default function PartnerPayPage() {
  const params = useSearchParams();
  const partnerUserId = params.get("partnerUserId") || params.get("accountId") || "PARTNER-88421";
  const amount = params.get("amount") || "150.00";
  const currency = params.get("currency") || "USD";
  const token = params.get("token") || "demo-signed-token";
  const returnUrl = params.get("returnUrl") || "#";

  const [slip, setSlip] = useState("");
  const [slipPreview, setSlipPreview] = useState("");
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState("");

  const referenceId = useMemo(() => `ITLD-${Date.now().toString().slice(-8)}`, []);
  const supportedCurrencies = ["USD", "EUR", "GBP"];

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  function clearSlip() {
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlip("");
    setSlipPreview("");
  }

  function handleSlipChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlip(file.name);
    if (file.type.startsWith("image/")) {
      setSlipPreview(URL.createObjectURL(file));
    } else {
      setSlipPreview("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      setStatus("error");
      setError("Invalid Currency — only currencies configured in iTrustLD are supported.");
      return;
    }
    if (!token) {
      setStatus("error");
      setError("Expired Token — please restart payment from the partner platform.");
      return;
    }
    if (!slip) {
      setError("Please upload a payment slip.");
      return;
    }

    setStatus("pending");
    setTimeout(() => setStatus("completed"), 900);
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-theme-green-action"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="rounded-2xl border border-white/12 bg-[#0B1020]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">
          Partner payment
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Final Payment Step</h1>
        <p className="mt-2 text-sm text-white/50">
          Transaction data loaded from Partner Platform API. Amount and currency are locked.
        </p>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Partner User / Account ID", partnerUserId],
            ["Top-up Amount", `${currency.toUpperCase()} ${amount}`],
            ["Currency", currency.toUpperCase()],
            ["Reference ID", referenceId],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-white/40">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
            </div>
          ))}
        </dl>

        {status === "ready" || status === "error" ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Upload payment slip *</label>
              {!slip ? (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:border-white/35">
                  <Upload className="h-4 w-4" />
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleSlipChange}
                  />
                </label>
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-theme-green-action/25 bg-theme-green-action/10 p-3">
                  {slipPreview ? (
                    <img
                      src={slipPreview}
                      alt="Payment slip preview"
                      className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  ) : null}
                  <p className="min-w-0 flex-1 truncate text-sm text-theme-green-action">{slip}</p>
                  <button
                    type="button"
                    onClick={clearSlip}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
            {error ? (
              <BottomMessage
                title="Payment error"
                variant="error"
                onClose={() => setError("")}
                primaryAction={{ label: "Try Again", onClick: () => setError("") }}
                secondaryAction={{ label: "Close", onClick: () => setError("") }}
              >
                {error}
              </BottomMessage>
            ) : null}
            <button
              type="submit"
              className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,255,255,0.08)] transition hover:bg-white/30"
            >
              Submit payment
            </button>
          </form>
        ) : null}

        {status === "pending" ? (
          <BottomMessage
            title="Payment pending"
            variant="warning"
            onClose={() => setStatus("ready")}
            primaryAction={{ label: "OK", onClick: () => {} }}
            secondaryAction={{ label: "Close", onClick: () => setStatus("ready") }}
          >
            Status: Pending — payment submitted, awaiting confirmation…
          </BottomMessage>
        ) : null}

        {status === "completed" ? (
          <BottomMessage
            title="Payment completed"
            variant="success"
            onClose={() => setStatus("ready")}
            primaryAction={{
              label: "Back to Partner",
              href: returnUrl === "#" ? "/dashboard" : returnUrl,
            }}
            secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-theme-green-action" />
              <div>
                <p className="font-semibold text-white">Status: Completed</p>
                <p className="mt-1 text-sm text-white/60">
                  Reference ID {referenceId} · Amount {currency} {amount}
                </p>
              </div>
            </div>
          </BottomMessage>
        ) : null}
      </div>
    </div>
  );
}
