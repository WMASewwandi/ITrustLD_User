"use client";

import { useEffect, useMemo, useState } from "react";
import ListFilters from "@/components/dashboard/list-filters";
import PageHeader from "@/components/dashboard/page-header";
import {
  claimBonusById,
  claimVoucherById,
  getReadyBonusClaims,
  getReadyVoucherClaims,
  loadClaimsState,
  MY_CLIENTS,
  SUB_CLIENTS,
} from "@/lib/earnings";
import { inDateRange, matchesPeriod, rowMatchesSearch } from "@/lib/filter-utils";
import { getPartnerProgress, getPartnerTiers, getTierColor } from "@/lib/loyalty";
import { Check, Eye, Gift, Ticket, Wallet, X } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "clients", label: "My Clients" },
  { id: "sub-clients", label: "Sub Clients" },
  { id: "claim-vouchers", label: "Claim Vouchers" },
  { id: "claim-bonus", label: "Claim Bonus" },
  { id: "claim-history", label: "Claim History" },
];

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

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-theme-green-action px-1.5 py-0.5 text-[11px] font-bold text-white">
      {count}
    </span>
  );
}

function TableShell({ columns, rows, emptyLabel }) {
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
    if (!rowMatchesSearch(row, applied.search, ["accountId", "points", "firstTransaction", "lastTransaction"])) {
      return false;
    }
    if (applied.period !== "All" && applied.period !== "Custom") {
      if (!matchesPeriod(row.lastTransaction, applied.period)) return false;
    }
    if (!inDateRange(row.lastTransaction, applied.from, applied.to)) return false;
    if (applied.points === "100+ pts" && Number(row.points) < 100) return false;
    if (applied.points === "200+ pts" && Number(row.points) < 200) return false;
    if (applied.points === "400+ pts" && Number(row.points) < 400) return false;
    return true;
  });
}

function ClaimList({ items, emptyLabel, columns, onView }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-10 text-center">
        <p className="text-sm font-medium text-white/80">{emptyLabel}</p>
        <p className="mt-2 text-xs text-white/45">
          Items appear here after an admin approves your claim request.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-white/[0.07] text-white/80">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-white/8 bg-[#0B1020]/70 text-white/85">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClaimDetailModal({ open, title, onClose, onClaim, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/12 bg-[#141A2E] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onClaim}
            className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Check className="h-4 w-4" />
            Claim now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyEarningsPage() {
  const [tab, setTab] = useState("overview");
  const [partnerTier, setPartnerTier] = useState("Normal");
  const [partnerPoints, setPartnerPoints] = useState(45);
  const [tiers, setTiers] = useState([]);
  const [claimsState, setClaimsState] = useState({ vouchers: [], bonuses: [], history: [] });
  const [viewVoucher, setViewVoucher] = useState(null);
  const [viewBonus, setViewBonus] = useState(null);
  const [claimMsg, setClaimMsg] = useState("");

  const [clientFilter, setClientFilter] = useState(CLIENT_DEFAULTS);
  const [subFilter, setSubFilter] = useState(CLIENT_DEFAULTS);
  const [historyFilter, setHistoryFilter] = useState(HISTORY_DEFAULTS);

  useEffect(() => {
    setTiers(getPartnerTiers());
    setClaimsState(loadClaimsState());
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const user = JSON.parse(raw);
        const tier = user?.partnerTier === "Bronze" ? "Normal" : user?.partnerTier || "Normal";
        setPartnerTier(tier);
        setPartnerPoints(Number(user?.partnerPoints) || 45);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const { current, next, currentPts, required, remaining, progressPct } = useMemo(
    () => getPartnerProgress(partnerPoints, partnerTier, tiers.length ? tiers : getPartnerTiers()),
    [partnerPoints, partnerTier, tiers]
  );

  const earningsUsd = useMemo(() => {
    const perLot = current?.pointsPerLot || 20;
    return ((Number(partnerPoints) || 0) * (perLot / 100)).toFixed(2);
  }, [current, partnerPoints]);

  const readyVouchers = useMemo(() => getReadyVoucherClaims(claimsState), [claimsState]);
  const readyBonuses = useMemo(() => getReadyBonusClaims(claimsState), [claimsState]);

  const filteredClients = useMemo(() => filterClients(MY_CLIENTS, clientFilter), [clientFilter]);
  const filteredSubClients = useMemo(() => filterClients(SUB_CLIENTS, subFilter), [subFilter]);

  const filteredHistory = useMemo(() => {
    return (claimsState.history || []).filter((row) => {
      if (!rowMatchesSearch(row, historyFilter.search, ["type", "ref", "amount", "claimedAt", "status"])) {
        return false;
      }
      if (historyFilter.type !== "All Types" && row.type !== historyFilter.type) return false;
      if (historyFilter.status !== "All Statuses" && row.status !== historyFilter.status) return false;
      if (!inDateRange(row.claimedAt, historyFilter.from, historyFilter.to)) return false;
      return true;
    });
  }, [claimsState.history, historyFilter]);

  function handleClaimVoucher(id) {
    setClaimsState((prev) => claimVoucherById(prev, id));
    setViewVoucher(null);
    setClaimMsg("Voucher claimed successfully.");
    setTimeout(() => setClaimMsg(""), 2500);
  }

  function handleClaimBonus(id) {
    setClaimsState((prev) => claimBonusById(prev, id));
    setViewBonus(null);
    setClaimMsg("Bonus claimed successfully.");
    setTimeout(() => setClaimMsg(""), 2500);
  }

  const voucherListColumns = [
    { key: "token", label: "Voucher Token" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-semibold text-theme-green-action">{row.amount}</span>,
    },
    { key: "platform", label: "Platform" },
    { key: "approvedAt", label: "Approved At" },
    {
      key: "userStatus",
      label: "Status",
      render: (row) => <span className="font-medium text-theme-orange">{row.userStatus}</span>,
    },
  ];

  const bonusListColumns = [
    { key: "title", label: "Bonus" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-semibold text-theme-green-action">{row.amount}</span>,
    },
    { key: "approvedAt", label: "Approved At" },
    {
      key: "userStatus",
      label: "Status",
      render: (row) => <span className="font-medium text-theme-orange">{row.userStatus}</span>,
    },
  ];

  const clientColumns = [
    { key: "accountId", label: "Account ID" },
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
        eyebrow="Partner"
        title="My Earnings"
        description="Track tier earnings, clients, and admin-approved voucher & bonus claims."
      />

      <div className="overflow-x-auto border-b border-white/10">
        <div className="flex min-w-max gap-6">
          {TABS.map((item) => {
            const active = tab === item.id;
            const badge =
              item.id === "claim-vouchers"
                ? readyVouchers.length
                : item.id === "claim-bonus"
                  ? readyBonuses.length
                  : 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setClaimMsg("");
                  setViewVoucher(null);
                  setViewBonus(null);
                }}
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

        {tab === "overview" ? (
          <div className="space-y-5">
            <section className="rounded-2xl border border-white/12 bg-[#0B1020]/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-theme-green-action/15 ring-1 ring-theme-green-action/30">
                    <Wallet className="h-7 w-7 text-theme-green-action" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/50">My Earnings</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      USD {earningsUsd}
                    </p>
                    <p className="mt-1 text-sm text-white/45">
                      Based on {currentPts} level points · up to {current?.pointsPerLot ?? 20} pts/lot
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Current tier</p>
                  <TierBadge name={current?.name || partnerTier || "Normal"} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Level points</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {currentPts}
                    {next ? <span className="text-white/40"> / {required}</span> : null}
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Progress</p>
                  <p className="mt-1 text-lg font-bold text-theme-green-action">{progressPct}%</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Next tier</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {next ? `${remaining} pts to ${next.name}` : "Max tier"}
                  </p>
                </div>
              </div>
            </section>

            {/* Stacked one-by-one action buttons */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setTab("claim-vouchers")}
                className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/12 bg-[#141A2E] p-5 text-left transition hover:border-theme-green-action/40 hover:bg-[#171E35]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-theme-green-action">
                  <Ticket className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-flex items-center text-base font-semibold text-white">
                    Claim Vouchers
                    <CountBadge count={readyVouchers.length} />
                  </span>
                  <span className="mt-1 block text-sm text-white/50">
                    Admin-approved vouchers ready for you to claim
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTab("claim-bonus")}
                className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/12 bg-[#141A2E] p-5 text-left transition hover:border-theme-orange/40 hover:bg-[#171E35]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-theme-orange">
                  <Gift className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-flex items-center text-base font-semibold text-white">
                    Claim Bonus
                    <CountBadge count={readyBonuses.length} />
                  </span>
                  <span className="mt-1 block text-sm text-white/50">
                    Admin-approved bonuses ready for you to claim
                  </span>
                </span>
              </button>
            </div>
          </div>
        ) : null}

        {tab === "clients" ? (
          <>
            <ListFilters
              search={clientFilter.search}
              onSearchChange={(v) => setClientFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search account ID or points…"
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
            <TableShell columns={clientColumns} rows={filteredClients} emptyLabel="No clients found." />
          </>
        ) : null}

        {tab === "sub-clients" ? (
          <>
            <ListFilters
              search={subFilter.search}
              onSearchChange={(v) => setSubFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search account ID or points…"
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
            <TableShell
              columns={clientColumns}
              rows={filteredSubClients}
              emptyLabel="No sub clients found."
            />
          </>
        ) : null}

        {tab === "claim-vouchers" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Claim Vouchers</h2>
              <p className="mt-1 text-sm text-white/45">
                Only vouchers approved by admin appear here. Open View to claim.
              </p>
            </div>
            <ClaimList
              items={readyVouchers}
              emptyLabel="No approved vouchers to claim."
              columns={voucherListColumns}
              onView={setViewVoucher}
            />
          </div>
        ) : null}

        {tab === "claim-bonus" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Claim Bonus</h2>
              <p className="mt-1 text-sm text-white/45">
                Only bonuses approved by admin appear here. Open View to claim.
              </p>
            </div>
            <ClaimList
              items={readyBonuses}
              emptyLabel="No approved bonuses to claim."
              columns={bonusListColumns}
              onView={setViewBonus}
            />
          </div>
        ) : null}

        <ClaimDetailModal
          open={Boolean(viewVoucher)}
          title="Claim Voucher"
          onClose={() => setViewVoucher(null)}
          onClaim={() => viewVoucher && handleClaimVoucher(viewVoucher.id)}
        >
          {viewVoucher ? (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-white/45">Voucher Token</dt>
                <dd className="mt-1 font-semibold text-white">{viewVoucher.token}</dd>
              </div>
              <div>
                <dt className="text-white/45">Amount</dt>
                <dd className="mt-1 font-semibold text-theme-green-action">{viewVoucher.amount}</dd>
              </div>
              <div>
                <dt className="text-white/45">Topup Method</dt>
                <dd className="mt-1 text-white">{viewVoucher.topupMethod}</dd>
              </div>
              <div>
                <dt className="text-white/45">Platform</dt>
                <dd className="mt-1 text-white">{viewVoucher.platform}</dd>
              </div>
              <div>
                <dt className="text-white/45">Admin Approved</dt>
                <dd className="mt-1 text-white">{viewVoucher.approvedAt}</dd>
              </div>
              <div>
                <dt className="text-white/45">Status</dt>
                <dd className="mt-1 font-medium text-theme-orange">{viewVoucher.userStatus}</dd>
              </div>
            </dl>
          ) : null}
        </ClaimDetailModal>

        <ClaimDetailModal
          open={Boolean(viewBonus)}
          title="Claim Bonus"
          onClose={() => setViewBonus(null)}
          onClaim={() => viewBonus && handleClaimBonus(viewBonus.id)}
        >
          {viewBonus ? (
            <div>
              <p className="text-base font-semibold text-white">{viewBonus.title}</p>
              <p className="mt-2 text-sm text-white/55">{viewBonus.description}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/45">Amount</dt>
                  <dd className="mt-1 font-semibold text-theme-green-action">{viewBonus.amount}</dd>
                </div>
                <div>
                  <dt className="text-white/45">Admin Approved</dt>
                  <dd className="mt-1 text-white">{viewBonus.approvedAt}</dd>
                </div>
                <div>
                  <dt className="text-white/45">Status</dt>
                  <dd className="mt-1 font-medium text-theme-orange">{viewBonus.userStatus}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </ClaimDetailModal>

        {tab === "claim-history" ? (
          <>
            <ListFilters
              search={historyFilter.search}
              onSearchChange={(v) => setHistoryFilter((p) => ({ ...p, search: v }))}
              searchPlaceholder="Search type, reference, amount…"
              filters={[
                { key: "type", label: "Type", options: ["All Types", "Voucher", "Bonus"] },
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
                { key: "amount", label: "Amount" },
                { key: "claimedAt", label: "Claimed At" },
                { key: "status", label: "Status" },
              ]}
              rows={filteredHistory}
              emptyLabel="No claims yet. Claim an approved voucher or bonus to see history."
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
