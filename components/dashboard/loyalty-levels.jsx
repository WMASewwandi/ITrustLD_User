"use client";

import { useState } from "react";
import { Gem, Hexagon, Star } from "lucide-react";
import { MEMBERSHIP_TIERS } from "@/lib/membership-tiers";

function TierIcon({ tier, className = "h-6 w-6" }) {
  if (tier.icon === "gem") {
    return <Gem className={className} strokeWidth={2} />;
  }
  if (tier.icon === "badge") {
    return (
      <span className="relative inline-flex items-center justify-center">
        <Hexagon className="h-8 w-8" strokeWidth={1.75} />
        <Star className="absolute h-3.5 w-3.5 fill-current" />
      </span>
    );
  }
  return <Star className={`${className} fill-current`} strokeWidth={0} />;
}

/**
 * Circular loyalty levels (Normal → VVIP) with optional benefits reveal.
 * @param {"full" | "compact"} variant
 */
export default function LoyaltyLevels({
  title = "Loyalty Levels",
  initialTier = "Normal",
  currentTier = null,
  showBenefits = true,
  showPointsHint = true,
  variant = "full",
  className = "",
}) {
  const defaultName = currentTier || initialTier || MEMBERSHIP_TIERS[0].name;
  const [selectedTier, setSelectedTier] = useState(defaultName);
  const selected = MEMBERSHIP_TIERS.find((t) => t.name === selectedTier) || MEMBERSHIP_TIERS[0];
  const compact = variant === "compact";

  return (
    <div className={`min-w-0 ${className}`}>
      {title ? (
        <h2 className={`font-semibold text-white ${compact ? "mb-3 text-sm" : "mb-5 text-base"}`}>
          {title}
        </h2>
      ) : null}

      <div className="flex min-w-0 gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] sm:gap-2 sm:justify-between">
        {MEMBERSHIP_TIERS.map((tier) => {
          const active = selectedTier === tier.name;
          const isCurrent = currentTier === tier.name;
          return (
            <button
              key={tier.name}
              type="button"
              onClick={() => setSelectedTier(tier.name)}
              className={`flex shrink-0 flex-col items-center gap-1.5 text-center transition ${
                compact ? "w-12 sm:w-14" : "w-16 sm:w-auto sm:min-w-0 sm:flex-1"
              }`}
              aria-pressed={active}
            >
              <span
                className={`flex items-center justify-center rounded-full border-[3px] transition ${
                  compact ? "h-10 w-10 sm:h-12 sm:w-12" : "h-16 w-16"
                } ${active ? "scale-105 ring-2 ring-white/25" : "opacity-85 hover:opacity-100"}`}
                style={{
                  borderColor: tier.ring,
                  backgroundColor: tier.filled ? tier.ring : "#FFFFFF",
                  color: tier.filled ? "#FFFFFF" : tier.color,
                }}
              >
                <TierIcon
                  tier={tier}
                  className={compact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-6 w-6"}
                />
              </span>
              <span
                className={`font-semibold ${compact ? "text-[9px] sm:text-[10px]" : "text-xs"} ${
                  active || isCurrent ? "text-white" : "text-white/55"
                }`}
              >
                {tier.name}
              </span>
            </button>
          );
        })}
      </div>

      {showBenefits ? (
        <div key={selected.name} className="mt-5 min-w-0 rounded-2xl bg-white/[0.06] px-4 py-4 sm:px-5">
          <h3 className={`font-bold text-white ${compact ? "text-xs" : "text-sm sm:text-base"}`}>
            Benefits – {selected.name} Level
          </h3>
          <ul className="mt-3 space-y-2.5">
            {selected.benefits.map((item) => (
              <li
                key={item}
                className={`flex min-w-0 items-start gap-2.5 leading-relaxed text-white/70 ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#64969A]" />
                <span className="min-w-0 break-words">{item}</span>
              </li>
            ))}
          </ul>
          {showPointsHint && selected.points > 0 ? (
            <p className="mt-3 text-xs text-white/40">
              Unlock from {selected.points.toLocaleString()}+ Trust Points
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
