"use client";

import { useMemo, useState } from "react";
import BottomMessage from "@/components/dashboard/bottom-message";
import { matchesPeriod, rowMatchesSearch } from "@/lib/filter-utils";
import { ChevronDown, Download, Printer, Search } from "lucide-react";

const ALL_TX = [
  {
    id: "164210352100",
    type: "Top-up",
    method: "USDT",
    amount: "USD 100.00",
    fee: "USD 0.00",
    netAmount: "USD 100.00",
    currency: "USD",
    date: "2026-04-30",
    time: "14:22:08",
    status: "Completed",
    account: "TRC20 Wallet",
    reference: "USDT-TRC20-88421",
    note: "Crypto top-up confirmed on-chain.",
  },
  {
    id: "100245",
    type: "Top-up",
    method: "Bank Transfer",
    amount: "USD 100.00",
    fee: "USD 1.50",
    netAmount: "USD 98.50",
    currency: "USD",
    date: "2025-06-12",
    time: "14:22:08",
    status: "Completed",
    account: "Commercial Bank — 8001234567",
    reference: "BT-452198",
    note: "Local bank transfer credited successfully.",
  },
  {
    id: "100244",
    type: "Top-up",
    method: "Perfect Money",
    amount: "USD 250.00",
    fee: "USD 2.00",
    netAmount: "USD 248.00",
    currency: "USD",
    date: "2025-06-11",
    time: "09:15:41",
    status: "Completed",
    account: "U1234567",
    reference: "PM-778120",
    note: "Perfect Money top-up processed.",
  },
  {
    id: "100242",
    type: "Top-up",
    method: "Cryptocurrency",
    amount: "USD 500.00",
    fee: "USD 0.00",
    netAmount: "USD 500.00",
    currency: "USD",
    date: "2025-06-09",
    time: "11:47:55",
    status: "Pending",
    account: "BTC Wallet",
    reference: "CRYPTO-99102",
    note: "Awaiting network confirmations.",
  },
  {
    id: "100240",
    type: "Top-up",
    method: "Skrill",
    amount: "USD 180.00",
    fee: "USD 1.80",
    netAmount: "USD 178.20",
    currency: "USD",
    date: "2025-05-28",
    time: "10:02:44",
    status: "Completed",
    account: "user@email.com",
    reference: "SKR-33011",
    note: "E-wallet top-up completed.",
  },
  {
    id: "100239",
    type: "Top-up",
    method: "Neteller",
    amount: "USD 90.00",
    fee: "USD 0.90",
    netAmount: "USD 89.10",
    currency: "USD",
    date: "2025-05-20",
    time: "13:11:02",
    status: "Rejected",
    account: "neteller@email.com",
    reference: "NTL-22019",
    note: "Rejected due to mismatched account name.",
  },
  {
    id: "100243",
    type: "Cash-out",
    method: "Bank Transfer",
    amount: "USD 75.00",
    fee: "USD 2.00",
    netAmount: "USD 73.00",
    currency: "USD",
    date: "2025-06-10",
    time: "18:03:19",
    status: "Completed",
    account: "Hatton National Bank — 0690123456",
    reference: "WD-BT-11890",
    note: "Cash-out paid to saved bank account.",
  },
  {
    id: "100241",
    type: "Cash-out",
    method: "Perfect Money",
    amount: "USD 120.00",
    fee: "USD 1.20",
    netAmount: "USD 118.80",
    currency: "USD",
    date: "2025-06-05",
    time: "16:20:11",
    status: "Pending Authorization",
    account: "U7654321",
    reference: "WD-PM-44120",
    note: "Waiting for authorization before payout.",
  },
];

const CRITERIA = ["All", "Daily", "Weekly", "Monthly", "Custom"];
const METHODS = [
  "All Methods",
  "USDT",
  "Bank Transfer",
  "Perfect Money",
  "Skrill",
  "Neteller",
  "Cryptocurrency",
  "XM Local",
  "Perfect Money Top-ups",
  "Perfect Money Cash-outs",
];

const fieldClass =
  "w-full rounded-lg border border-white/12 bg-[#0B1020]/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium text-white/55";

const STATUS_STYLE = {
  Completed: "bg-theme-green-action text-white",
  Pending: "bg-theme-orange text-white",
  "Pending Authorization": "bg-theme-orange text-white",
  "In-Progress": "bg-theme-orange text-white",
  Rejected: "bg-theme-red-action text-white",
};

export default function TransactionsPage() {
  const [tab, setTab] = useState("Top-up");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("All");
  const [method, setMethod] = useState("All Methods");
  const [status, setStatus] = useState("All Statuses");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return ALL_TX.filter((tx) => {
      if (tx.type !== tab) return false;

      if (
        !rowMatchesSearch(tx, search, [
          "id",
          "method",
          "amount",
          "status",
          "account",
          "reference",
          "note",
        ])
      ) {
        return false;
      }

      if (status !== "All Statuses" && tx.status !== status) return false;

      if (method === "Perfect Money Top-ups") {
        if (!(tx.method === "Perfect Money" && tx.type === "Top-up")) return false;
      } else if (method === "Perfect Money Cash-outs") {
        if (!(tx.method === "Perfect Money" && tx.type === "Cash-out")) return false;
      } else if (method !== "All Methods" && tx.method !== method) {
        return false;
      }

      if (criteria === "Custom" || from || to) {
        if (from && tx.date < from) return false;
        if (to && tx.date > to) return false;
        if (criteria !== "Custom" && criteria !== "All" && !from && !to) {
          if (!matchesPeriod(tx.date, criteria)) return false;
        }
      } else if (!matchesPeriod(tx.date, criteria)) {
        return false;
      }

      return true;
    });
  }, [tab, search, criteria, method, status, from, to]);

  function handleResetFilters() {
    setSearch("");
    setCriteria("All");
    setMethod("All Methods");
    setStatus("All Statuses");
    setFrom("");
    setTo("");
    setMsg("");
  }

  function handlePrint(id) {
    setMsg(`PDF receipt prepared for transaction ${id} (demo).`);
    setTimeout(() => setMsg(""), 3000);
  }

  function handleExport(type) {
    setExportOpen(false);
    setMsg(`Export as ${type} prepared (demo).`);
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Transactions</h1>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b border-white/10">
        {["Top-up", "Cash-out"].map((item) => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setMsg("");
                setExpandedId(null);
              }}
              className={`relative pb-3 text-sm font-semibold transition ${
                active ? "text-white" : "text-white/45 hover:text-white/75"
              }`}
            >
              {item} History
              {active ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-theme-green-action" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Filters — live update on change */}
      <div className="mt-6 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr_auto]">
          <div>
            <label className={labelClass}>Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID, method, account, reference…"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Filter Criteria</label>
            <select value={criteria} onChange={(e) => setCriteria(e.target.value)} className={fieldClass}>
              {CRITERIA.map((c) => (
                <option key={c} value={c} className="bg-[#141A2E]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
              {["All Statuses", "Completed", "Pending", "Pending Authorization", "Rejected"].map((s) => (
                <option key={s} value={s} className="bg-[#141A2E]">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Transaction Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={fieldClass}>
              {METHODS.map((m) => (
                <option key={m} value={m} className="bg-[#141A2E]">
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 lg:col-span-full">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex h-[42px] items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Reset
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                className="inline-flex h-[42px] items-center gap-1.5 rounded-lg bg-theme-green-dark px-4 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Export
                <ChevronDown className="h-4 w-4" />
              </button>
              {exportOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#141A2E] py-1 shadow-2xl">
                  {["PDF", "CSV", "Excel"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleExport(type)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {type}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="ml-auto self-center text-xs text-white/40">
              Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {msg ? (
          <BottomMessage
            title="Export ready"
            variant="success"
            onClose={() => setMsg("")}
            primaryAction={{ label: "OK", onClick: () => setMsg("") }}
            secondaryAction={{ label: "Close", onClick: () => setMsg("") }}
          >
            {msg}
          </BottomMessage>
        ) : null}
      </div>

      {/* Transaction cards */}
      <div className="mt-6 space-y-3">
        {filtered.map((tx) => {
          const expanded = expandedId === tx.id;
          return (
            <article
              key={tx.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#141A2E] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
            >
              <div className="relative px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : tx.id)}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
                  aria-label={expanded ? "Collapse transaction details" : "Expand transaction details"}
                  aria-expanded={expanded}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                <div className="flex flex-col gap-4 pr-12 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white sm:text-base">
                      Transaction ID - <span className="text-white/85">{tx.id}</span>
                    </p>
                    <p className="mt-1 text-sm text-white/65">Transaction Method - {tx.method}</p>
                    <button
                      type="button"
                      onClick={() => handlePrint(tx.id)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0B1020]/80 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-theme-green-action/40 hover:text-theme-green-action"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </button>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLE[tx.status] || "bg-white/15 text-white"
                      }`}
                    >
                      {tx.status}
                    </span>
                    <p className="text-sm text-white/55">
                      {tx.date} {tx.time}
                    </p>
                    <p className="text-xl font-bold text-white sm:text-2xl">{tx.amount}</p>
                  </div>
                </div>
              </div>

              {expanded ? (
                <div className="border-t border-white/10 bg-[#0B1020]/55 px-5 py-4 sm:px-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">
                    Transaction details
                  </p>
                  <dl className="divide-y divide-white/8">
                    {[
                      ["Type", tx.type],
                      ["Method", tx.method],
                      ["Status", tx.status],
                      ["Currency", tx.currency],
                      ["Amount", tx.amount],
                      ["Fee", tx.fee],
                      ["Net amount", tx.netAmount],
                      ["Date", tx.date],
                      ["Time", tx.time],
                      ["Account", tx.account],
                      ["Reference", tx.reference],
                      ["Note", tx.note],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                      >
                        <dt className="shrink-0 text-sm text-white/45">{label}</dt>
                        <dd className="text-right text-sm font-medium text-white">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0B1020]/60 px-5 py-12 text-center text-sm text-white/45">
            No Results Found
          </div>
        ) : null}
      </div>
    </div>
  );
}
