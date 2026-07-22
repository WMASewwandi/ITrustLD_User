"use client";

import AffiliateLinkCard from "@/components/dashboard/affiliate-link-card";
import { getPartnerProgress, getTierColor } from "@/lib/loyalty";

const BREAKDOWN = [
  { label: "FX Lots", points: 0 },
  { label: "Ultra Low Standard FX Lots", points: 0 },
  { label: "XM Zero FX Lots", points: 0 },
  { label: "CFD Lots", points: 0 },
  { label: "Crypto Derivatives & BTC Lots", points: 0 },
  { label: "TNDC", points: 0 },
  { label: "UNDC", points: 0 },
];

function TierBadge({ name, active = false, compact = false }) {
  const colors = getTierColor(name);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-bold uppercase tracking-wide ${
        compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      } ${active ? "opacity-100" : "opacity-60"}`}
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {name}
    </span>
  );
}

export default function PartnerLoyaltyPanel({
  partnerTier = "Normal",
  partnerPoints = 0,
  tiers = [],
}) {
  const { current, next, currentPts, required, remaining, progressPct } = getPartnerProgress(
    partnerPoints,
    partnerTier,
    tiers
  );

  const trackFillPct = (() => {
    if (!tiers.length) return 0;
    if (tiers.length === 1) return 100;
    const pts = Number(partnerPoints) || 0;
    const last = tiers[tiers.length - 1];
    if (pts >= (last?.levelPoints || 0)) return 100;

    let segmentIndex = 0;
    for (let i = 0; i < tiers.length - 1; i++) {
      if (pts >= (tiers[i].levelPoints || 0)) segmentIndex = i;
    }
    const from = tiers[segmentIndex].levelPoints || 0;
    const to = tiers[segmentIndex + 1]?.levelPoints || from;
    const frac = to > from ? Math.min(1, Math.max(0, (pts - from) / (to - from))) : 1;
    return ((segmentIndex + frac) / (tiers.length - 1)) * 100;
  })();

  const history = [
    {
      from: current?.name || "Normal",
      start: "2026-05-24",
      review: "2026-06-24",
      upgrade: "—",
      to: current?.name || "Normal",
      progress: `${currentPts}/${next ? required : currentPts}`,
      period: "2026-05-24 — 2026-08-22",
    },
  ];

  const panel =
    "rounded-2xl bg-[#141A2E] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-6";
  const panelAlt =
    "rounded-2xl bg-[#101628] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-6";

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">
            Partner program
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">My Progress</h2>
        </div>
        <TierBadge name={current?.name || "Normal"} active />
      </div>

      <section className={panel}>
        <AffiliateLinkCard />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr_0.9fr]">
        <article className={panel}>
          <div className="flex flex-wrap items-center gap-3">
            <TierBadge name={current?.name || "Normal"} active />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/45">Currently earning up to</p>
              <p className="mt-1 text-2xl font-bold text-theme-green-action sm:text-3xl">
                {current?.pointsPerLot ?? 20} points per lot
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Start date</dt>
              <dd className="font-medium text-white">26/06/2026</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Evaluation period</dt>
              <dd className="font-medium text-white">26/06/2026 – 25/07/2026</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Monthly review</dt>
              <dd className="font-medium text-white">22/07/2026</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Last upgrade</dt>
              <dd className="font-medium text-white">—</dd>
            </div>
          </dl>
        </article>

        <article className={panelAlt}>
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Level progress
            </p>
            <div className="relative mt-4 h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#0D9F1B"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - progressPct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
                <p className="text-2xl font-bold leading-none text-white">
                  {currentPts}
                  <span className="text-base font-semibold text-white/35">
                    /{next ? required : currentPts}
                  </span>
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-white/50">level points</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-theme-green-action">
              {next ? `${remaining} pts to ${next.name}` : "Max tier reached"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wide text-white/40">Days left</p>
              <p className="mt-1 text-lg font-bold text-theme-orange">4</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wide text-white/40">Period points</p>
              <p className="mt-1 text-lg font-bold text-white">{currentPts}</p>
            </div>
          </div>
        </article>

        <article className={panel}>
          <h3 className="text-sm font-semibold text-white">Points breakdown</h3>
          <ul className="mt-3 space-y-2">
            {BREAKDOWN.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-white/50">{row.label}</span>
                <span className="font-medium text-white">{row.points} pts</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={panelAlt}>
        <h3 className="text-lg font-bold text-white">Level Overview Progress</h3>
        <p className="mt-1 text-sm text-white/45">Partner tiers use level points (not USD).</p>

        <div className="mt-6 overflow-x-auto py-4">
          <div className="min-w-[720px]">
            <div className="relative mb-4 h-10">
              <div
                className="absolute top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10"
                style={{
                  left: `calc(100% / ${Math.max(tiers.length, 1) * 2})`,
                  right: `calc(100% / ${Math.max(tiers.length, 1) * 2})`,
                }}
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-theme-green-action to-[#5DDB6A] transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, trackFillPct))}%` }}
                />
              </div>
              <div
                className="relative z-10 grid h-full"
                style={{ gridTemplateColumns: `repeat(${Math.max(tiers.length, 1)}, minmax(0, 1fr))` }}
              >
                {tiers.map((tier, index) => {
                  const active = tier.name.toLowerCase() === String(partnerTier || "").toLowerCase();
                  const colors = getTierColor(tier.name);
                  const segmentStart = (index / Math.max(tiers.length - 1, 1)) * 100;
                  const reached = trackFillPct >= segmentStart - 0.01;
                  return (
                    <div key={`dot-${tier.id || tier.name}`} className="flex items-center justify-center">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          boxShadow: active ? `inset 0 0 0 2px ${colors.border}` : undefined,
                        }}
                      >
                        <span
                          className="block h-3.5 w-3.5 rounded-full ring-[3px] ring-[#0B1020]"
                          style={{
                            backgroundColor: reached ? colors.dot : "rgba(255,255,255,0.25)",
                          }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${Math.max(tiers.length, 1)}, minmax(0, 1fr))` }}
            >
              {tiers.map((tier, index) => {
                const active = tier.name.toLowerCase() === String(partnerTier || "").toLowerCase();
                const segmentStart = (index / Math.max(tiers.length - 1, 1)) * 100;
                const reached = trackFillPct >= segmentStart - 0.01;
                return (
                  <div
                    key={tier.id || tier.name}
                    className="flex flex-col items-center px-1 text-center"
                  >
                    <TierBadge name={tier.name} active={active || reached} compact />
                    <p className="mt-3 w-full text-center text-[11px] font-bold uppercase leading-snug text-white">
                      Up to {tier.pointsPerLot} points per lot
                    </p>
                    <p className="mt-1 w-full text-center text-[10px] text-white/45">
                      {tier.levelPoints === 0 ? "Starting level" : `${tier.levelPoints} level points`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                <th className="px-3 py-2 font-medium">From level</th>
                <th className="px-3 py-2 font-medium">Start date</th>
                <th className="px-3 py-2 font-medium">Monthly review</th>
                <th className="px-3 py-2 font-medium">Last upgrade</th>
                <th className="px-3 py-2 font-medium">To level</th>
                <th className="px-3 py-2 font-medium">Progress</th>
                <th className="px-3 py-2 font-medium">Evaluation period</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i} className="border-b border-white/8 text-white/80">
                  <td className="px-3 py-3">{row.from}</td>
                  <td className="px-3 py-3">{row.start}</td>
                  <td className="px-3 py-3">{row.review}</td>
                  <td className="px-3 py-3">{row.upgrade}</td>
                  <td className="px-3 py-3">{row.to}</td>
                  <td className="px-3 py-3 font-semibold text-theme-green-action">{row.progress}</td>
                  <td className="px-3 py-3">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={panel}>
        <h3 className="text-lg font-bold text-white">How it works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Earn points",
              body: "Earn account level points from active top-ups and partner trading activity.",
            },
            {
              step: "2",
              title: "Upgrade level",
              body: "When you reach the next tier’s level points, your partner level upgrades automatically.",
            },
            {
              step: "3",
              title: "Maintain status",
              body: "Keep earning within the evaluation window to maintain or improve your partner tier.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-xl bg-white/[0.04] p-4">
              <p className="text-xs font-bold text-theme-green-action">Step {item.step}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{item.body}</p>
            </div>
          ))}
        </div>
        {next ? (
          <p className="mt-4 text-xs text-white/40">
            Next target: {next.name} at {next.levelPoints} level points ({next.pointsPerLot} points per
            lot).
          </p>
        ) : null}
      </section>
    </div>
  );
}
