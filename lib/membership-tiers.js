/** Trust Points membership ladder (Normal → VVIP) — shared across loyalty UI */

export const DEMO_TRUST_POINTS = 128450;

/** Structural ladder only. Benefits come from the API/DB — keep these empty. */
export const MEMBERSHIP_TIER_LADDER = [
  {
    name: "Normal",
    points: 0,
    icon: "star",
    color: "#64969A",
    ring: "#64969A",
    benefits: [],
  },
  {
    name: "Silver",
    points: 10000,
    icon: "star",
    color: "#8A9399",
    ring: "#C0C0C0",
    benefits: [],
  },
  {
    name: "Gold",
    points: 50000,
    icon: "star",
    color: "#B8860B",
    ring: "#D4AF37",
    benefits: [],
  },
  {
    name: "Diamond",
    points: 100000,
    icon: "gem",
    color: "#3D8FA8",
    ring: "#7EC8E3",
    benefits: [],
  },
  {
    name: "VIP",
    points: 500000,
    icon: "badge",
    color: "#C48A12",
    ring: "#F4B42E",
    benefits: [],
  },
  {
    name: "VVIP",
    points: 1000000,
    icon: "badge",
    color: "#0D9F1B",
    ring: "#0D9F1B",
    filled: true,
    benefits: [],
  },
];

/** @deprecated Use MEMBERSHIP_TIER_LADDER; benefits are loaded from the database. */
export const MEMBERSHIP_TIERS = MEMBERSHIP_TIER_LADDER;

export const MEMBERSHIP_TIER_NAMES = MEMBERSHIP_TIER_LADDER.map((t) => t.name);

/** Rolling 12-month Trust Points used for tier display. Never use lifetime `trust_points`. */
export function getYearlyTrustPoints(source) {
  if (!source || typeof source !== "object") return 0;
  const raw =
    source.earned_for_year ??
    source.point_summary?.earned_for_year ??
    source.partner_progress?.period_points;
  if (raw == null || raw === "") return 0;
  const points = Number(raw);
  return Number.isFinite(points) ? points : 0;
}

/** Official recorded tier from point_level_customers / loyalty summary. */
export function resolveCurrentLoyaltyTier(source, fallbackPoints = null, tiers = MEMBERSHIP_TIERS) {
  const named =
    source?.current_tier ||
    source?.partner_tier ||
    source?.loyalty_tier ||
    source?.level_label ||
    source?.point_summary?.level_label ||
    source?.partner_progress?.current_tier;
  if (named) return String(named);
  if (fallbackPoints != null) return getMembershipTierByPoints(fallbackPoints, tiers).name;
  return "Normal";
}

export function getMembershipTierByPoints(points, tiers = MEMBERSHIP_TIERS) {
  const pts = Number(points) || 0;
  let current = tiers[0];
  if (!current) return MEMBERSHIP_TIERS[0];
  for (const tier of tiers) {
    if (pts >= tier.points) current = tier;
  }
  return current;
}

export function getNextMembershipTier(pointsOrName, tiers = MEMBERSHIP_TIERS) {
  const current =
    typeof pointsOrName === "number" || /^\d+$/.test(String(pointsOrName))
      ? getMembershipTierByPoints(pointsOrName, tiers)
      : tiers.find((t) => t.name.toLowerCase() === String(pointsOrName || "").toLowerCase()) ||
        tiers[0] ||
        MEMBERSHIP_TIERS[0];
  const idx = tiers.findIndex((t) => t.name === current.name);
  return tiers[idx + 1] || null;
}

/** Affiliate links are for partners and Silver+ members — not Normal-tier users. */
export function canShowAffiliateLink(isPartner, tierName, tiers = MEMBERSHIP_TIER_LADDER) {
  if (isPartner) return true;
  const name = String(tierName || "").trim().toLowerCase();
  if (!name || name === "normal") return false;
  const ladder = Array.isArray(tiers) && tiers.length ? tiers : MEMBERSHIP_TIER_LADDER;
  const silverIndex = ladder.findIndex((tier) => String(tier.name).toLowerCase() === "silver");
  const currentIndex = ladder.findIndex((tier) => String(tier.name).toLowerCase() === name);
  if (currentIndex < 0) return false;
  return silverIndex < 0 ? currentIndex > 0 : currentIndex >= silverIndex;
}

export function getMembershipProgress(points, tierName = null, tiers = MEMBERSHIP_TIERS) {
  const pts = Number(points) || 0;
  const current = tierName
    ? tiers.find((t) => t.name.toLowerCase() === String(tierName).toLowerCase()) ||
      getMembershipTierByPoints(pts, tiers)
    : getMembershipTierByPoints(pts, tiers);
  const currentIndex = tiers.findIndex((t) => t.name === current.name);
  const next = tiers[currentIndex + 1] || null;
  const tierStart = current.points;
  const tierEnd = next ? next.points : current.points;
  const remaining = next ? Math.max(0, tierEnd - pts) : 0;
  const span = tierEnd - tierStart;
  const progressPct = next
    ? Math.min(100, Math.max(0, span > 0 ? ((pts - tierStart) / span) * 100 : 100))
    : 100;

  return {
    current,
    next,
    currentPts: pts,
    required: tierEnd,
    remaining,
    progressPct: Math.round(progressPct),
  };
}
