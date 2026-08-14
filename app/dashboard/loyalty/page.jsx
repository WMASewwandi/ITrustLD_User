"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AffiliateLinkCard from "@/components/dashboard/affiliate-link-card";
import BottomMessage from "@/components/dashboard/bottom-message";
import ClaimGift from "@/components/dashboard/claim-gift";
import ClaimMyBonus from "@/components/dashboard/claim-my-bonus";
import ListFilters from "@/components/dashboard/list-filters";
import LoyaltyLevels from "@/components/dashboard/loyalty-levels";
import PartnerLoyaltyPanel from "@/components/dashboard/partner-loyalty-panel";
import { hasUserSession, patchUserSessionAccountHolder } from "@/lib/auth";
import { inDateRange, rowMatchesSearch } from "@/lib/filter-utils";
import {
  createLoyaltyWithdrawal,
  decodeReceivingAccountOption,
  fetchBonusClaims,
  fetchLoyaltySummary,
  fetchLoyaltyWithdrawals,
  flattenAccountGroups,
  mapBonusClaimRows,
  mapWithdrawalRows,
} from "@/lib/loyalty-api";
import { fetchPaymentAccounts } from "@/lib/payment-accounts";
import { getPartnerTiers } from "@/lib/loyalty";
import { getMembershipProgress } from "@/lib/membership-tiers";
import { useMembershipTiers } from "@/hooks/use-membership-tiers";
import { Medal, Star, Trophy } from "lucide-react";

const HISTORY_FILTER_DEFAULTS = {
  search: "",
  status: "All Statuses",
  from: "",
  to: "",
};

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-[#0B1020]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";

export default function LoyaltyPage() {
  const router = useRouter();
  const [section, setSection] = useState("overview"); // overview | withdraw
  const [withdrawTab, setWithdrawTab] = useState("withdraw"); // withdraw | history
  const [points, setPoints] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [usdValue, setUsdValue] = useState("0.00");
  const [rateLabel, setRateLabel] = useState("($) 10,000 Trust Points = 10 USD");
  const [minPoints, setMinPoints] = useState(10000);
  const [levelProgress, setLevelProgress] = useState(0);
  const [trustPointsForTier, setTrustPointsForTier] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isPartner, setIsPartner] = useState(false);
  const [hasAffiliateLink, setHasAffiliateLink] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState("");
  const [partnerTier, setPartnerTier] = useState("Normal");
  const [partnerPoints, setPartnerPoints] = useState(0);
  const [partnerProgress, setPartnerProgress] = useState(null);
  const [partnerTiers, setPartnerTiers] = useState([]);
  const [tierLabel, setTierLabel] = useState("Normal");
  const [bonusSummary, setBonusSummary] = useState(null);
  const [bonusClaims, setBonusClaims] = useState([]);
  const [historyFilter, setHistoryFilter] = useState(HISTORY_FILTER_DEFAULTS);
  const { tiers: membershipTiers } = useMembershipTiers();

  const tierDisplay = useMemo(() => {
    if (partnerProgress?.current_tier) {
      const current =
        membershipTiers.find(
          (tier) => tier.name.toLowerCase() === String(partnerProgress.current_tier).toLowerCase(),
        ) || membershipTiers[0];
      const next = partnerProgress.next_tier
        ? membershipTiers.find(
            (tier) => tier.name.toLowerCase() === String(partnerProgress.next_tier).toLowerCase(),
          ) || null
        : null;
      return {
        current,
        next,
        currentPts: Number(partnerProgress.period_points ?? trustPointsForTier) || 0,
        remaining: Number(partnerProgress.points_to_next) || 0,
        progressPct: Math.min(100, Math.max(0, Number(partnerProgress.progress_percentage) || 0)),
      };
    }

    const membership = getMembershipProgress(trustPointsForTier, tierLabel, membershipTiers);
    return {
      current: membership.current,
      next: membership.next,
      currentPts: membership.currentPts,
      remaining: membership.remaining,
      progressPct: Math.min(
        100,
        Math.max(0, Number(levelProgress) || membership.progressPct),
      ),
    };
  }, [partnerProgress, trustPointsForTier, tierLabel, levelProgress, membershipTiers]);

  const currentTier = tierDisplay.current;
  const nextTier = tierDisplay.next;
  const pointsToNext = tierDisplay.remaining;
  const currentLevel = `${currentTier.name} Level`;
  const safeLevelProgress = tierDisplay.progressPct;

  const filteredHistory = useMemo(() => {
    return withdrawalHistory.filter((row) => {
      if (!rowMatchesSearch(row, historyFilter.search, ["id", "points", "amount", "date", "status"])) {
        return false;
      }
      if (historyFilter.status !== "All Statuses" && row.status !== historyFilter.status) return false;
      if (!inDateRange(row.date, historyFilter.from, historyFilter.to)) return false;
      return true;
    });
  }, [historyFilter, withdrawalHistory]);

  const loadLoyaltyData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, accountsData, historyData, bonusClaimsData] = await Promise.all([
        fetchLoyaltySummary(),
        fetchPaymentAccounts(),
        fetchLoyaltyWithdrawals({ perPage: 50 }),
        fetchBonusClaims({ perPage: 10 }),
      ]);

      const pointSummary = summaryData.point_summary || {};
      setAvailableBalance(Math.floor(Number(pointSummary.remaining) || 0));
      setTotalEarned(Number(pointSummary.earned) || 0);
      setUsdValue(Number(summaryData.usd_value_of_earned || 0).toFixed(2));
      setRateLabel(summaryData.rate_label || "($) 10,000 Trust Points = 10 USD");
      setMinPoints(Number(summaryData.minimum_points) || 10000);
      setLevelProgress(Number(pointSummary.percentage) || 0);
      setTierLabel(pointSummary.level_label || "Normal");
      setTrustPointsForTier(Number(pointSummary.earned_for_year ?? pointSummary.earned) || 0);
      setIsPartner(Boolean(summaryData.is_partner));
      setAffiliateCode(summaryData.affiliate_code || "");
      setHasAffiliateLink(Boolean(summaryData.has_affiliate_link || summaryData.affiliate_code));
      setPartnerTier(
        summaryData.partner_tier || pointSummary.level_label || (summaryData.is_partner ? "Normal" : "Normal"),
      );
      setPartnerPoints(Number(pointSummary.earned_for_year ?? pointSummary.earned) || 0);
      setPartnerProgress(summaryData.partner_progress || null);
      setBonusSummary(summaryData.bonus_summary || null);
      setBonusClaims(mapBonusClaimRows(bonusClaimsData.claims || []));
      if (summaryData.partner_progress?.tiers?.length) {
        setPartnerTiers(summaryData.partner_progress.tiers);
      }
      patchUserSessionAccountHolder({
        is_patner: summaryData.is_partner ? "YES" : "NO",
        affiliate_code: summaryData.affiliate_code || null,
      });
      setAccounts(flattenAccountGroups(accountsData.account_groups || []));
      setWithdrawalHistory(mapWithdrawalRows(historyData.transactions || []));
    } catch (err) {
      if (err.data?.code === "VERIFICATION_REQUIRED" || err.message?.includes("verification")) {
        router.replace("/verify");
        return;
      }
      setError(err.message || "Failed to load loyalty data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }
    setPartnerTiers(getPartnerTiers());
    loadLoyaltyData();
  }, [loadLoyaltyData, router]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeLevelProgress / 100) * circumference;

  function openWithdraw() {
    setSection("withdraw");
    setWithdrawTab("withdraw");
    setError("");
    setSuccess("");
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    setSuccess("");
    const amount = Number(points);

    if (!/^\d+$/.test(points) || amount <= 0) {
      setError("Enter a valid number of points (digits only).");
      return;
    }
    if (availableBalance < minPoints) {
      setError(
        `Minimum of ${minPoints.toLocaleString()} loyalty points required to make a withdrawal request.`,
      );
      return;
    }
    if (amount < minPoints) {
      setError(`Minimum of ${minPoints.toLocaleString()} points has to be withdrawn.`);
      return;
    }
    if (amount > availableBalance) {
      setError(
        `You cannot withdraw an amount exceeding your existing point balance. Your point balance is ${availableBalance}.`,
      );
      return;
    }
    if (!account) {
      setError("Please select an account to cash out to.");
      return;
    }

    const { accountId, accountType } = decodeReceivingAccountOption(account);
    setSubmitting(true);
    setError("");

    try {
      const result = await createLoyaltyWithdrawal({
        withdrawal_point_amount: amount,
        selected_account_id: accountId,
        selected_account_type: accountType,
      });

      if (result.remaining_points != null) {
        setAvailableBalance(Math.floor(Number(result.remaining_points) || 0));
      } else {
        setAvailableBalance((prev) => Math.max(0, prev - amount));
      }

      setSuccess(
        result.message ||
          "Withdrawal request has been submitted successfully. This process may take up to 24 hours.",
      );
      setPoints("");
      setAccount("");

      const historyData = await fetchLoyaltyWithdrawals({ perPage: 50 });
      setWithdrawalHistory(mapWithdrawalRows(historyData.transactions || []));
    } catch (err) {
      if (err.data?.code === "VERIFICATION_REQUIRED" || err.message?.includes("verification")) {
        router.replace("/verify");
        return;
      }
      setError(err.message || "Failed to submit withdrawal request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Loyalty Points</h1>
          <p className="mt-2 text-sm text-white/50">
            Track Trust Points, tiers, and redeem loyalty cash to a saved account.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSection("overview")}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              section === "overview"
                ? "bg-white/20 text-white"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={openWithdraw}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              section === "withdraw"
                ? "bg-white/20 text-white"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Loyalty Cash-out
          </button>
        </div>
      </div>

      {section === "overview" && isPartner ? (
        <div className="mt-8">
          <PartnerLoyaltyPanel
            affiliateCode={affiliateCode}
            partnerTier={partnerTier}
            partnerPoints={partnerPoints}
            partnerProgress={partnerProgress}
            tiers={partnerTiers}
          />
        </div>
      ) : null}

      {section === "overview" ? (
        <div
          className={`${isPartner ? "mt-2" : "mt-8"} grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-6`}
        >
          <div className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
                  <div className="absolute inset-0 rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30" />
                  <Trophy className="relative h-7 w-7 text-theme-green-action drop-shadow-[0_0_16px_rgba(13,159,27,0.5)] sm:h-8 sm:w-8" />
                  <Star className="absolute -right-1 -top-1 h-4 w-4 fill-theme-green-action text-theme-green-action" />
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
                  <div className="min-w-0">
                    <p className="text-sm text-white/50">Available Balance</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {availableBalance.toLocaleString()}
                    </p>
                  </div>

                  <div className="hidden h-16 w-px bg-white/10 sm:block" />

                  <div className="min-w-0">
                    <p className="text-sm text-white/50">Total Earned Points</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {totalEarned.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-white/45">{usdValue} USD</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full rounded-xl bg-theme-green-dark px-4 py-4 text-center text-sm font-semibold text-white shadow-[0_12px_28px_rgba(20,83,91,0.35)] sm:px-5 sm:text-base">
              {rateLabel}
            </div>

            <ClaimMyBonus
              bonusSummary={bonusSummary}
              claimHistory={bonusClaims}
              onClaimed={() => loadLoyaltyData()}
            />

            {!isPartner ? (
              <ClaimGift onClaimed={() => loadLoyaltyData()} />
            ) : null}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-[#141A2E] p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">
                {isPartner ? "Partner loyalty benefits" : "Standard user with affiliate"}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-white/55">
                {isPartner ? (
                  <>
                    <li className="flex min-w-0 items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                      <span className="min-w-0 break-words">
                        Earn referral points when your clients&apos; deposits are approved
                      </span>
                    </li>
                    <li className="flex min-w-0 items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                      <span className="min-w-0 break-words">
                        Partner cash-out rate: 10,000 Trust Points = 35 USD
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex min-w-0 items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                      <span className="min-w-0 break-words">Recognized with affiliate users</span>
                    </li>
                    <li className="flex min-w-0 items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-theme-green-action" />
                      <span className="min-w-0 break-words">
                        Earn Trust Points from eligible top-ups and referrals
                      </span>
                    </li>
                  </>
                )}
              </ul>
              <div className="mt-5 min-w-0 border-t border-white/10 pt-5">
                {hasAffiliateLink ? <AffiliateLinkCard affiliateCode={affiliateCode} /> : null}
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 sm:p-6">
              <LoyaltyLevels
                tiers={membershipTiers}
                currentTier={currentTier.name}
                initialTier={currentTier.name}
                points={trustPointsForTier}
              />
            </section>
          </div>

          <aside className="min-w-0 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                {currentTier.name}
              </span>
              <span className="text-xs text-white/45">{trustPointsForTier.toLocaleString()} pts</span>
            </div>
            <div className="relative mx-auto h-48 w-48 overflow-visible">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180" aria-hidden>
                <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(13,159,27,0.25)" strokeWidth="14" />
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#0D9F1B"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                  style={{ maxWidth: "100%" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <Star className="mb-1 h-5 w-5 fill-theme-green-action text-theme-green-action" />
                <p className="text-3xl font-bold leading-none text-white">{safeLevelProgress}%</p>
              </div>
            </div>
            <p className="mt-4 text-base font-semibold text-theme-green-shaded">{currentLevel}</p>
            <p className="mt-2 text-sm text-white/45">
              {nextTier
                ? `${pointsToNext.toLocaleString()} pts to ${nextTier.name}`
                : "Max membership tier reached"}
            </p>
            <button
              type="button"
              onClick={openWithdraw}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              Loyalty Cash-out
            </button>
          </aside>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-6 border-b border-white/10">
            {[
              { id: "withdraw", label: "Cash-out" },
              { id: "history", label: "Transaction History" },
            ].map((item) => {
              const active = withdrawTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setWithdrawTab(item.id);
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative pb-3 text-sm font-semibold transition ${
                    active ? "text-white" : "text-white/45 hover:text-white/75"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-theme-green-action" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {withdrawTab === "withdraw" ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <form onSubmit={handleWithdraw} className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Enter number of points to cash out
                  </h2>
                  <div className="mt-4 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
                    <label className="mb-2 block text-sm font-medium text-white/70">Points</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={points}
                      onChange={(e) => {
                        setPoints(e.target.value.replace(/\D/g, ""));
                        setError("");
                        setSuccess("");
                      }}
                      placeholder="Enter Number of Points"
                      className={fieldClass}
                    />
                    <p className="mt-2 text-xs text-white/40">
                      Available: {availableBalance.toLocaleString()} pts · {rateLabel}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">Select account details</h2>
                  <p className="mt-1 text-sm text-white/45">
                    (Please click on the account you want points to be cashed out to)
                  </p>
                  <div className="mt-4 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
                    <label className="mb-2 block text-sm font-medium text-white/70">Select Option</label>
                    <select
                      value={account}
                      onChange={(e) => {
                        setAccount(e.target.value);
                        setError("");
                        setSuccess("");
                      }}
                      className={fieldClass}
                    >
                      <option value="" className="bg-[#141A2E]">
                        Select Payment Option
                      </option>
                      {accounts.map((a) => (
                        <option key={a.value} value={a.value} className="bg-[#141A2E]">
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <Link
                      href="/dashboard/profile"
                      className="mt-3 inline-block text-xs text-theme-green-action hover:underline"
                    >
                      Manage saved banks
                    </Link>
                  </div>
                </section>

                {error ? (
                  <BottomMessage
                    title="Unable to cash out"
                    variant="error"
                    onClose={() => setError("")}
                    primaryAction={{ label: "Try Again", onClick: () => setError("") }}
                    secondaryAction={{ label: "Close", onClick: () => setError("") }}
                  >
                    {error}
                  </BottomMessage>
                ) : null}
                {success ? (
                  <BottomMessage
                    title="Loyalty cash-out submitted"
                    variant="success"
                    onClose={() => setSuccess("")}
                    primaryAction={{ label: "View History", onClick: () => { setSuccess(""); setWithdrawTab("history"); } }}
                    secondaryAction={{ label: "Close", onClick: () => setSuccess("") }}
                  >
                    {success}
                  </BottomMessage>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="rounded-xl bg-white/20 px-10 py-3 text-sm font-semibold text-white transition hover:bg-white/30 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Cash-out"}
                </button>
              </form>

              <aside
                className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#141A2E] via-[#0B1020] to-theme-blue-dark p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                aria-hidden
              >
                <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-theme-green-action/15" />
                <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-theme-green-dark/25" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-theme-green-action/10 ring-1 ring-theme-green-action/25" />
                    <Trophy className="h-20 w-20 text-theme-green-action drop-shadow-[0_0_24px_rgba(13,159,27,0.55)]" />
                    <Medal className="absolute -bottom-1 right-2 h-10 w-10 text-theme-green-shaded" />
                  </div>
                  <div className="flex items-center gap-2 text-theme-green-action">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">Redeem loyalty rewards</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                    Convert Trust Points into cash and send payouts to your preferred saved account.
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-8">
              <ListFilters
                search={historyFilter.search}
                onSearchChange={(v) => setHistoryFilter((p) => ({ ...p, search: v }))}
                searchPlaceholder="Search ID, points, amount…"
                filters={[
                  {
                    key: "status",
                    label: "Status",
                    options: ["All Statuses", "Completed", "Pending", "Rejected"],
                  },
                ]}
                values={historyFilter}
                onFilterChange={(key, value) => setHistoryFilter((p) => ({ ...p, [key]: value }))}
                showDates
                from={historyFilter.from}
                to={historyFilter.to}
                onFromChange={(v) => setHistoryFilter((p) => ({ ...p, from: v }))}
                onToChange={(v) => setHistoryFilter((p) => ({ ...p, to: v }))}
                onReset={() => setHistoryFilter(HISTORY_FILTER_DEFAULTS)}
                resultCount={filteredHistory.length}
              />
              <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10">
                    <p className="text-sm font-medium text-white/80">No cash-out history found.</p>
                  </div>
                ) : (
                  filteredHistory.map((row) => (
                    <article
                      key={row.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">Loyalty Cash-out - {row.id}</p>
                        <p className="mt-1 text-sm text-white/50">{row.points} points</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                            row.status === "Completed"
                              ? "bg-theme-green-action text-white"
                              : "bg-theme-orange text-white"
                          }`}
                        >
                          {row.status}
                        </span>
                        <p className="mt-2 text-sm text-white/45">{row.date}</p>
                        <p className="text-lg font-bold text-white">{row.amount}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
