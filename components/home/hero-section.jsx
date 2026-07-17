import Link from "next/link";

const stats = [
  {
    label: "Members",
    value: "82K+",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9" r="2.2" />
        <path d="M3.5 18.5C4.2 15.8 6.3 14.2 9 14.2C11.7 14.2 13.8 15.8 14.5 18.5" />
        <path d="M14.2 18.5C14.7 16.6 16.2 15.5 18.2 15.5C19.7 15.5 20.9 16.3 21.5 17.6" />
      </svg>
    )
  },
  {
    label: "Deposits",
    value: "2.4M",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="2.5" />
        <path d="M4 10H20" />
        <circle cx="8.5" cy="14" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    label: "Withdrawals",
    value: "2.2M",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8.5H17.5" />
        <path d="M14.5 5.5L17.5 8.5L14.5 11.5" />
        <path d="M17 15.5H6.5" />
        <path d="M9.5 12.5L6.5 15.5L9.5 18.5" />
      </svg>
    )
  },
  {
    label: "Support",
    value: "24/7",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12V11C5 7.1 8.1 4 12 4C15.9 4 19 7.1 19 11V12" />
        <path d="M5 12H6.5C7.3 12 8 12.7 8 13.5V16.5C8 17.3 7.3 18 6.5 18H5V12Z" />
        <path d="M19 12H17.5C16.7 12 16 12.7 16 13.5V16.5C16 17.3 16.7 18 17.5 18H19V12Z" />
        <path d="M19 16.5V17.5C19 19.4 17.4 21 15.5 21H13" />
      </svg>
    )
  }
];

function Sparkline({ className = "" }) {
  return (
    <svg viewBox="0 0 64 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M1 18C8 18 10 8 18 10C26 12 28 4 36 6C44 8 48 16 55 12C58 10.5 61 8 63 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section id="home-hero" className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-[#070B16] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070B16]/75 via-[#070B16]/35 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B16]/55 via-transparent to-[#070B16]/25" aria-hidden="true" />

      <div className="container-shell relative grid min-h-screen items-center gap-10 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-12">
        <div className="hero-copy max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/35 bg-[#0B1220]/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 shadow-[0_0_24px_rgba(13,159,27,0.12)] backdrop-blur-md sm:text-xs">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-theme-green-action/15 text-theme-green-action">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
                <path d="M9.5 12.2L11.2 13.9L14.8 10.2" />
              </svg>
            </span>
            Trusted Digital Exchange Platform
          </p>

          <h1 className="mt-6 text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4-5xl lg:text-5-6xl">
            Exchange Your Digital Currencies
            <span className="mt-1 block">
              <span className="hero-green-glow">Seamlessly</span>{" "}
              <span className="text-white">and</span>{" "}
              <span className="hero-green-glow">Securely</span>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-md leading-7 text-white/70 sm:text-md-lg sm:leading-8">
            Experience fast transactions, secure account handling, and a clean user journey designed for modern digital
            finance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-[4px] bg-gradient-to-r from-[#0B8A18] to-theme-green-action px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(13,159,27,0.35)] transition hover:brightness-110"
            >
              Get Started
              <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/help"
              className="group inline-flex items-center gap-2 rounded-[4px] border border-white/25 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.08]"
            >
              Learn More
              <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]/45 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-start gap-2 px-1 sm:items-center sm:px-2 sm:text-center">
                  <span className="text-white">{stat.icon}</span>
                  <p className="text-xl font-semibold text-white sm:text-2xl">{stat.value}</p>
                  <p className="text-xs text-white/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual relative mx-auto hidden w-full max-w-[440px] lg:block xl:max-w-[480px]">
          <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_65%)] blur-2xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full bg-theme-green-action/15 blur-3xl" aria-hidden="true" />

          <div className="hero-card relative rounded-[1.35rem] border border-cyan-300/25 bg-[#0B1220]/55 p-6 shadow-[0_0_0_1px_rgba(103,232,249,0.08),0_24px_80px_rgba(0,0,0,0.45),0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-2xl xl:p-7">
            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-white/[0.07] via-transparent to-cyan-400/[0.04]" aria-hidden="true" />

            <div className="relative">
              <p className="text-sm text-white/55">Portfolio Overview</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-3xl font-semibold tracking-tight text-white xl:text-4xl">$128,940.62</p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-theme-green-action/30 bg-theme-green-action/10 text-theme-green-action shadow-[0_0_18px_rgba(13,159,27,0.25)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 14L12 9L17 14" />
                    <path d="M12 9V19" />
                  </svg>
                </span>
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#121A2B]/75 px-3.5 py-3.5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7931A] text-sm font-bold text-white shadow-[0_8px_20px_rgba(247,147,26,0.35)]">
                    ₿
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/50">BTC Wallet</p>
                    <p className="truncate text-sm font-semibold text-white">1.8475 BTC</p>
                  </div>
                  <Sparkline className="h-6 w-14 text-theme-green-action" />
                  <span className="text-sm font-semibold text-theme-green-action">+4.2%</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#121A2B]/75 px-3.5 py-3.5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#26A17B] text-xs font-bold text-white shadow-[0_8px_20px_rgba(38,161,123,0.35)]">
                    ₮
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/50">USDT Wallet</p>
                    <p className="truncate text-sm font-semibold text-white">42,120 USDT</p>
                  </div>
                  <Sparkline className="h-6 w-14 text-theme-green-action" />
                  <span className="text-sm font-semibold text-theme-green-action">+1.8%</span>
                </div>
              </div>

              <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-theme-green-action/25 bg-theme-green-action/10 px-4 py-2.5 text-sm text-white/90">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-theme-green-action" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
                  <path d="M9.5 12.2L11.2 13.9L14.8 10.2" />
                </svg>
                Fast payout processing enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
