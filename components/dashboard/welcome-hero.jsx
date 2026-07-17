"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function WelcomeHero({ userName = "there" }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-theme-green-action/15" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#3B82F6]/12" />
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
            Deposit and withdraw cryptocurrencies with ease.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/dashboard/deposit"
              className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,159,27,0.35)] transition hover:brightness-110"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </Link>
            <Link
              href="/dashboard/withdrawal"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E11D48] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(225,29,72,0.3)] transition hover:brightness-110"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </Link>
          </div>
        </div>

        <div
          className="dash-fade-up-delay relative flex h-[220px] w-full max-w-[380px] items-center justify-center sm:h-[260px]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-[2rem] border border-white/8 bg-white/[0.03]" />

          <div className="dash-float-a coin-glow-usdt absolute left-8 top-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#26A17B] to-[#1A7A5C] sm:h-32 sm:w-32">
            <span className="pointer-events-none absolute inset-[-14px] rounded-full bg-[#26A17B]/35 coin-glow-ring" />
            <span className="pointer-events-none absolute inset-[-28px] rounded-full bg-[#26A17B]/18 coin-glow-ring-soft" />
            <span className="relative z-10 text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] sm:text-4xl">₮</span>
            <span className="absolute -bottom-2 z-10 rounded-full bg-[#0B1020]/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90">
              USDT
            </span>
          </div>

          <div className="dash-float-b coin-glow-btc absolute bottom-8 right-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#F7931A] to-[#E27602] sm:h-36 sm:w-36">
            <span className="pointer-events-none absolute inset-[-14px] rounded-full bg-[#F7931A]/40 coin-glow-ring" />
            <span className="pointer-events-none absolute inset-[-28px] rounded-full bg-[#F7931A]/20 coin-glow-ring-soft" />
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
