"use client";

import AffiliateLinkCard from "@/components/dashboard/affiliate-link-card";
import { formatPartnerPoints, getPartnerProgress, getTierColor } from "@/lib/loyalty";

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

function formatPoints(value) {
  const n = Number(value) || 0;
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function PartnerLoyaltyPanel({
  affiliateCode = "",
  partnerTier = "Normal",
  partnerPoints = 0,
  tiers = [],
  partnerProgress = null,
}) {
  const resolvedTiers = partnerProgress?.tiers?.length ? partnerProgress.tiers : tiers;
  const resolvedTier = partnerProgress?.current_tier || partnerTier;
  const resolvedPoints = Number(partnerProgress?.period_points ?? partnerPoints) || 0;
  const evaluation = partnerProgress?.evaluation || {};
  const pointsBreakdown = partnerProgress?.points_breakdown || [];
  const levelOverviewRows = partnerProgress?.level_overview?.rows || [];

  const { current, next, currentPts, required, remaining, progressPct } = getPartnerProgress(
    resolvedPoints,
    resolvedTier,
    resolvedTiers,
  );

  const displayProgressPct = Number(partnerProgress?.progress_percentage ?? progressPct) || 0;
  const pointsPerLot = partnerProgress?.points_per_lot ?? current?.pointsPerLot ?? 20;
  const pointsToNext = Number(partnerProgress?.points_to_next ?? remaining) || 0;
  const tierTarget = Number(partnerProgress?.tier_target ?? required) || required;

  const trackFillPct = Number(partnerProgress?.track_position_pct) || (() => {
    if (!resolvedTiers.length) return displayProgressPct;
    if (resolvedTiers.length === 1) return 100;
    const pts = resolvedPoints;
    const last = resolvedTiers[resolvedTiers.length - 1];
    if (pts >= (last?.levelPoints || 0)) return 100;

    let segmentIndex = 0;
    for (let i = 0; i < resolvedTiers.length - 1; i += 1) {
      if (pts >= (resolvedTiers[i].levelPoints || 0)) segmentIndex = i;
    }
    const from = resolvedTiers[segmentIndex].levelPoints || 0;
    const to = resolvedTiers[segmentIndex + 1]?.levelPoints || from;
    const frac = to > from ? Math.min(1, Math.max(0, (pts - from) / (to - from))) : 1;
    return ((segmentIndex + frac) / (resolvedTiers.length - 1)) * 100;
  })();

  const history =
    levelOverviewRows.length > 0
      ? levelOverviewRows
      : [
          {
            from_level: current?.name || "Normal",
            to_level: next?.name || current?.name || "Normal",
            start_date: evaluation.start_date || "—",
            monthly_review: evaluation.monthly_review || "—",
            last_upgrade: evaluation.last_upgrade || "—",
            progress: next ? `${formatPoints(currentPts)}/${formatPoints(tierTarget)}` : formatPoints(currentPts),
            evaluation_period: evaluation.period_label || "—",
            is_current: true,
          },
        ];

  const panel =
    "rounded-2xl bg-[#141A2E] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-6";
  const panelAlt =
    "rounded-2xl bg-[#101628] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-6";

  const progressLabel =
    currentPts >= 10000
      ? `${formatPartnerPoints(currentPts)}/${formatPartnerPoints(tierTarget)}`
      : `${formatPoints(currentPts)}/${formatPoints(tierTarget)}`;

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">
            Partner program
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">My Progress</h2>
        </div>
        <TierBadge name={current?.name || resolvedTier || "Normal"} active />
      </div>

      {affiliateCode ? (
        <section className={panel}>
          <AffiliateLinkCard affiliateCode={affiliateCode} />
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr_0.9fr]">
        <article className={panel}>
          <div className="flex flex-wrap items-center gap-3">
            <TierBadge name={current?.name || resolvedTier || "Normal"} active />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/45">Currently earning up to</p>
              <p className="mt-1 text-2xl font-bold text-theme-green-action sm:text-3xl">
                {pointsPerLot} points per lot
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Start date</dt>
              <dd className="font-medium text-white">{evaluation.start_date || "—"}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Evaluation period</dt>
              <dd className="font-medium text-white">{evaluation.period_label || "—"}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Monthly review</dt>
              <dd className="font-medium text-white">{evaluation.monthly_review || "—"}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <dt className="text-white/45">Last upgrade</dt>
              <dd className="font-medium text-white">{evaluation.last_upgrade || "—"}</dd>
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
                  strokeDashoffset={2 * Math.PI * 48 * (1 - Math.min(100, displayProgressPct) / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <p className="text-lg font-bold leading-tight text-white sm:text-xl">
                  {progressLabel}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-white/50">level points</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-theme-green-action">
              {next
                ? `${formatPoints(pointsToNext)} pts to ${next.name}`
                : "Max tier reached"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wide text-white/40">Days left</p>
              <p className="mt-1 text-lg font-bold text-theme-orange">
                {evaluation.days_left ?? 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wide text-white/40">Period points</p>
              <p className="mt-1 text-lg font-bold text-white">{formatPoints(currentPts)}</p>
            </div>
          </div>
        </article>

        <article className={panel}>
          <h3 className="text-sm font-semibold text-white">Points breakdown</h3>
          <ul className="mt-3 space-y-2">
            {pointsBreakdown.length ? (
              pointsBreakdown.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-white/50">{row.label}</span>
                  <span className="font-medium text-white">{formatPoints(row.points)} pts</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-white/45">No points earned in the current period yet.</li>
            )}
          </ul>
        </article>
      </section>

      <section className={panelAlt}>
        <h3 className="text-lg font-bold text-white">Level Overview Progress</h3>
        <p className="mt-1 text-sm text-white/45">Partner tiers use level points earned in the last 12 months.</p>

        <div className="mt-6 overflow-x-auto py-4">
          <div className="min-w-[720px]">
            <div className="relative mb-4 h-10">
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10"
                  style={{
                    left: `calc(100% / ${Math.max(resolvedTiers.length, 1) * 2})`,
                    right: `calc(100% / ${Math.max(resolvedTiers.length, 1) * 2})`,
                  }}
                  aria-hidden
                >
                  <div
                    className="h-full max-w-full rounded-full bg-gradient-to-r from-theme-green-action to-[#5DDB6A] transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(100, trackFillPct))}%` }}
                  />
                </div>
              <div
                className="relative z-10 grid h-full"
                style={{ gridTemplateColumns: `repeat(${Math.max(resolvedTiers.length, 1)}, minmax(0, 1fr))` }}
              >
                {resolvedTiers.map((tier, index) => {
                  const active =
                    tier.name.toLowerCase() === String(resolvedTier || "").toLowerCase();
                  const colors = getTierColor(tier.name);
                  const reached = resolvedPoints >= (Number(tier.levelPoints) || 0);
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
              style={{ gridTemplateColumns: `repeat(${Math.max(resolvedTiers.length, 1)}, minmax(0, 1fr))` }}
            >
              {resolvedTiers.map((tier) => {
                const active =
                  tier.name.toLowerCase() === String(resolvedTier || "").toLowerCase();
                const reached = resolvedPoints >= (Number(tier.levelPoints) || 0);
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
                      {tier.levelPoints === 0
                        ? "Starting level"
                        : `${formatPoints(tier.levelPoints)} level points`}
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
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-white/45">
                    No level history yet. Earn points to start your partner tier progress.
                  </td>
                </tr>
              ) : (
                history.map((row, i) => (
                  <tr
                    key={`${row.from_level}-${row.start_date}-${i}`}
                    className={`border-b border-white/8 text-white/80 ${row.is_current ? "bg-white/[0.03]" : ""}`}
                  >
                    <td className="px-3 py-3">{row.from_level}</td>
                    <td className="px-3 py-3">{row.start_date}</td>
                    <td className="px-3 py-3">{row.monthly_review}</td>
                    <td className="px-3 py-3">{row.last_upgrade}</td>
                    <td className="px-3 py-3">{row.to_level}</td>
                    <td className="px-3 py-3 font-semibold text-theme-green-action">{row.progress}</td>
                    <td className="px-3 py-3">{row.evaluation_period}</td>
                  </tr>
                ))
              )}
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
              body: "Earn level points from approved deposits and referral earnings in the last 12 months.",
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
            Next target: {next.name} at {formatPoints(tierTarget)} level points ({next.pointsPerLot}{" "}
            points per lot).
          </p>
        ) : null}
      </section>
    </div>
  );
}
