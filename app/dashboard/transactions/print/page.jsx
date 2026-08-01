"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchDepositTransaction,
  fetchDepositTransactionsForPrint,
} from "@/lib/deposits";
import {
  fetchWithdrawalTransaction,
  fetchWithdrawalTransactionsForPrint,
} from "@/lib/withdrawals";
import { hasUserSession } from "@/lib/auth";

export default function TransactionsPrintPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const fromDate = searchParams.get("from_date") || "";
  const toDate = searchParams.get("to_date") || "";
  const topupMethodId = searchParams.get("topup_method_id") || "";
  const cashoutMethodId = searchParams.get("cashout_method_id") || "";
  const filterTemplate = searchParams.get("filter_template") || "";
  const type = searchParams.get("type") || "deposit";
  const isWithdrawal = type === "withdrawal";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [single, setSingle] = useState(null);
  const [list, setList] = useState([]);

  const title = useMemo(() => {
    if (transactionId) {
      return isWithdrawal ? "Withdrawal Transaction Receipt" : "Deposit Transaction Receipt";
    }
    return isWithdrawal ? "Withdrawal Transactions" : "Deposit Transactions";
  }, [transactionId, isWithdrawal]);

  useEffect(() => {
    if (!hasUserSession()) {
      setError("Please log in to print transactions.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        if (transactionId) {
          const tx = isWithdrawal
            ? await fetchWithdrawalTransaction(transactionId)
            : await fetchDepositTransaction(transactionId);
          if (!cancelled) setSingle(tx);
        } else {
          const data = isWithdrawal
            ? await fetchWithdrawalTransactionsForPrint({
                from_date: fromDate,
                to_date: toDate,
                cashout_method_id: cashoutMethodId,
                filter_template: filterTemplate,
              })
            : await fetchDepositTransactionsForPrint({
                from_date: fromDate,
                to_date: toDate,
                topup_method_id: topupMethodId,
                filter_template: filterTemplate,
              });
          if (!cancelled) setList(data.transactions || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    transactionId,
    fromDate,
    toDate,
    topupMethodId,
    cashoutMethodId,
    filterTemplate,
    isWithdrawal,
  ]);

  useEffect(() => {
    if (!loading && !error) {
      const timer = window.setTimeout(() => window.print(), 400);
      return () => window.clearTimeout(timer);
    }
  }, [loading, error]);

  const rows = single ? [single] : list;

  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-4">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">
        iTrustLD — {isWithdrawal ? "Cash-out" : "Deposit"} History
      </p>

      {loading ? <p className="mt-8 text-sm text-gray-600">Loading…</p> : null}
      {error ? <p className="mt-8 text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-8 space-y-6">
          {rows.length === 0 ? (
            <p className="text-sm text-gray-600">No transactions found.</p>
          ) : (
            rows.map((tx) => (
              <section key={tx.id} className="rounded border border-gray-300 p-4">
                <h2 className="text-lg font-semibold">Transaction ID: {tx.id}</h2>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    ["Status", tx.status],
                    ["Method", tx.method],
                    ["Payment Option", tx.paymentOption],
                    ["Amount", tx.amount],
                    [
                      isWithdrawal ? "Receiving Amount" : "Payment Amount",
                      tx.receivingAmount || tx.paymentAmount,
                    ],
                    ["Platform Account", tx.account],
                    ["Date", `${tx.date} ${tx.time}`],
                    ["Message", tx.note || "—"],
                    ...(tx.rejectedReason ? [["Rejected Reason", tx.rejectedReason]] : []),
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-medium text-gray-600">{label}</dt>
                      <dd className="mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
