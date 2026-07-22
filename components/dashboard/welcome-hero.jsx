"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function WelcomeHero({ userName = "there" }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-theme-green-action/15" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-theme-green-dark/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(13,159,27,0.14),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <div className="dash-fade-up max-w-xl text-center lg:text-left">
          <p className="mb-3 text-sm font-medium tracking-wide text-theme-green-action">
            Your account
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Welcome Back{userName !== "there" ? `, ${userName}` : ""}!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Top-up and cash-out cryptocurrencies with ease.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/dashboard/deposit"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Top-up
            </Link>
            <Link
              href="/dashboard/withdrawal"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Cash-out
            </Link>
          </div>
        </div>

        <div
          className="dash-fade-up-delay relative flex h-[220px] w-full max-w-[380px] items-center justify-center sm:h-[260px]"
          aria-hidden
        >
          <div className="dash-float-a coin-glow-usdt absolute left-8 top-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-theme-green-action to-theme-green-dark sm:h-32 sm:w-32">
            <span className="pointer-events-none absolute inset-[-14px] rounded-full bg-theme-green-action/35 coin-glow-ring" />
            <span className="pointer-events-none absolute inset-[-28px] rounded-full bg-theme-green-action/18 coin-glow-ring-soft" />
            <span className="relative z-10 text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] sm:text-4xl">₮</span>
            <span className="absolute -bottom-2 z-10 rounded-full bg-[#0B1020]/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90">
              USDT
            </span>
          </div>

          <div className="dash-float-b coin-glow-btc absolute bottom-8 right-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-theme-green-shaded to-theme-green-dark sm:h-36 sm:w-36">
            <span className="pointer-events-none absolute inset-[-14px] rounded-full bg-theme-green-shaded/40 coin-glow-ring" />
            <span className="pointer-events-none absolute inset-[-28px] rounded-full bg-theme-green-shaded/20 coin-glow-ring-soft" />
            <span className="relative z-10 text-4xl font-bold text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.55)] sm:text-5xl">₿</span>
            <span className="absolute -bottom-2 z-10 rounded-full bg-[#0B1020]/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90">
              BTC
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
