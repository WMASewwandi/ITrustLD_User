"use client";

import Link from "next/link";
import {
  getMembershipProgress,
  getYearlyTrustPoints,
  resolveCurrentLoyaltyTier,
} from "@/lib/membership-tiers";
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Trophy,
} from "lucide-react";

const STATUS_STYLE = {
  Completed: "text-theme-green-action bg-theme-green-action/10 border-theme-green-action/25",
  "In-Progress": "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Pending: "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Rejected: "text-theme-red-action bg-theme-red-action/10 border-theme-red-action/25",
};

function formatPhone(mobile) {
  if (!mobile) return "—";
  return mobile;
}

function formatPendingLabel(deposits, withdrawals) {
  const parts = [];
  if (deposits > 0) {
    parts.push(`${deposits} top-up${deposits === 1 ? "" : "s"}`);
  }
  if (withdrawals > 0) {
    parts.push(`${withdrawals} cash-out${withdrawals === 1 ? "" : "s"}`);
  }
  return parts.length ? parts.join(", ") : "None";
}

function formatRate(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatRateDate(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw || "Today";
  const [year, month, day] = raw.slice(0, 10).split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[Number(month) - 1] || month;
  return `${Number(day)} ${monthName} ${year}`;
}

export default function AccountOverview({
  user,
  documents = [],
  verificationComplete = false,
  todayRates = null,
}) {
  const points = getYearlyTrustPoints(user);
  const progressPoints = points;
  const officialTier = resolveCurrentLoyaltyTier(user, progressPoints);
  const { current, next, remaining, progressPct } = getMembershipProgress(
    progressPoints,
    officialTier,
  );
  const nextTier = next?.name || current.name;
  const progress = progressPct;
  const userType = user?.user_type === "partner" ? "partner" : "normal";
  const savedBanks = Number(user?.saved_banks_count) || 0;
  const pendingDeposits = Number(user?.pending_deposits_count) || 0;
  const pendingWithdrawals = Number(user?.pending_withdrawals_count) || 0;
  const phone = formatPhone(user?.account_holder?.mobile_number);
  const rateMethods = Array.isArray(todayRates?.methods) ? todayRates.methods : [];
  const rateDateLabel = formatRateDate(todayRates?.date);
  const rateCurrency = rateMethods.find((item) => item.currency)?.currency || "";
  const docs = documents.length
    ? documents
    : [
        { name: "National ID (Front)", status: "Pending" },
        { name: "National ID (Back)", status: "Pending" },
        { name: "Proof of Address", status: "Pending" },
      ];

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-2 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <Trophy className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">Trust Points</h2>
                <p className="truncate text-xs text-white/45">Loyalty tier progression</p>
              </div>
            </div>
            <Link
              href="/dashboard/loyalty"
              className="shrink-0 pt-0.5 text-xs font-medium text-white hover:underline"
            >
              View
            </Link>
          </div>

          <div className="mb-1 flex min-w-0 items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-white/40">Current tier</p>
              <span className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                {current.name}
              </span>
            </div>
            <p className="shrink-0 text-right">
              <span className="block text-xs text-white/40">Last 12 months</span>
              <span className="text-base font-semibold text-white sm:text-lg">
                {points.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="mt-4 min-w-0">
            <div className="mb-2 flex justify-between gap-2 text-xs text-white/50">
              <span className="min-w-0 truncate">Progress to {nextTier}</span>
              <span className="shrink-0">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-white to-theme-green-action"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 break-words text-xs text-white/40">
              {next
                ? `Need ${remaining.toLocaleString()} more points for ${nextTier}`
                : "Max membership tier reached"}
            </p>
          </div>
        </article>

        <article className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <ArrowLeftRight className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">Today&apos;s Rates</h2>
                <p className="truncate text-xs text-white/45">
                  {rateCurrency ? `Buy & sell per $1 · ${rateCurrency}` : "Allowed methods"}
                </p>
              </div>
            </div>
            <span className="shrink-0 pt-0.5 text-xs text-white/45">{rateDateLabel}</span>
          </div>

          {rateMethods.length === 0 ? (
            <p className="rounded-xl border border-white/8 bg-black/20 px-3 py-6 text-center text-xs text-white/45">
              No rates are available yet.
            </p>
          ) : (
            <div className="min-h-0 min-w-0 flex-1">
              <div className="mb-2 grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                <span>Method</span>
                <span className="text-right">Buy</span>
                <span className="text-right">Sell</span>
              </div>
              <ul className="max-h-[13.5rem] space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {rateMethods.map((item) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] items-center gap-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2"
                  >
                    <span className="min-w-0 truncate text-sm text-white/85">{item.name}</span>
                    <span className="text-right text-xs font-semibold text-theme-green-action">
                      {formatRate(item.buyRate ?? item.buy_rate)}
                    </span>
                    <span className="text-right text-xs font-semibold text-[#FB7185]">
                      {formatRate(item.sellRate ?? item.sell_rate)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">Document Verification</h2>
                <p className="truncate text-xs text-white/45">KYC status overview</p>
              </div>
            </div>
            <Link
              href="/dashboard/documents"
              className="shrink-0 pt-0.5 text-xs font-medium text-theme-green-action hover:underline"
            >
              Manage
            </Link>
          </div>

          {!verificationComplete ? (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-theme-green-shaded/25 bg-theme-green-shaded/10 px-3 py-2.5 text-xs text-theme-green-shaded">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 leading-relaxed">
                Complete verification to unlock all top-up methods.
              </span>
            </div>
          ) : (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-theme-green-action/25 bg-theme-green-action/10 px-3 py-2.5 text-xs text-theme-green-action">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 leading-relaxed">Your account verification is complete.</span>
            </div>
          )}

          <ul className="space-y-2.5">
            {docs.map((doc) => (
              <li
                key={doc.key || doc.name}
                className="flex min-w-0 items-center gap-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-white/80">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-white/40" />
                  <span className="truncate">{doc.name}</span>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[doc.status] || STATUS_STYLE.Pending}`}
                >
                  {doc.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">Account Snapshot</h2>
              <p className="text-xs text-white/45">Saved banks & profile</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">User type</dt>
              <dd className="font-medium text-white">
                {userType === "partner" ? "Partner" : "Normal User"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Saved banks</dt>
              <dd className="font-medium text-white">
                {savedBanks} account{savedBanks === 1 ? "" : "s"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Pending requests</dt>
              <dd
                className={`inline-flex items-center gap-1.5 font-medium ${
                  pendingDeposits + pendingWithdrawals > 0
                    ? "text-theme-green-shaded"
                    : "text-white/70"
                }`}
              >
                {pendingDeposits + pendingWithdrawals > 0 ? (
                  <Clock3 className="h-3.5 w-3.5" />
                ) : null}
                {formatPendingLabel(pendingDeposits, pendingWithdrawals)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-white/45">Phone</dt>
              <dd className="font-medium text-white">{phone}</dd>
            </div>
          </dl>

          <Link
            href="/dashboard/profile"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Open My Profile
          </Link>
        </article>
      </div>
    </section>
  );
}
