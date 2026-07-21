import Link from "next/link";
import { Clock3, Download, List } from "lucide-react";

const TRANSACTIONS = [
  {
    id: "100245",
    method: "Bank Transfer",
    amount: "USD 100.00",
    datetime: "2025-06-12 14:22:08",
    type: "deposit",
    status: "Completed",
  },
  {
    id: "100244",
    method: "Perfect Money",
    amount: "USD 250.00",
    datetime: "2025-06-11 09:15:41",
    type: "deposit",
    status: "Completed",
  },
  {
    id: "100243",
    method: "Bank Transfer",
    amount: "USD 75.00",
    datetime: "2025-06-10 18:03:19",
    type: "withdrawal",
    status: "Pending Authorization",
  },
  {
    id: "100242",
    method: "Cryptocurrency",
    amount: "USD 500.00",
    datetime: "2025-06-09 11:47:55",
    type: "deposit",
    status: "Pending",
  },
];

export default function RecentTransactions() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/12 bg-[#0B1020]/92 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
              <Clock3 className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Recent Transactions</h2>
          </div>
          <Link
            href="/dashboard/transactions"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-theme-green-action"
          >
            <List className="h-4 w-4" />
            View Transaction History
          </Link>
        </div>

        <div className="space-y-3">
          {TRANSACTIONS.map((tx) => (
            <article
              key={tx.id}
              className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-[#141A2E] px-5 py-4 transition hover:border-white/25 hover:bg-[#1A2238] sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  Transaction ID — <span className="text-white/80">{tx.id}</span>
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {tx.type === "withdrawal" ? "Cash-out" : "Top-up"} · {tx.method}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    tx.status === "Completed" ? "text-white/50" : "text-theme-orange"
                  }`}
                >
                  {tx.status}
                </p>
              </div>
              <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                <p className="text-xs text-white/50 sm:text-sm">{tx.datetime}</p>
                <div className="flex items-center gap-3">
                  <p
                    className={`text-lg font-semibold sm:text-xl ${
                      tx.type === "withdrawal" ? "text-[#FB7185]" : "text-theme-green-action"
                    }`}
                  >
                    {tx.type === "withdrawal" ? "−" : "+"}
                    {tx.amount}
                  </p>
                  <Link
                    href="/dashboard/transactions"
                    className="rounded-lg border border-white/20 bg-white/5 p-2 text-white/60 transition hover:border-theme-green-action/50 hover:text-theme-green-action"
                    title="Download PDF receipt"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
