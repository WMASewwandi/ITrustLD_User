"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";

export default function PartnerPayPage() {
  const params = useSearchParams();
  const partnerUserId = params.get("partnerUserId") || params.get("accountId") || "PARTNER-88421";
  const amount = params.get("amount") || "150.00";
  const currency = params.get("currency") || "USD";
  const token = params.get("token") || "demo-signed-token";
  const returnUrl = params.get("returnUrl") || "#";

  const [slip, setSlip] = useState("");
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState("");

  const referenceId = useMemo(() => `ITLD-${Date.now().toString().slice(-8)}`, []);
  const supportedCurrencies = ["USD", "EUR", "GBP"];

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
            ["Deposit Amount", `${currency.toUpperCase()} ${amount}`],
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
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:border-white/35">
                <Upload className="h-4 w-4" />
                {slip || "Choose file"}
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setSlip(e.target.files?.[0]?.name || "")}
                />
              </label>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              className="rounded-xl bg-theme-green-action px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Submit payment
            </button>
          </form>
        ) : null}

        {status === "pending" ? (
          <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            Status: Pending — payment submitted, awaiting confirmation…
          </p>
        ) : null}

        {status === "completed" ? (
          <div className="mt-6 rounded-xl border border-theme-green-action/30 bg-theme-green-action/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-theme-green-action" />
              <div>
                <p className="font-semibold text-theme-green-action">Status: Completed</p>
                <p className="mt-1 text-sm text-white/60">
                  Redirect response: Reference ID {referenceId} · Status Completed · Amount {currency} {amount}
                </p>
                <a
                  href={returnUrl === "#" ? "/dashboard" : returnUrl}
                  className="mt-3 inline-flex text-sm font-medium text-white underline-offset-4 hover:underline"
                >
                  Redirect back to Partner Platform
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
