"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GiftVoucherCard, { printGiftVoucher } from "@/components/dashboard/gift-voucher-card";
import VoucherCountdown from "@/components/dashboard/voucher-countdown";
import { fetchVoucherByToken } from "@/lib/loyalty-api";
import { Printer, X } from "lucide-react";

export default function VoucherViewModal({ token, open, onClose }) {
  const voucherRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !token) return undefined;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setData(null);
      try {
        const result = await fetchVoucherByToken(token);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load voucher.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [open, token]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-[2px] sm:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Client bonus voucher"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 bg-[#0B1020] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white sm:text-base">Client Bonus Voucher</h3>
            {data?.voucher ? (
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <VoucherCountdown
                  expiresAt={data.voucher.expires_at}
                  createdAt={data.voucher.created_at}
                  status={data.voucher.status}
                  compact
                />
                {data.voucher.valid_until ? (
                  <span className="text-[11px] text-white/40">Valid until {data.voucher.valid_until}</span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => printGiftVoucher(voucherRef.current)}
              disabled={!data?.voucher}
              className="inline-flex items-center gap-1.5 rounded-lg bg-theme-green-action px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-40 sm:text-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center px-4">
              <p className="text-sm text-slate-500">Loading voucher…</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] items-center justify-center px-4">
              <p className="text-sm font-medium text-theme-red-action">{error}</p>
            </div>
          ) : (
            <GiftVoucherCard
              ref={voucherRef}
              voucher={data?.voucher}
              accountHolder={data?.account_holder}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
