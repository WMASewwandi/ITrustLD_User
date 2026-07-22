import Link from "next/link";
import { Megaphone } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-theme-green-action/25 bg-gradient-to-r from-[#0D9F1B]/20 via-[#12182C] to-theme-green-dark/30 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-theme-green-action/20" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-green-action/20 text-theme-green-action">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">
                Promotion
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                Earn double Trust Points this week
              </h2>
              <p className="mt-1 max-w-xl text-sm text-white/55">
                Complete eligible top-ups and climb Normal → Silver → Gold → Diamond → VIP → VVIP faster.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/loyalty"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            View Loyalty
          </Link>
        </div>
      </div>
    </section>
  );
}
