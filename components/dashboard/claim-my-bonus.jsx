"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VoucherCountdown, { VOUCHER_VALIDITY_DAYS } from "@/components/dashboard/voucher-countdown";
import {
  createBonusClaim,
  decodeReceivingAccountOption,
  flattenAccountGroups,
} from "@/lib/loyalty-api";
import { getUserSession } from "@/lib/auth";
import { fetchPaymentAccounts } from "@/lib/payment-accounts";
import { Gift, X } from "lucide-react";

function getClaimBonusDeadlineKey(userId) {
  return `itrustld.claim-bonus.expiresAt.${userId || "anon"}`;
}

/** 30-day claim window once the bonus becomes available (same length as voucher validity). */
function useClaimBonusDeadline(available) {
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const session = getUserSession();
    const userId =
      session?.id || session?.user_id || session?.account_holder?.user_id || "anon";
    const key = getClaimBonusDeadlineKey(userId);

    if (!available) {
      window.localStorage.removeItem(key);
      setExpiresAt(null);
      return undefined;
    }

    let stored = window.localStorage.getItem(key);
    if (!stored) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + VOUCHER_VALIDITY_DAYS);
      stored = deadline.toISOString();
      window.localStorage.setItem(key, stored);
    }
    setExpiresAt(stored);
    return undefined;
  }, [available]);

  return expiresAt;
}

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";

function StatusPill({ status }) {
  const normalized = String(status || "Pending");
  const styles =
    normalized === "Claimed" || normalized === "Completed"
      ? "bg-theme-green-action/20 text-theme-green-action"
      : normalized === "Rejected"
        ? "bg-theme-red-action/20 text-theme-red-action"
        : "bg-theme-orange/20 text-theme-orange";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {normalized}
    </span>
  );
}

export default function ClaimMyBonus({
  bonusSummary = null,
  claimHistory = [],
  onClaimed,
  compact = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const available = Boolean(bonusSummary?.available);
  const amount = bonusSummary?.amount_display || Number(bonusSummary?.amount || 0).toFixed(2);
  const claimDeadline = useClaimBonusDeadline(available);
  const validUntilLabel = claimDeadline
    ? new Date(claimDeadline).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;

    async function loadAccounts() {
      setLoadingAccounts(true);
      setError("");
      try {
        const data = await fetchPaymentAccounts();
        if (!cancelled) {
          setAccounts(flattenAccountGroups(data.account_groups || []));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load payment accounts.");
        }
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    }

    loadAccounts();
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!account) {
      setError("Please select an account to receive your bonus.");
      return;
    }

    const { accountId, accountType } = decodeReceivingAccountOption(account);
    setSubmitting(true);
    try {
      const result = await createBonusClaim({
        selected_account_id: accountId,
        selected_account_type: accountType,
      });
      setSuccess(result.message || "Bonus claim submitted successfully.");
      setOpen(false);
      setAccount("");
      onClaimed?.(result);
    } catch (err) {
      if (err.data?.code === "VERIFICATION_REQUIRED") {
        setError("Complete account verification before claiming a bonus.");
      } else {
        setError(err.message || "Failed to submit bonus claim.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!available && !claimHistory.length && compact) {
    return null;
  }

  return (
    <div className={className}>
      {available ? (
        <section className="rounded-2xl border border-theme-green-action/25 bg-gradient-to-br from-theme-green-action/10 via-[#0B1020] to-[#141A2E] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30">
                <Gift className="h-6 w-6 text-theme-green-action" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">Claim My Bonus</h2>
                <p className="mt-1 text-sm text-white/55">
                  You are eligible for a welcome loyalty bonus of{" "}
                  <span className="font-semibold text-theme-green-action">USD {amount}</span>.
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Requires more than {bonusSummary?.min_points_required ?? 201} Trust Points. Payout goes to your saved account after admin approval.
                </p>
                {validUntilLabel ? (
                  <p className="mt-1 text-[11px] text-white/35">Valid until {validUntilLabel}</p>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              {claimDeadline ? (
                <VoucherCountdown
                  expiresAt={claimDeadline}
                  status="Pending"
                  footerLabel="to claim bonus"
                />
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setError("");
                  setSuccess("");
                }}
                className="rounded-xl bg-theme-green-action px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Claim My Bonus
              </button>
            </div>
          </div>
          {success ? <p className="mt-4 text-sm font-medium text-theme-green-action">{success}</p> : null}
        </section>
      ) : bonusSummary?.reason && !compact ? (
        <section className="rounded-2xl border border-white/12 bg-[#141A2E] px-5 py-4">
          <p className="text-sm text-white/55">
            <span className="font-medium text-white">Bonus:</span> {bonusSummary.reason}
          </p>
        </section>
      ) : null}

      {!compact && claimHistory.length > 0 ? (
        <section className="mt-5 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-white">My bonus claims</h3>
          <div className="mt-4 space-y-3">
            {claimHistory.slice(0, 5).map((row) => (
              <article
                key={row.id}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#141A2E] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">Bonus claim · {row.id}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {row.date} · {row.method} · {row.received}
                  </p>
                </div>
                <StatusPill status={row.status} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-lg rounded-2xl border border-white/12 bg-[#0B1020] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Claim My Bonus"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">Claim My Bonus</h3>
                <p className="mt-1 text-sm text-white/50">Bonus amount: USD {amount}</p>
                {claimDeadline ? (
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <VoucherCountdown
                      expiresAt={claimDeadline}
                      status="Pending"
                      compact
                    />
                    {validUntilLabel ? (
                      <span className="text-[11px] text-white/40">Valid until {validUntilLabel}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Payment account</label>
                <select
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    setError("");
                  }}
                  className={fieldClass}
                  disabled={loadingAccounts || submitting}
                >
                  <option value="" className="bg-[#141A2E]">
                    {loadingAccounts ? "Loading accounts…" : "Select your account"}
                  </option>
                  {accounts.map((item) => (
                    <option key={item.value} value={item.value} className="bg-[#141A2E]">
                      {item.label}
                    </option>
                  ))}
                </select>
                <Link
                  href="/dashboard/profile/accounts"
                  className="mt-2 inline-block text-xs text-theme-green-action hover:underline"
                >
                  Manage saved accounts
                </Link>
              </div>

              {error ? <p className="text-sm text-theme-red-action">{error}</p> : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingAccounts}
                  className="rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
