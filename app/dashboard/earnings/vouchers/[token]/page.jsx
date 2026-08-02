"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchVoucherByToken } from "@/lib/loyalty-api";
import { hasUserSession } from "@/lib/auth";
import { ArrowLeft, Printer } from "lucide-react";

export default function ClientBonusVoucherPage() {
  const router = useRouter();
  const params = useParams();
  const token = String(params?.token || "");
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

  const voucher = data?.voucher;
  const account = data?.account_holder;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/dashboard/earnings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vouchers
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
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
        <article className="overflow-hidden rounded-3xl border border-white/12 bg-white text-[#0B1020] shadow-2xl print:rounded-none print:border-0 print:shadow-none">
          <div className="grid min-h-[520px] md:grid-cols-[2fr_3fr]">
            <section className="relative flex flex-col justify-between bg-gradient-to-br from-[#0B1B4D] via-[#13235F] to-[#1A2F74] p-8 text-white">
              <div>
                <img
                  src="/assets/img/logos/logo-itrustld-wide.png"
                  alt="iTrustLD"
                  className="h-10 w-auto opacity-95"
                />
              </div>
              <div className="my-10">
                <p className="text-sm uppercase tracking-[0.2em] text-[#FBC351]/80">Client bonus voucher</p>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <p className="text-6xl font-bold text-[#FBC351]">
                    ${Number(voucher?.amount || 0).toFixed(0)}
                  </p>
                  <div className="border-l border-[#FBC351]/60 pl-4">
                    <p className="text-lg">{account?.first_name || "—"}</p>
                    <p className="text-2xl font-bold">{account?.last_name || ""}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
                <p>ID: {account?.account_number || "—"}</p>
                <p>www.ItrustLD.com</p>
              </div>
            </section>

            <section className="flex flex-col justify-between bg-[#F7FAFC] p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5C50C0]">Gift voucher</p>
                <h1 className="mt-2 text-2xl font-bold text-[#0B1020]">Deposit instructions</h1>
                <p className="mt-4 text-sm leading-7 text-[#334155]">
                  Login to iTrustLD. Go to the deposit section. Choose the selected topup method and USD currency.
                  Enter the voucher amount shown on this card. Upload this voucher in the upload area, then submit.
                  Check your wallet after processing.
                </p>
              </div>

              <div className="my-8 flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-[#0B1020]">Platform ID</p>
                <span className="rounded-full bg-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0B1020]">
                  {voucher?.platform_id || "—"}
                </span>
                <span className="rounded-full bg-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0B1020]">
                  {voucher?.topup_method || voucher?.method || "—"}
                </span>
              </div>

              <div className="space-y-2 border-t border-[#E2E8F0] pt-6 text-sm text-[#64748B]">
                <p>Token: {voucher?.token || "—"}</p>
                <p>Issued: {voucher?.created_at || "—"}</p>
                <p>Status: {voucher?.status || "Pending"}</p>
                <p>This is computer generated. No signature is required.</p>
              </div>
            </section>
          </div>
        </article>
      )}
    </div>
  );
}
