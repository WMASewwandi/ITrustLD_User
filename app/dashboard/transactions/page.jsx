"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Printer } from "lucide-react";

const ALL_TX = [
  {
    id: "164210352100",
    type: "Deposit",
    method: "USDT",
    amount: "USD 100.00",
    date: "2026-04-30",
    time: "14:22:08",
    status: "Completed",
  },
  {
    id: "100245",
    type: "Deposit",
    method: "Bank Transfer",
    amount: "USD 100.00",
    date: "2025-06-12",
    time: "14:22:08",
    status: "Completed",
  },
  {
    id: "100244",
    type: "Deposit",
    method: "Perfect Money",
    amount: "USD 250.00",
    date: "2025-06-11",
    time: "09:15:41",
    status: "Completed",
  },
  {
    id: "100242",
    type: "Deposit",
    method: "Cryptocurrency",
    amount: "USD 500.00",
    date: "2025-06-09",
    time: "11:47:55",
    status: "Pending",
  },
  {
    id: "100240",
    type: "Deposit",
    method: "Skrill",
    amount: "USD 180.00",
    date: "2025-05-28",
    time: "10:02:44",
    status: "Completed",
  },
  {
    id: "100239",
    type: "Deposit",
    method: "Neteller",
    amount: "USD 90.00",
    date: "2025-05-20",
    time: "13:11:02",
    status: "Rejected",
  },
  {
    id: "100243",
    type: "Withdrawal",
    method: "Bank Transfer",
    amount: "USD 75.00",
    date: "2025-06-10",
    time: "18:03:19",
    status: "Completed",
  },
  {
    id: "100241",
    type: "Withdrawal",
    method: "Perfect Money",
    amount: "USD 120.00",
    date: "2025-06-05",
    time: "16:20:11",
    status: "Pending Authorization",
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
  "Perfect Money Deposits",
  "Perfect Money Withdrawals",
];

const fieldClass =
  "w-full rounded-lg border border-white/12 bg-[#0B1020]/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium text-white/55";

const STATUS_STYLE = {
  Completed: "bg-theme-green-action text-white",
  Pending: "bg-amber-500 text-white",
  "Pending Authorization": "bg-amber-500 text-white",
  Rejected: "bg-[#E11D48] text-white",
};

export default function TransactionsPage() {
  const [tab, setTab] = useState("Deposit");
  const [criteria, setCriteria] = useState("All");
  const [method, setMethod] = useState("All Methods");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [applied, setApplied] = useState({ criteria: "All", method: "All Methods", from: "", to: "" });
  const [msg, setMsg] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    return ALL_TX.filter((tx) => {
      if (tx.type !== tab) return false;

      if (applied.method === "Perfect Money Deposits") {
        return tx.method === "Perfect Money" && tx.type === "Deposit";
      }
      if (applied.method === "Perfect Money Withdrawals") {
        return tx.method === "Perfect Money" && tx.type === "Withdrawal";
      }
      if (applied.method !== "All Methods" && tx.method !== applied.method) return false;

      if (applied.from && tx.date < applied.from) return false;
      if (applied.to && tx.date > applied.to) return false;

      return true;
    });
  }, [tab, applied]);

  function handleFilter(e) {
    e.preventDefault();
    setApplied({ criteria, method, from, to });
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
        {["Deposit", "Withdrawal"].map((item) => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setMsg("");
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

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="mt-6 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr_auto]">
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
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex h-[42px] items-center justify-center rounded-lg bg-theme-green-action px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Filter
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                className="inline-flex h-[42px] items-center gap-1.5 rounded-lg bg-[#1B5E67] px-4 text-sm font-semibold text-white transition hover:brightness-110"
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
          </div>
        </div>
        {msg ? <p className="mt-3 text-sm text-theme-green-action">{msg}</p> : null}
      </form>

      {/* Transaction cards */}
      <div className="mt-6 space-y-3">
        {filtered.map((tx) => (
          <article
            key={tx.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#141A2E] px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
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
          </article>
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0B1020]/60 px-5 py-12 text-center text-sm text-white/45">
            No Results Found
          </div>
        ) : null}
      </div>
    </div>
  );
}
