"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BottomMessage from "@/components/dashboard/bottom-message";
import {
  criteriaToFilterTemplate,
  downloadDepositTransactionsExport,
  fetchDepositTransactions,
} from "@/lib/deposits";
import {
  downloadWithdrawalTransactionsExport,
  fetchWithdrawalTransactions,
} from "@/lib/withdrawals";
import { hasUserSession } from "@/lib/auth";
import { ChevronDown, Download, Loader2, Printer, Search } from "lucide-react";

const CRITERIA = ["All", "Daily", "Weekly", "Monthly", "Custom"];
const STATUS_OPTIONS = ["All Statuses", "Completed", "Pending", "Rejected"];

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

const DEFAULT_FILTERS = {
  search: "",
  criteria: "All",
  method: "",
  status: "All Statuses",
  from: "",
  to: "",
};

function buildPrintUrl(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && String(value).trim() !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return `/dashboard/transactions/print${query ? `?${query}` : ""}`;
}

function buildListParams(filters, page, methodIdKey) {
  const filterTemplate = criteriaToFilterTemplate(filters.criteria);
  const params = {
    page,
    per_page: 10,
    filter_template: filterTemplate || undefined,
    from_date:
      filters.criteria === "Custom" || filters.criteria === "Daily"
        ? filters.from || undefined
        : undefined,
    to_date:
      filters.criteria === "Custom" || filters.criteria === "Daily"
        ? filters.to || undefined
        : undefined,
    [methodIdKey]: filters.method || undefined,
    status: filters.status !== "All Statuses" ? filters.status : undefined,
    search: filters.search.trim() || undefined,
  };

  if (filters.criteria === "Daily" && !filters.from && !filters.to) {
    const today = new Date();
    const ymd = today.toISOString().slice(0, 10);
    params.from_date = ymd;
    params.to_date = ymd;
  }

  return params;
}

function tabFromQuery(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "cash-out" || normalized === "cashout" || normalized === "withdrawal") {
    return "Cash-out";
  }
  return "Top-up";
}

function tabToQuery(tab) {
  return tab === "Cash-out" ? "cash-out" : "top-up";
}

export default function TransactionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchDebounceRef = useRef(null);
  const skipSearchDebounceRef = useRef(true);

  const [tab, setTab] = useState(() => tabFromQuery(searchParams.get("tab")));
  const [depositFilters, setDepositFilters] = useState(DEFAULT_FILTERS);
  const [withdrawalFilters, setWithdrawalFilters] = useState(DEFAULT_FILTERS);
  const [msg, setMsg] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [topupMethods, setTopupMethods] = useState([]);
  const [cashoutMethods, setCashoutMethods] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [withdrawalPagination, setWithdrawalPagination] = useState({
    page: 1,
    total_pages: 1,
    total: 0,
  });

  const filters = tab === "Top-up" ? depositFilters : withdrawalFilters;
  const setFilters = tab === "Top-up" ? setDepositFilters : setWithdrawalFilters;
  const rows = tab === "Top-up" ? deposits : withdrawals;
  const activePagination = tab === "Top-up" ? pagination : withdrawalPagination;

  const depositFiltersRef = useRef(depositFilters);
  const withdrawalFiltersRef = useRef(withdrawalFilters);
  const tabRef = useRef(tab);
  depositFiltersRef.current = depositFilters;
  withdrawalFiltersRef.current = withdrawalFilters;
  tabRef.current = tab;

  const updateTabInUrl = useCallback(
    (nextTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tabToQuery(nextTab));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadDeposits = useCallback(
    async (page = 1, overrides = {}) => {
      if (!hasUserSession()) {
        router.replace("/login");
        return;
      }

      setLoading(true);
      setPageError("");
      try {
        const merged = { ...depositFiltersRef.current, ...overrides };
        const params = buildListParams(merged, page, "topup_method_id");
        const data = await fetchDepositTransactions(params);
        setDeposits(data.transactions || []);
        setTopupMethods(data.topup_methods || []);
        setPagination(data.pagination || { page: 1, total_pages: 1, total: 0 });
      } catch (err) {
        if (err.status === 403) {
          setPageError("You do not have permission to view deposit transactions.");
        } else if (err.data?.code === "VERIFICATION_REQUIRED" || err.message?.includes("verification")) {
          router.replace("/verify");
        } else {
          setPageError(err.message || "Failed to load deposit transactions.");
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const loadWithdrawals = useCallback(
    async (page = 1, overrides = {}) => {
      if (!hasUserSession()) {
        router.replace("/login");
        return;
      }

      setLoading(true);
      setPageError("");
      try {
        const merged = { ...withdrawalFiltersRef.current, ...overrides };
        const params = buildListParams(merged, page, "cashout_method_id");
        const data = await fetchWithdrawalTransactions(params);
        setWithdrawals(data.transactions || []);
        setCashoutMethods(data.cashout_methods || []);
        setWithdrawalPagination(data.pagination || { page: 1, total_pages: 1, total: 0 });
      } catch (err) {
        if (err.status === 403) {
          setPageError("You do not have permission to view withdrawal transactions.");
        } else if (err.data?.code === "VERIFICATION_REQUIRED" || err.message?.includes("verification")) {
          router.replace("/verify");
        } else {
          setPageError(err.message || "Failed to load withdrawal transactions.");
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const nextTab = tabFromQuery(searchParams.get("tab"));
    setTab((current) => (current === nextTab ? current : nextTab));
  }, [searchParams]);

  useEffect(() => {
    if (tab === "Top-up") {
      loadDeposits(1);
    } else {
      loadWithdrawals(1);
    }
  }, [tab, loadDeposits, loadWithdrawals]);

  useEffect(() => {
    if (skipSearchDebounceRef.current) {
      skipSearchDebounceRef.current = false;
      return undefined;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      if (tabRef.current === "Top-up") {
        loadDeposits(1);
      } else {
        loadWithdrawals(1);
      }
    }, 400);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [depositFilters.search, withdrawalFilters.search, loadDeposits, loadWithdrawals]);

  function handleTabChange(item) {
    setTab(item);
    setMsg("");
    setExpandedId(null);
    updateTabInUrl(item);
  }

  function handleResetFilters() {
    if (tab === "Top-up") {
      setDepositFilters(DEFAULT_FILTERS);
      loadDeposits(1, DEFAULT_FILTERS);
    } else {
      setWithdrawalFilters(DEFAULT_FILTERS);
      loadWithdrawals(1, DEFAULT_FILTERS);
    }
    setMsg("");
  }

  function handleApplyFilters() {
    if (tab === "Top-up") {
      loadDeposits(1);
    } else {
      loadWithdrawals(1);
    }
  }

  function handlePrint(id) {
    window.open(
      buildPrintUrl({
        transactionId: id,
        type: tab === "Cash-out" ? "withdrawal" : "deposit",
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  function handlePrintFiltered() {
    const filterTemplate = criteriaToFilterTemplate(filters.criteria);
    window.open(
      buildPrintUrl({
        from_date: filters.from || undefined,
        to_date: filters.to || undefined,
        topup_method_id: tab === "Top-up" ? filters.method || undefined : undefined,
        cashout_method_id: tab === "Cash-out" ? filters.method || undefined : undefined,
        filter_template: filterTemplate || undefined,
        status: filters.status !== "All Statuses" ? filters.status : undefined,
        search: filters.search.trim() || undefined,
        type: tab === "Cash-out" ? "withdrawal" : "deposit",
      }),
      "_blank",
      "noopener,noreferrer",
    );
    setExportOpen(false);
  }

  async function handleExport(type) {
    setExportOpen(false);

    if (type === "CSV" || type === "Excel") {
      try {
        const { blob, filename } =
          tab === "Cash-out"
            ? await downloadWithdrawalTransactionsExport()
            : await downloadDepositTransactionsExport();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        setMsg(
          tab === "Cash-out"
            ? "Withdrawal transactions exported successfully."
            : "Deposit transactions exported successfully.",
        );
      } catch (err) {
        setMsg(err.message || "Export failed.");
      }
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    if (type === "PDF") {
      handlePrintFiltered();
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Transactions</h1>

      <div className="mt-6 flex gap-6 border-b border-white/10">
        {["Top-up", "Cash-out"].map((item) => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => handleTabChange(item)}
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

      <div className="mt-6 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr_auto]">
          <div>
            <label className={labelClass}>Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="ID, method, account, reference…"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Filter Criteria</label>
            <select
              value={filters.criteria}
              onChange={(e) => setFilters((prev) => ({ ...prev, criteria: e.target.value }))}
              className={fieldClass}
            >
              {CRITERIA.map((c) => (
                <option key={c} value={c} className="bg-[#141A2E]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className={fieldClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-[#141A2E]">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>From</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>To</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Transaction Method</label>
            <select
              value={filters.method}
              onChange={(e) => setFilters((prev) => ({ ...prev, method: e.target.value }))}
              className={fieldClass}
            >
              <option value="" className="bg-[#141A2E]">
                All Methods
              </option>
              {(tab === "Top-up" ? topupMethods : cashoutMethods).map((m) => (
                <option key={m.id} value={m.id} className="bg-[#141A2E]">
                  {m.name}
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
            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex h-[42px] items-center justify-center rounded-lg bg-theme-green-action px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Filter
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
              Showing {rows.length} result{rows.length === 1 ? "" : "s"}
              {activePagination.total ? ` of ${activePagination.total}` : ""}
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

      {pageError ? (
        <div className="mt-6 rounded-xl border border-theme-red-action/30 bg-theme-red-action/10 px-4 py-3 text-sm text-theme-red-action">
          {pageError}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 flex items-center justify-center text-white/50">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading transactions…
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.map((tx) => {
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
                      ["Payment Option", tx.paymentOption || "—"],
                      ["Status", tx.status],
                      ["Currency", tx.currency],
                      ["Amount", tx.amount],
                      [
                        tab === "Cash-out" ? "Receiving Amount" : "Payment Amount",
                        tx.receivingAmount || tx.paymentAmount || tx.amount,
                      ],
                      ["Fee", tx.fee || "—"],
                      ["Net amount", tx.netAmount || tx.amount],
                      ["Date", tx.date],
                      ["Time", tx.time],
                      ["Account", tx.account],
                      ["Reference", tx.reference || tx.id],
                      ["Note", tx.note || "—"],
                      ...(tx.rejectedReason ? [["Rejected Reason", tx.rejectedReason]] : []),
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

        {!loading && rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0B1020]/60 px-5 py-12 text-center text-sm text-white/45">
            No Results Found
          </div>
        ) : null}
      </div>

      {tab === "Top-up" && pagination.total_pages > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => loadDeposits(pagination.page - 1)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-white/50">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.total_pages || loading}
            onClick={() => loadDeposits(pagination.page + 1)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      {tab === "Cash-out" && withdrawalPagination.total_pages > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={withdrawalPagination.page <= 1 || loading}
            onClick={() => loadWithdrawals(withdrawalPagination.page - 1)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-white/50">
            Page {withdrawalPagination.page} of {withdrawalPagination.total_pages}
          </span>
          <button
            type="button"
            disabled={withdrawalPagination.page >= withdrawalPagination.total_pages || loading}
            onClick={() => loadWithdrawals(withdrawalPagination.page + 1)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
