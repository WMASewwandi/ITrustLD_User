"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AffiliateLinkCard from "@/components/dashboard/affiliate-link-card";
import ClaimClientBonus from "@/components/dashboard/claim-client-bonus";
import ClaimGift from "@/components/dashboard/claim-gift";
import ClaimMyBonus from "@/components/dashboard/claim-my-bonus";
import ListFilters from "@/components/dashboard/list-filters";
import PageHeader from "@/components/dashboard/page-header";
import PartnerLoyaltyPanel from "@/components/dashboard/partner-loyalty-panel";
import VoucherCountdown from "@/components/dashboard/voucher-countdown";
import VoucherViewModal from "@/components/dashboard/voucher-view-modal";
import { notifyClaimsUpdated } from "@/lib/earnings";
import { inDateRange, matchesPeriod, rowMatchesSearch } from "@/lib/filter-utils";
import { formatPartnerPoints, formatTierProgressReward, getTierColor } from "@/lib/loyalty";
import {
  fetchBonusClaims,
  fetchGiftClaims,
  fetchAvailableGifts,
  fetchLoyaltySummary,
  fetchPartnerClients,
  fetchSubPartnerClients,
  fetchVoucherClaims,
  mapAffiliateClientRows,
  mapBonusClaimRows,
  mapGiftClaimRows,
  mapVoucherClaimRows,
} from "@/lib/loyalty-api";
import {
  getUserSession,
  hasUserSession,
  isPartnerUser,
  patchUserSessionAccountHolder,
} from "@/lib/auth";
import { Eye, Gift, Ticket, Users, Wallet } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "clients", label: "My Clients" },
  { id: "sub-clients", label: "Sub Clients" },
  { id: "sub-partners", label: "Sub Partners" },
  { id: "claim-vouchers", label: "Client Bonus" },
  { id: "claim-bonus", label: "Claim Bonus" },
  { id: "claim-gift", label: "Claim Gift" },
  { id: "claim-history", label: "Claim History" },
];

const PARTNER_ONLY_TABS = ["clients", "sub-clients", "sub-partners", "claim-vouchers"];

const CLIENT_DEFAULTS = {
  search: "",
  period: "All",
  points: "All Points",
  from: "",
  to: "",
};

const HISTORY_DEFAULTS = {
  search: "",
  type: "All Types",
  status: "All Statuses",
  from: "",
  to: "",
};

function TierBadge({ name }) {
  const colors = getTierColor(name);
  return (
    <span
      className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {name}
    </span>
  );
}

function maskAccountId(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "—") return "—";
  if (raw.length <= 8) return "X".repeat(raw.length);
  return `${"X".repeat(8)}${raw.slice(8)}`;
}

function PartnerClientBadge() {
  return (
    <span className="inline-block rounded bg-theme-green-action px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
      PTNR
    </span>
  );
}

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-theme-green-action px-1.5 py-0.5 text-[11px] font-bold text-white">
      {count}
    </span>
  );
}

const STATUS_BADGE_CLASS = {
  Completed: "bg-theme-green-action text-white",
  Claimed: "bg-theme-green-action text-white",
  Pending: "bg-theme-orange text-white",
  Rejected: "bg-theme-red-action text-white",
};

function StatusBadge({ status }) {
  const normalized = status === "Claimed" ? "Completed" : String(status || "Pending");
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        STATUS_BADGE_CLASS[normalized] || STATUS_BADGE_CLASS.Pending
      }`}
    >
      {normalized}
    </span>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#141A2E] px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/45">{hint}</p> : null}
    </div>
  );
}

function TableShell({ columns, rows, emptyLabel, loading = false }) {
  // Keep existing rows visible during refetch so the tab never looks stuck.
  if (loading && !rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10">
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10">
        <p className="text-sm font-medium text-white/80">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-white/[0.07] text-white/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 font-semibold first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id || row.token || row.accountId || idx}
              className="border-t border-white/8 bg-[#0B1020]/70 text-white/85"
            >
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function filterClients(rows, applied) {
  return rows.filter((row) => {
    if (applied.period !== "All" && applied.period !== "Custom") {
      if (!matchesPeriod(row.lastTransaction, applied.period)) return false;
    }
    if (!inDateRange(row.lastTransaction, applied.from, applied.to)) return false;
    if (applied.points === "100+ pts" && Number(row.pointsRaw ?? row.points) < 100) return false;
    if (applied.points === "200+ pts" && Number(row.pointsRaw ?? row.points) < 200) return false;
    if (applied.points === "400+ pts" && Number(row.pointsRaw ?? row.points) < 400) return false;
    return true;
  });
}

export default function MyEarningsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState(() =>
    requestedTab && TABS.some((item) => item.id === requestedTab) ? requestedTab : "overview",
  );
  const [isPartner, setIsPartner] = useState(() => isPartnerUser(getUserSession()));
  const [affiliateCode, setAffiliateCode] = useState("");
  const [partnerTier, setPartnerTier] = useState("Normal");
  const [partnerProgress, setPartnerProgress] = useState(null);
  const [pointSummary, setPointSummary] = useState(null);
  const [usdValue, setUsdValue] = useState("0.00");
  const [rateLabel, setRateLabel] = useState("");
  const [myClients, setMyClients] = useState([]);
  const [subClients, setSubClients] = useState([]);
  const [subPartners, setSubPartners] = useState([]);
  const [clientTotal, setClientTotal] = useState(0);
  const [subClientTotal, setSubClientTotal] = useState(0);
  const [subPartnerTotal, setSubPartnerTotal] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [subClientsLoading, setSubClientsLoading] = useState(false);
  const [subPartnersLoading, setSubPartnersLoading] = useState(false);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState("");
  const [loadError, setLoadError] = useState("");
  const [bonusSummary, setBonusSummary] = useState(null);
  const [clientBonusSummary, setClientBonusSummary] = useState(null);
  const [bonusClaims, setBonusClaims] = useState([]);
  const [voucherClaims, setVoucherClaims] = useState([]);
  const [giftClaims, setGiftClaims] = useState([]);
  const [eligibleGiftCount, setEligibleGiftCount] = useState(0);
  const [viewVoucherToken, setViewVoucherToken] = useState("");
  const handleLoyaltyErrorRef = useRef(null);

  const [clientFilter, setClientFilter] = useState(CLIENT_DEFAULTS);
  const [subFilter, setSubFilter] = useState(CLIENT_DEFAULTS);
  const [subPartnerFilter, setSubPartnerFilter] = useState(CLIENT_DEFAULTS);
  const [historyFilter, setHistoryFilter] = useState(HISTORY_DEFAULTS);

  const applySummaryData = useCallback((summaryData) => {
    const summary = summaryData.point_summary || {};
    setIsPartner(Boolean(summaryData.is_partner));
    setAffiliateCode(summaryData.has_affiliate_link ? summaryData.affiliate_code || "" : "");
    setPartnerTier(summaryData.partner_tier || summary.level_label || "Normal");
    setPartnerProgress(summaryData.partner_progress || null);
    setPointSummary(summary);
    setUsdValue(Number(summaryData.usd_value_of_earned || 0).toFixed(2));
    setRateLabel(summaryData.rate_label || "");
    setBonusSummary(summaryData.bonus_summary || null);
    setClientBonusSummary(summaryData.client_bonus_summary || null);
    if (summaryData.direct_client_count != null) {
      setClientTotal(Number(summaryData.direct_client_count) || 0);
    }
    patchUserSessionAccountHolder({
      is_patner: summaryData.is_partner ? "YES" : "NO",
      affiliate_code: summaryData.has_affiliate_link ? summaryData.affiliate_code || null : null,
    });
  }, []);

  const handleLoyaltyError = useCallback(
    (err) => {
      if (err?.data?.code === "VERIFICATION_REQUIRED" || err?.message?.includes("verification")) {
        router.replace("/verify");
        return true;
      }
      return false;
    },
    [router],
  );

  useEffect(() => {
    handleLoyaltyErrorRef.current = handleLoyaltyError;
  }, [handleLoyaltyError]);

  const loadEarningsData = useCallback(async () => {
    setSummaryLoading(true);
    setLoadError("");
    try {
      // Phase 1 — summary only so the page can paint quickly.
      const summaryData = await fetchLoyaltySummary();
      applySummaryData(summaryData);
      setSummaryLoading(false);

      const partner = Boolean(summaryData.is_partner);

      if (partner && summaryData.direct_client_count == null) {
        try {
          const clientsData = await fetchPartnerClients({ countOnly: true, perPage: 1 });
          setClientTotal(Number(clientsData.pagination?.total || 0));
        } catch {
          // Overview can still render; the clients tab will fill this in.
        }
      }

      // Phase 2 — claims only (client lists load on their own tabs).
      if (!partner) {
        setMyClients([]);
        setSubClients([]);
        setClientTotal(0);
        setSubClientTotal(0);
        setBonusClaims([]);
        setVoucherClaims([]);
        setGiftClaims([]);
        setEligibleGiftCount(0);
        try {
          const [bonusClaimsData, giftsData, giftClaimsData] = await Promise.all([
            fetchBonusClaims({ perPage: 50 }),
            fetchAvailableGifts(),
            fetchGiftClaims(),
          ]);
          setBonusClaims(mapBonusClaimRows(bonusClaimsData.claims || []));
          setGiftClaims(mapGiftClaimRows(giftClaimsData.claims || []));
          setEligibleGiftCount((giftsData.gifts || []).filter((gift) => gift.is_eligible).length);
          notifyClaimsUpdated();
        } catch {
          // Non-partner gift/bonus load is best-effort.
        }
        return;
      }

      setClaimsLoading(true);
      try {
        const [bonusClaimsData, voucherClaimsData, giftsData, giftClaimsData] = await Promise.all([
          fetchBonusClaims({ perPage: 50 }),
          fetchVoucherClaims({ perPage: 50 }),
          fetchAvailableGifts(),
          fetchGiftClaims(),
        ]);
        setBonusClaims(mapBonusClaimRows(bonusClaimsData.claims || []));
        setVoucherClaims(mapVoucherClaimRows(voucherClaimsData.vouchers || []));
        setGiftClaims(mapGiftClaimRows(giftClaimsData.claims || []));
        setEligibleGiftCount((giftsData.gifts || []).filter((gift) => gift.is_eligible).length);
        notifyClaimsUpdated();
      } finally {
        setClaimsLoading(false);
      }
    } catch (err) {
      if (!handleLoyaltyError(err)) {
        setLoadError(err.message || "Failed to load earnings data.");
      }
      setSummaryLoading(false);
      setClaimsLoading(false);
    }
  }, [applySummaryData, handleLoyaltyError]);

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }
    loadEarningsData();
  }, [loadEarningsData, router]);

  useEffect(() => {
    if (requestedTab && TABS.some((item) => item.id === requestedTab)) {
      setTab(requestedTab);
    }
  }, [requestedTab]);

  useEffect(() => {
    // Only bounce off partner tabs after summary confirms non-partner.
    if (!summaryLoading && !isPartner && PARTNER_ONLY_TABS.includes(tab)) {
      setTab("overview");
    }
  }, [isPartner, tab, summaryLoading]);

  useEffect(() => {
    if (!isPartner || tab !== "clients") return undefined;

    let cancelled = false;
    const delay = clientFilter.search.trim() ? 300 : 0;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setClientsLoading(true);
      try {
        const clientsData = await fetchPartnerClients({
          perPage: 100,
          search: clientFilter.search.trim() || undefined,
        });
        if (cancelled) return;
        setMyClients(mapAffiliateClientRows(clientsData.clients || []));
        setClientTotal(Number(clientsData.pagination?.total || 0));
      } catch (err) {
        if (!cancelled) handleLoyaltyErrorRef.current?.(err);
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setClientsLoading(false);
    };
  }, [tab, isPartner, clientFilter.search]);

  useEffect(() => {
    if (!isPartner || tab !== "sub-clients") return undefined;

    let cancelled = false;
    const delay = subFilter.search.trim() ? 300 : 0;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setSubClientsLoading(true);
      try {
        const subClientsData = await fetchSubPartnerClients({
          perPage: 100,
          search: subFilter.search.trim() || undefined,
        });
        if (cancelled) return;
        setSubClients(mapAffiliateClientRows(subClientsData.clients || []));
        setSubClientTotal(Number(subClientsData.pagination?.total || 0));
      } catch (err) {
        if (!cancelled) handleLoyaltyErrorRef.current?.(err);
      } finally {
        if (!cancelled) setSubClientsLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setSubClientsLoading(false);
    };
  }, [tab, isPartner, subFilter.search]);

  useEffect(() => {
    if (!isPartner || tab !== "sub-partners") return undefined;

    let cancelled = false;
    const delay = subPartnerFilter.search.trim() ? 300 : 0;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setSubPartnersLoading(true);
      try {
        const search = subPartnerFilter.search.trim() || undefined;
        const [directData, networkData] = await Promise.all([
          fetchPartnerClients({ perPage: 100, search }),
          fetchSubPartnerClients({ perPage: 100, search }),
        ]);
        if (cancelled) return;
        const seen = new Set();
        const partners = [
          ...mapAffiliateClientRows(directData.clients || []).map((row) => ({ ...row, source: "direct" })),
          ...mapAffiliateClientRows(networkData.clients || []).map((row) => ({ ...row, source: "sub" })),
        ].filter((row) => {
          if (!row.isPartner) return false;
          const key = String(row.accountId || row.id);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setSubPartners(partners);
        setSubPartnerTotal(partners.length);
      } catch (err) {
        if (!cancelled) handleLoyaltyErrorRef.current?.(err);
      } finally {
        if (!cancelled) setSubPartnersLoading(false);
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setSubPartnersLoading(false);
    };
  }, [tab, isPartner, subPartnerFilter.search]);

  function switchTab(nextTab) {
    setTab(nextTab);
    setClaimMsg("");
    const params = new URLSearchParams(window.location.search);
    if (nextTab === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }
    const qs = params.toString();
    router.replace(qs ? `/dashboard/earnings?${qs}` : "/dashboard/earnings", { scroll: false });
  }

  const periodPoints = Number(partnerProgress?.period_points ?? pointSummary?.earned_for_year ?? 0);
  const pointsPerLot = Number(partnerProgress?.points_per_lot ?? 20);
  const tierTarget = Number(partnerProgress?.tier_target ?? 0);
  const pointsToNext = Number(partnerProgress?.points_to_next ?? 0);
  const progressPct = Math.round(Number(partnerProgress?.progress_percentage ?? pointSummary?.percentage ?? 0));
  const currentTier = partnerProgress?.current_tier || partnerTier || pointSummary?.level_label || "Normal";
  const nextTier = partnerProgress?.next_tier || null;
  const earningsUsd = ((periodPoints * pointsPerLot) / 100).toFixed(2);
  const referralPoints =
    partnerProgress?.points_breakdown?.find((row) => row.label === "Referral Points")?.points ?? 0;

  const voucherSlots = Number(clientBonusSummary?.remaining_slots || 0);
  const bonusAvailable = Boolean(bonusSummary?.available);

  const bonusHistoryRows = useMemo(
    () =>
      bonusClaims.map((row) => ({
        id: row.id,
        type: "Bonus",
        ref: row.id,
        platformId: row.method,
        amount: `USD ${row.amount}`,
        claimedAt: row.date,
        status: row.status === "Claimed" ? "Completed" : row.status,
      })),
    [bonusClaims],
  );

  const voucherHistoryRows = useMemo(
    () =>
      voucherClaims.map((row) => ({
        id: row.id,
        type: "Voucher",
        ref: row.token,
        platformId: row.platformId,
        amount: row.amount,
        claimedAt: row.createdAt,
        status: row.status === "Claimed" ? "Completed" : row.status,
      })),
    [voucherClaims],
  );

  const giftHistoryRows = useMemo(
    () =>
      giftClaims.map((row) => ({
        id: row.id,
        type: "Gift",
        ref: row.giftTitle,
        platformId: row.deliveryAddress,
        amount: "—",
        claimedAt: row.date,
        status: row.status === "Delivered" ? "Completed" : row.status,
      })),
    [giftClaims],
  );

  const visibleTabs = useMemo(() => {
    if (!isPartner) {
      return TABS.filter((item) => !PARTNER_ONLY_TABS.includes(item.id));
    }
    return TABS;
  }, [isPartner]);

  const filteredClients = useMemo(() => filterClients(myClients, clientFilter), [myClients, clientFilter]);
  const filteredSubClients = useMemo(() => filterClients(subClients, subFilter), [subClients, subFilter]);
  const filteredSubPartners = useMemo(
    () => filterClients(subPartners, subPartnerFilter),
    [subPartners, subPartnerFilter],
  );

  const filteredHistory = useMemo(() => {
    const rows = [...bonusHistoryRows, ...voucherHistoryRows, ...giftHistoryRows];
    return rows
      .filter((row) => {
        if (!rowMatchesSearch(row, historyFilter.search, ["type", "ref", "amount", "claimedAt", "status", "platformId"])) {
          return false;
        }
        if (historyFilter.type !== "All Types" && row.type !== historyFilter.type) return false;
        if (historyFilter.status !== "All Statuses" && row.status !== historyFilter.status) return false;
        if (!inDateRange(row.claimedAt, historyFilter.from, historyFilter.to)) return false;
        return true;
      })
      .sort((a, b) => {
        const aTime = Date.parse(String(a.claimedAt || "").replace(" ", "T")) || 0;
        const bTime = Date.parse(String(b.claimedAt || "").replace(" ", "T")) || 0;
        if (bTime !== aTime) return bTime - aTime;
        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [bonusHistoryRows, voucherHistoryRows, giftHistoryRows, historyFilter]);

  const bonusClaimColumns = [
    { key: "id", label: "Trans ID" },
    { key: "date", label: "Date" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-semibold text-theme-green-action">USD {row.amount}</span>,
    },
    { key: "method", label: "Payment Method" },
    { key: "received", label: "Received" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const voucherListColumns = [
    { key: "token", label: "Voucher Token" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-semibold text-theme-green-action">{row.amount}</span>,
    },
    {
      key: "tierLabel",
      label: "Tier",
      render: (row) => row.tierLabel || "—",
    },
    { key: "topupMethod", label: "Topup Method" },
    { key: "platformId", label: "Platform ID" },
    { key: "createdAt", label: "Issued At" },
    {
      key: "expiresAt",
      label: "Time Left",
      render: (row) => (
        <VoucherCountdown
          expiresAt={row.expiresAt}
          createdAt={row.createdAt}
          status={row.status}
          compact
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "action",
      label: "Action",
      render: (row) =>
        row.token && row.token !== "—" ? (
          <button
            type="button"
            onClick={() => setViewVoucherToken(String(row.token))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        ) : (
          "—"
        ),
    },
  ];

  const clientColumns = [
    {
      key: "accountId",
      label: "Account ID",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span>{row.accountId || "—"}</span>
          {row.isPartner ? <PartnerClientBadge /> : null}
        </span>
      ),
    },
    { key: "firstTransaction", label: "First Transaction" },
    { key: "lastTransaction", label: "Last Transaction" },
    { key: "points", label: "Points" },
  ];

  const subClientColumns = [
    {
      key: "accountId",
      label: "Account ID",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span>{maskAccountId(row.accountId)}</span>
          {row.isPartner ? <PartnerClientBadge /> : null}
        </span>
      ),
    },
    { key: "firstTransaction", label: "First Transaction" },
    { key: "lastTransaction", label: "Last Transaction" },
    { key: "points", label: "Points" },
  ];

  const subPartnerColumns = [
    {
      key: "accountId",
      label: "Account ID",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span>{row.source === "sub" ? maskAccountId(row.accountId) : row.accountId || "—"}</span>
          <PartnerClientBadge />
        </span>
      ),
    },
    { key: "firstTransaction", label: "First Transaction" },
    { key: "lastTransaction", label: "Last Transaction" },
    { key: "points", label: "Points" },
  ];

  const clientFilterDefs = [
    { key: "period", label: "Period", options: ["All", "Daily", "Weekly", "Monthly", "Custom"] },
    { key: "points", label: "Points", options: ["All Points", "100+ pts", "200+ pts", "400+ pts"] },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={isPartner ? "Partner" : "Loyalty"}
        title="My Earnings"
        description={
          isPartner
            ? "Track tier earnings, affiliate clients, client bonus vouchers, and loyalty bonus claims."
            : "Track your loyalty bonus eligibility and claim history."
        }
      />

      <div className="border-b border-white/10">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {visibleTabs.map((item) => {
            const active = tab === item.id;
            const badge =
              item.id === "claim-vouchers"
                ? voucherSlots
                : item.id === "claim-bonus"
                  ? (bonusAvailable ? 1 : 0)
                  : item.id === "claim-gift"
                    ? eligibleGiftCount
                  : 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => switchTab(item.id)}
                className={`relative pb-3 text-sm font-semibold transition ${
                  active ? "text-theme-green-action" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center">
                  {item.label}
                  <CountBadge count={badge} />
                </span>
                {active ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-theme-green-action" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {claimMsg ? (
          <p className="mb-4 text-sm font-medium text-theme-green-action">{claimMsg}</p>
        ) : null}
        {loadError ? (
          <p className="mb-4 text-sm font-medium text-theme-red-action">{loadError}</p>
        ) : null}

        {tab === "overview" ? (
          <div className="space-y-5">
            {summaryLoading ? (
              <div className="rounded-2xl border border-white/12 bg-[#141A2E] px-5 py-10">
                <p className="text-sm text-white/50">Loading earnings summary…</p>
              </div>
            ) : (
              <>
                <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30">
                        <Wallet className="h-7 w-7 text-theme-green-action" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white/50">Estimated tier earnings (12 months)</p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          USD {earningsUsd}
                        </p>
                        <p className="mt-1 text-sm text-white/45">
                          {formatPartnerPoints(periodPoints)} level points · {formatTierProgressReward({ name: currentTier })}
                        </p>
                        {rateLabel ? <p className="mt-1 text-xs text-white/35">{rateLabel}</p> : null}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Current tier</p>
                      <TierBadge name={currentTier} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      label="Lifetime earned (USD)"
                      value={`USD ${usdValue}`}
                      hint={`${Number(pointSummary?.earned || 0).toLocaleString()} total points`}
                    />
                    <StatCard
                      label="Available balance"
                      value={`${Number(pointSummary?.remaining || 0).toLocaleString()} pts`}
                      hint={`${Number(pointSummary?.withdrawn || 0).toLocaleString()} withdrawn`}
                    />
                    {isPartner ? (
                      <>
                        <StatCard
                          label="My clients"
                          value={clientTotal.toLocaleString()}
                          hint={`${formatPartnerPoints(referralPoints)} referral pts (12 mo)`}
                        />
                        <StatCard
                          label="Vouchers issued"
                          value={voucherClaims.length.toLocaleString()}
                          hint={`${voucherSlots} client bonus slot${voucherSlots === 1 ? "" : "s"} left`}
                        />
                      </>
                    ) : (
                      <>
                        <StatCard
                          label="Progress"
                          value={`${progressPct}%`}
                          hint={nextTier ? `${pointsToNext.toLocaleString()} pts to ${nextTier}` : "Max tier reached"}
                        />
                        <StatCard
                          label="Period points"
                          value={formatPartnerPoints(periodPoints)}
                          hint={tierTarget ? `Target ${formatPartnerPoints(tierTarget)}` : "Rolling 12 months"}
                        />
                      </>
                    )}
                  </div>

                  {isPartner ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-white/40">Level points</p>
                        <p className="mt-1 text-lg font-bold text-white">
                          {formatPartnerPoints(periodPoints)}
                          {nextTier ? <span className="text-white/40"> / {formatPartnerPoints(tierTarget)}</span> : null}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-white/40">Progress</p>
                        <p className="mt-1 text-lg font-bold text-theme-green-action">{progressPct}%</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-white/40">Next tier</p>
                        <p className="mt-1 text-lg font-bold text-white">
                          {nextTier ? `${pointsToNext.toLocaleString()} pts to ${nextTier}` : "Max tier"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </section>

                {isPartner && affiliateCode ? (
                  <section className="rounded-2xl border border-white/12 bg-[#141A2E] p-5 sm:p-6">
                    <AffiliateLinkCard affiliateCode={affiliateCode} />
                  </section>
                ) : null}

                {isPartner ? (
                  <PartnerLoyaltyPanel
                    affiliateCode=""
                    partnerTier={currentTier}
                    partnerPoints={periodPoints}
                    partnerProgress={partnerProgress}
                  />
                ) : null}

                {isPartner ? (
                  <ClaimClientBonus
                    clientBonusSummary={clientBonusSummary}
                    issuedVouchers={voucherClaims}
                    compact
                    onIssued={async (result) => {
                      if (result?.client_bonus_summary) {
                        setClientBonusSummary(result.client_bonus_summary);
                      }
                      await loadEarningsData();
                      setClaimMsg("Client bonus voucher issued successfully.");
                      setTimeout(() => setClaimMsg(""), 3000);
                    }}
                  />
                ) : null}

                <ClaimMyBonus
                  bonusSummary={bonusSummary}
                  claimHistory={bonusClaims}
                  compact
                  onClaimed={async () => {
                    await loadEarningsData();
                    setClaimMsg("Bonus claim submitted successfully. Admin will review your request.");
                    setTimeout(() => setClaimMsg(""), 3000);
                  }}
                />

                <div className="space-y-4">
                  {isPartner ? (
                    <button
                      type="button"
                      onClick={() => switchTab("claim-vouchers")}
                      className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/12 bg-[#141A2E] p-5 text-left transition hover:border-theme-green-action/40 hover:bg-[#171E35]"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-theme-green-action">
                        <Ticket className="h-6 w-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="inline-flex items-center text-base font-semibold text-white">
                          {clientBonusSummary?.new_tier_bonus
                            ? `New ${clientBonusSummary.new_tier_bonus.label} Client Bonus`
                            : "Client Bonus Vouchers"}
                          <CountBadge count={voucherSlots} />
                        </span>
                        <span className="mt-1 block text-sm text-white/50">
                          {clientBonusSummary?.new_tier_bonus
                            ? `${clientBonusSummary.new_tier_bonus.remaining} new voucher slot${
                                clientBonusSummary.new_tier_bonus.remaining === 1 ? "" : "s"
                              } unlocked by upgrade`
                            : `${voucherClaims.length} issued · issue printable vouchers for client deposits`}
                        </span>
                      </span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => switchTab("clients")}
                    className={`flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/12 bg-[#141A2E] p-5 text-left transition hover:border-theme-green-action/40 hover:bg-[#171E35] ${isPartner ? "" : "hidden"}`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-theme-green-action">
                      <Users className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-base font-semibold text-white">My Clients</span>
                      <span className="mt-1 block text-sm text-white/50">
                        {clientTotal} direct clients · {formatPartnerPoints(referralPoints)} referral points
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchTab("claim-bonus")}
                    className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/12 bg-[#141A2E] p-5 text-left transition hover:border-theme-orange/40 hover:bg-[#171E35]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-theme-orange">
                      <Gift className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="inline-flex items-center text-base font-semibold text-white">
                        Claim My Bonus
                        <CountBadge count={bonusAvailable ? 1 : 0} />
                      </span>
                      <span className="mt-1 block text-sm text-white/50">
                        {bonusClaims.length} claim{bonusClaims.length === 1 ? "" : "s"} in history
                        {bonusAvailable ? ` · USD ${bonusSummary?.amount_display || "0.00"} available` : ""}
                      </span>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}

        {tab === "clients" ? (
          <>
            <ListFilters
              search={clientFilter.search}
              onSearchChange={(v) => setClientFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search account ID…"
              filters={clientFilterDefs}
              values={clientFilter}
              onFilterChange={(key, value) => setClientFilter((p) => ({ ...p, [key]: value }))}
              showDates
              from={clientFilter.from}
              to={clientFilter.to}
              onFromChange={(v) => setClientFilter((p) => ({ ...p, from: v }))}
              onToChange={(v) => setClientFilter((p) => ({ ...p, to: v }))}
              onReset={() => setClientFilter(CLIENT_DEFAULTS)}
              resultCount={filteredClients.length}
            />
            <p className="mb-3 text-xs text-white/45">{clientTotal} total clients from your affiliate network</p>
            <TableShell
              columns={clientColumns}
              rows={filteredClients}
              emptyLabel="No clients found."
              loading={clientsLoading}
            />
          </>
        ) : null}

        {tab === "sub-clients" ? (
          <>
            <ListFilters
              search={subFilter.search}
              onSearchChange={(v) => setSubFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search account ID…"
              filters={clientFilterDefs}
              values={subFilter}
              onFilterChange={(key, value) => setSubFilter((p) => ({ ...p, [key]: value }))}
              showDates
              from={subFilter.from}
              to={subFilter.to}
              onFromChange={(v) => setSubFilter((p) => ({ ...p, from: v }))}
              onToChange={(v) => setSubFilter((p) => ({ ...p, to: v }))}
              onReset={() => setSubFilter(CLIENT_DEFAULTS)}
              resultCount={filteredSubClients.length}
            />
            <p className="mb-3 text-xs text-white/45">{subClientTotal} total sub-clients from your network</p>
            <TableShell
              columns={subClientColumns}
              rows={filteredSubClients}
              emptyLabel="No sub clients found."
              loading={subClientsLoading}
            />
          </>
        ) : null}

        {tab === "sub-partners" ? (
          <>
            <ListFilters
              search={subPartnerFilter.search}
              onSearchChange={(v) => setSubPartnerFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search account ID…"
              filters={clientFilterDefs}
              values={subPartnerFilter}
              onFilterChange={(key, value) => setSubPartnerFilter((p) => ({ ...p, [key]: value }))}
              showDates
              from={subPartnerFilter.from}
              to={subPartnerFilter.to}
              onFromChange={(v) => setSubPartnerFilter((p) => ({ ...p, from: v }))}
              onToChange={(v) => setSubPartnerFilter((p) => ({ ...p, to: v }))}
              onReset={() => setSubPartnerFilter(CLIENT_DEFAULTS)}
              resultCount={filteredSubPartners.length}
            />
            <p className="mb-3 text-xs text-white/45">
              {subPartnerTotal} partner{subPartnerTotal === 1 ? "" : "s"} with a PTNR badge in your network
            </p>
            <TableShell
              columns={subPartnerColumns}
              rows={filteredSubPartners}
              emptyLabel="No sub partners found."
              loading={subPartnersLoading}
            />
          </>
        ) : null}

        {tab === "claim-vouchers" ? (
          <div className="space-y-5">
            <ClaimClientBonus
              clientBonusSummary={clientBonusSummary}
              issuedVouchers={voucherClaims}
              onIssued={async (result) => {
                if (result?.client_bonus_summary) {
                  setClientBonusSummary(result.client_bonus_summary);
                }
                await loadEarningsData();
                setClaimMsg("Client bonus voucher issued successfully.");
                setTimeout(() => setClaimMsg(""), 3000);
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-white">Issued vouchers</h2>
              <p className="mt-1 text-sm text-white/45">
                Vouchers you issued for clients. Open View to print or share with your client.
              </p>
            </div>
            <TableShell
              columns={voucherListColumns}
              rows={voucherClaims}
              emptyLabel="No client bonus vouchers issued yet."
              loading={claimsLoading || summaryLoading}
            />
          </div>
        ) : null}

        {tab === "claim-bonus" ? (
          <div className="space-y-5">
            <ClaimMyBonus
              bonusSummary={bonusSummary}
              claimHistory={bonusClaims}
              onClaimed={async () => {
                await loadEarningsData();
                setClaimMsg("Bonus claim submitted successfully. Admin will review your request.");
                setTimeout(() => setClaimMsg(""), 3000);
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-white">Bonus claim history</h2>
              <p className="mt-1 text-sm text-white/45">
                Track pending, claimed, and rejected bonus requests.
              </p>
            </div>
            <TableShell
              columns={bonusClaimColumns}
              rows={bonusClaims}
              emptyLabel="No bonus claims yet."
              loading={claimsLoading || summaryLoading}
            />
          </div>
        ) : null}

        {tab === "claim-gift" ? (
          <ClaimGift
            onClaimed={async () => {
              await loadEarningsData();
              setClaimMsg("Gift claim submitted. Our team will process your delivery details.");
              setTimeout(() => setClaimMsg(""), 3000);
            }}
          />
        ) : null}

        {tab === "claim-history" ? (
          <>
            <ListFilters
              search={historyFilter.search}
              onSearchChange={(v) => setHistoryFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search type, reference, amount…"
              filters={[
                { key: "type", label: "Type", options: ["All Types", "Voucher", "Bonus", "Gift"] },
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
              onReset={() => setHistoryFilter(HISTORY_DEFAULTS)}
              resultCount={filteredHistory.length}
            />
            <TableShell
              columns={[
                { key: "type", label: "Type" },
                { key: "ref", label: "Reference" },
                { key: "platformId", label: "Platform / Method" },
                { key: "amount", label: "Amount" },
                { key: "claimedAt", label: "Date" },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => <StatusBadge status={row.status} />,
                },
              ]}
              rows={filteredHistory}
              emptyLabel="No claims yet. Issue a client bonus voucher or submit a bonus claim to see history."
              loading={claimsLoading || summaryLoading}
            />
          </>
        ) : null}
      </div>

      <VoucherViewModal
        open={Boolean(viewVoucherToken)}
        token={viewVoucherToken}
        onClose={() => setViewVoucherToken("")}
      />
    </div>
  );
}
