"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createClientBonusVoucher,
  fetchVoucherTopupMethods,
} from "@/lib/loyalty-api";
import VoucherCountdown from "@/components/dashboard/voucher-countdown";
import VoucherViewModal from "@/components/dashboard/voucher-view-modal";
import { Eye, Sparkles, Ticket, X } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";

function StatusPill({ status }) {
  const normalized = String(status || "Pending");
  const styles =
    normalized === "Claimed"
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

function resolveToken(rowOrUrl) {
  if (!rowOrUrl) return "";
  if (typeof rowOrUrl === "string") {
    const parts = rowOrUrl.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
  return String(rowOrUrl.token || "").trim();
}

function VoucherRow({ row, onView }) {
  const token = resolveToken(row);
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#141A2E] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-white">{row.token}</p>
        <p className="mt-1 text-xs text-white/45">
          {row.createdAt} · {row.topupMethod} · Platform {row.platformId}
          {row.tierLabel ? ` · ${row.tierLabel}` : ""}
        </p>
        {row.validUntil ? (
          <p className="mt-0.5 text-[11px] text-white/35">Valid until {row.validUntil}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <VoucherCountdown
          expiresAt={row.expiresAt}
          createdAt={row.createdAt}
          status={row.status}
          compact
        />
        <StatusPill status={row.status} />
        {token ? (
          <button
            type="button"
            onClick={() => onView(token)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-theme-green-action hover:underline"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function ClaimClientBonus({
  clientBonusSummary = null,
  issuedVouchers = [],
  onIssued,
  compact = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [topupMethodId, setTopupMethodId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [topupMethods, setTopupMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [issuedToken, setIssuedToken] = useState("");
  const [viewToken, setViewToken] = useState("");

  const newTierBonus = clientBonusSummary?.new_tier_bonus || null;
  const canIssue = Boolean(clientBonusSummary?.can_issue);
  const remaining = Number(
    newTierBonus?.remaining ?? clientBonusSummary?.remaining_slots ?? 0,
  );
  const amount = Number(
    newTierBonus?.amount_per_client ?? clientBonusSummary?.amount_per_client ?? 0,
  ).toFixed(2);
  const tierLabel = (
    newTierBonus?.label ||
    (clientBonusSummary?.tier
      ? clientBonusSummary.tier.charAt(0).toUpperCase() + clientBonusSummary.tier.slice(1)
      : "Partner")
  );
  const currentTierKey = String(newTierBonus?.tier || clientBonusSummary?.tier || "").toLowerCase();

  const { currentTierVouchers, earlierTierVouchers } = useMemo(() => {
    if (!currentTierKey) {
      return { currentTierVouchers: issuedVouchers, earlierTierVouchers: [] };
    }
    const current = [];
    const earlier = [];
    for (const row of issuedVouchers) {
      const tier = String(row.tier || "").toLowerCase();
      if (tier && tier === currentTierKey) current.push(row);
      else if (tier && tier !== currentTierKey) earlier.push(row);
      else current.push(row);
    }
    return { currentTierVouchers: current, earlierTierVouchers: earlier };
  }, [issuedVouchers, currentTierKey]);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;

    async function loadMethods() {
      setLoadingMethods(true);
      setError("");
      try {
        const data = await fetchVoucherTopupMethods();
        if (!cancelled) {
          setTopupMethods(data.topup_methods || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load topup methods.");
        }
      } finally {
        if (!cancelled) setLoadingMethods(false);
      }
    }

    loadMethods();
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIssuedToken("");

    if (!topupMethodId) {
      setError("Please select a topup method.");
      return;
    }

    const value = platformId.trim();
    if (!value) {
      setError("Platform ID is required.");
      return;
    }
    if (!/^\d{7,9}$/.test(value)) {
      setError("Platform ID must be 7–9 digits.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createClientBonusVoucher({
        topup_method_id: Number(topupMethodId),
        platform_id: value,
      });
      const token = String(result.voucher_token || resolveToken(result.voucher_url) || "");
      setSuccess(result.message || "Client bonus voucher issued successfully.");
      setIssuedToken(token);
      setPlatformId("");
      setTopupMethodId("");
      onIssued?.(result);
    } catch (err) {
      if (err.data?.code === "VERIFICATION_REQUIRED") {
        setError("Complete account verification before issuing a client bonus voucher.");
      } else {
        setError(err.message || "Failed to issue client bonus voucher.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openClaimModal() {
    setOpen(true);
    setError("");
    setSuccess("");
    setIssuedToken("");
  }

  if (!canIssue && !issuedVouchers.length && !newTierBonus && compact) {
    return null;
  }

  return (
    <div className={className}>
      {newTierBonus ? (
        <section className="rounded-2xl border border-theme-orange/35 bg-gradient-to-br from-theme-orange/15 via-[#0B1020] to-[#141A2E] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-orange/15 ring-1 ring-theme-orange/35">
                <Sparkles className="h-6 w-6 text-theme-orange" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-white">
                    {newTierBonus.headline || `New ${tierLabel} Client Bonus`}
                  </h2>
                  <span className="rounded-full bg-theme-orange/20 px-2.5 py-0.5 text-[11px] font-semibold text-theme-orange">
                    New upgrade
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/55">
                  {newTierBonus.message ||
                    `Unlocked with your ${tierLabel} upgrade · USD ${amount} each · ${remaining} remaining.`}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Separate from Claim My Bonus. Issue printable vouchers for client deposits
                  {newTierBonus.unlocked_at ? ` · Unlocked ${newTierBonus.unlocked_at}` : ""}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openClaimModal}
              className="shrink-0 rounded-xl bg-theme-orange px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Claim {tierLabel} vouchers{remaining > 0 ? ` · ${remaining}` : ""}
            </button>
          </div>
          {success ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-theme-green-action">{success}</p>
              {issuedToken ? (
                <button
                  type="button"
                  onClick={() => setViewToken(issuedToken)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-theme-green-action hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View voucher
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : canIssue ? (
        <section className="rounded-2xl border border-theme-green-action/25 bg-gradient-to-br from-theme-green-action/10 via-[#0B1020] to-[#141A2E] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30">
                <Ticket className="h-6 w-6 text-theme-green-action" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">Claim Client Bonus</h2>
                <p className="mt-1 text-sm text-white/55">
                  Issue a printable voucher for your client. {tierLabel} tier · USD {amount} each ·{" "}
                  <span className="font-semibold text-theme-green-action">{remaining}</span> remaining.
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Choose topup method and platform ID, then share the voucher with your client for deposit redemption.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openClaimModal}
              className="shrink-0 rounded-xl bg-theme-green-action px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Claim Client Bonus{remaining > 0 ? ` · ${remaining}` : ""}
            </button>
          </div>
          {success ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-theme-green-action">{success}</p>
              {issuedToken ? (
                <button
                  type="button"
                  onClick={() => setViewToken(issuedToken)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-theme-green-action hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View voucher
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : !compact ? (
        <section className="rounded-2xl border border-white/12 bg-[#141A2E] px-5 py-4">
          <p className="text-sm text-white/55">
            <span className="font-medium text-white">Client bonus vouchers:</span> Not available for your current tier or all slots have been used.
          </p>
        </section>
      ) : null}

      {!compact && currentTierVouchers.length > 0 ? (
        <section className="mt-5 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-white">
            {currentTierKey ? `${tierLabel} tier vouchers` : "Recently issued vouchers"}
          </h3>
          <div className="mt-4 space-y-3">
            {currentTierVouchers.slice(0, 5).map((row) => (
              <VoucherRow key={row.id} row={row} onView={setViewToken} />
            ))}
          </div>
        </section>
      ) : null}

      {!compact && earlierTierVouchers.length > 0 ? (
        <section className="mt-5 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-white">Earlier tier vouchers</h3>
          <p className="mt-1 text-xs text-white/40">
            Vouchers issued before your latest level upgrade.
          </p>
          <div className="mt-4 space-y-3">
            {earlierTierVouchers.slice(0, 5).map((row) => (
              <VoucherRow key={row.id} row={row} onView={setViewToken} />
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
            aria-label={newTierBonus ? `Claim ${tierLabel} Client Bonus` : "Claim Client Bonus"}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {newTierBonus ? `Claim ${tierLabel} Client Bonus` : "Claim Client Bonus"}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  Voucher amount: USD {amount} · {remaining} slot{remaining === 1 ? "" : "s"} left
                </p>
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
                <label className="mb-2 block text-sm font-medium text-white/70">Topup method</label>
                <select
                  value={topupMethodId}
                  onChange={(e) => {
                    setTopupMethodId(e.target.value);
                    setError("");
                  }}
                  className={fieldClass}
                  disabled={loadingMethods || submitting}
                >
                  <option value="" className="bg-[#141A2E]">
                    {loadingMethods ? "Loading methods…" : "Select topup method"}
                  </option>
                  {topupMethods.map((method) => (
                    <option key={method.id} value={method.id} className="bg-[#141A2E]">
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Platform ID</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={platformId}
                  onChange={(e) => {
                    setPlatformId(e.target.value.replace(/\D/g, "").slice(0, 9));
                    setError("");
                  }}
                  placeholder="Enter platform ID (7–9 digits)"
                  className={fieldClass}
                  disabled={submitting}
                />
              </div>

              {error ? <p className="text-sm text-theme-red-action">{error}</p> : null}
              {success ? (
                <div className="space-y-2">
                  <p className="text-sm text-theme-green-action">{success}</p>
                  {issuedToken ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setViewToken(issuedToken);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-theme-green-action hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View printable voucher
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
                >
                  {success ? "Close" : "Cancel"}
                </button>
                {!success ? (
                  <button
                    type="submit"
                    disabled={submitting || loadingMethods}
                    className="rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? "Issuing…" : "Issue voucher"}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <VoucherViewModal
        open={Boolean(viewToken)}
        token={viewToken}
        onClose={() => setViewToken("")}
      />
    </div>
  );
}
