"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";
import { fetchDepositTransaction } from "@/lib/deposits";
import {
  buildPartnerReturnUrl,
  fetchPendingPartnerReturn,
  openPartnerReturnUrl,
} from "@/lib/payment-gateway";
import { fetchWithdrawalTransaction } from "@/lib/withdrawals";
import BottomMessage from "@/components/dashboard/bottom-message";

export const PARTNER_WAIT_FLAG = "itrustld-partner-wait";

export default function PartnerCheckoutWaitModal({ kind, transactionId, returnUrl = "" }) {
  const [phase, setPhase] = useState("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [mounted, setMounted] = useState(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(PARTNER_WAIT_FLAG, "1");
    } catch {
      // ignore
    }
    return () => {
      try {
        sessionStorage.removeItem(PARTNER_WAIT_FLAG);
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "pending" || typeof window === "undefined") return undefined;
    const lockedUrl = `${window.location.pathname}${window.location.search}`;
    window.history.pushState({ partnerWait: true }, "", lockedUrl);
    function onPopState() {
      window.history.pushState({ partnerWait: true }, "", lockedUrl);
    }
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [phase]);

  useEffect(() => {
    if (!transactionId || phase !== "pending") return undefined;
    let cancelled = false;

    async function poll() {
      if (cancelled || redirectingRef.current) return;
      try {
        const tx =
          kind === "withdrawal"
            ? await fetchWithdrawalTransaction(transactionId)
            : await fetchDepositTransaction(transactionId);
        const status = String(tx?.status || "");
        if (cancelled) return;

        if (status === "Completed") {
          redirectingRef.current = true;
          let url = "";
          try {
            const data = await fetchPendingPartnerReturn();
            url = String(data?.redirect_url || "").trim();
          } catch {
            url = "";
          }
          if (!url && returnUrl) {
            url = buildPartnerReturnUrl(returnUrl, {
              type: kind === "withdrawal" ? "withdrawal" : "deposit",
              referenceId: transactionId,
              status: "Completed",
              currency: tx?.currency,
            });
          }
          if (url) {
            const opened = openPartnerReturnUrl(url);
            if (!opened) {
              window.location.assign(url);
              return;
            }
            window.location.href = "/dashboard/transactions";
            return;
          }
          redirectingRef.current = false;
        }

        if (status === "Rejected") {
          setRejectReason(tx.rejectedReason || "Your transaction has been rejected.");
          setPhase("rejected");
        }
      } catch {
        // Keep waiting if a poll fails.
      }
    }

    poll();
    const intervalId = window.setInterval(poll, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [kind, transactionId, phase, returnUrl]);

  if (!mounted) return null;

  if (phase === "rejected") {
    return createPortal(
      <div className="fixed inset-0 z-[11000]">
        <BottomMessage
          title="Transaction rejected"
          variant="error"
          dismissible
          className="!z-[11000]"
          onClose={() => {
            window.location.href = "/dashboard/transactions";
          }}
          primaryAction={{ label: "View Transactions", href: "/dashboard/transactions" }}
          secondaryAction={{ label: "Close", href: "/dashboard/transactions" }}
        >
          {rejectReason}
        </BottomMessage>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[11000]"
      role="dialog"
      aria-modal="true"
      aria-label="Waiting for review"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" aria-hidden />
      <div
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border border-white/10 bg-[#0B1020] px-5 py-8 shadow-[0_-16px_50px_rgba(0,0,0,0.5)] lg:inset-0 lg:m-auto lg:h-fit lg:max-w-md lg:rounded-2xl"
      >
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-theme-green-action" />
        <h3 className="mt-4 text-center text-lg font-bold text-white">Please wait</h3>
        <p className="mt-3 text-center text-sm leading-relaxed text-white/75">
          Your {kind === "withdrawal" ? "cash-out" : "top-up"} has been submitted. Please wait until this
          transaction is completed. You cannot leave this page until it is completed or rejected.
        </p>
        {transactionId ? (
          <p className="mt-4 text-center text-xs text-white/45">Transaction ID {transactionId}</p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
