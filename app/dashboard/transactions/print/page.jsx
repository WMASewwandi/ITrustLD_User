"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TransactionReceiptPrint from "@/components/dashboard/transaction-receipt-print";
import {
  fetchDepositTransaction,
  fetchDepositTransactionsForPrint,
} from "@/lib/deposits";
import {
  fetchWithdrawalTransaction,
  fetchWithdrawalTransactionsForPrint,
} from "@/lib/withdrawals";
import { hasUserSession } from "@/lib/auth";

function TransactionsPrintContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const fromDate = searchParams.get("from_date") || "";
  const toDate = searchParams.get("to_date") || "";
  const topupMethodId = searchParams.get("topup_method_id") || "";
  const cashoutMethodId = searchParams.get("cashout_method_id") || "";
  const filterTemplate = searchParams.get("filter_template") || "";
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "deposit";
  const isWithdrawal = type === "withdrawal";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [single, setSingle] = useState(null);
  const [list, setList] = useState([]);

  const title = useMemo(() => {
    if (transactionId) {
      return isWithdrawal ? "Withdrawal Receipt" : "Deposit Receipt";
    }
    return isWithdrawal ? "Withdrawal Transaction Report" : "Deposit Transaction Report";
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
                status: status || undefined,
                search: search || undefined,
              })
            : await fetchDepositTransactionsForPrint({
                from_date: fromDate,
                to_date: toDate,
                topup_method_id: topupMethodId,
                filter_template: filterTemplate,
                status: status || undefined,
                search: search || undefined,
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
    status,
    search,
    isWithdrawal,
  ]);

  useEffect(() => {
    if (!loading && !error) {
      const timer = window.setTimeout(() => window.print(), 400);
      return () => window.clearTimeout(timer);
    }
  }, [loading, error]);

  const rows = single ? [single] : list;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-poppins text-sm text-theme-blue-dark">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8 font-poppins text-sm text-theme-red-action">
        {error}
      </div>
    );
  }

  return (
    <TransactionReceiptPrint
      title={title}
      transactions={rows}
      isWithdrawal={isWithdrawal}
      isSingle={Boolean(transactionId)}
    />
  );
}

export default function TransactionsPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white font-poppins text-sm text-theme-blue-dark">
          Loading…
        </div>
      }
    >
      <TransactionsPrintContent />
    </Suspense>
  );
}
