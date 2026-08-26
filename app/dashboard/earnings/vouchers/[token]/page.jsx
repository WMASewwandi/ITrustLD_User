"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import GiftVoucherCard, { printGiftVoucher } from "@/components/dashboard/gift-voucher-card";
import { fetchVoucherByToken } from "@/lib/loyalty-api";
import { hasUserSession } from "@/lib/auth";
import { ArrowLeft, Printer } from "lucide-react";

export default function ClientBonusVoucherPage() {
  const router = useRouter();
  const params = useParams();
  const token = String(params?.token || "");
  const voucherRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login");
      return;
    }
    if (!token) {
      setError("Voucher token is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadVoucher() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchVoucherByToken(token);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (err?.data?.code === "VERIFICATION_REQUIRED") {
            router.replace("/verify");
            return;
          }
          setError(err.message || "Voucher not found.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVoucher();
    return () => {
      cancelled = true;
    };
  }, [router, token]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/dashboard/earnings?tab=claim-vouchers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vouchers
        </Link>
        <button
          type="button"
          onClick={() => printGiftVoucher(voucherRef.current)}
          disabled={!data?.voucher}
          className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-40"
        >
          <Printer className="h-4 w-4" />
          Print voucher
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/12 bg-[#141A2E] px-5 py-12 text-center">
          <p className="text-sm text-white/50">Loading voucher…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-theme-red-action/30 bg-theme-red-action/10 px-5 py-12 text-center">
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
  );
}
