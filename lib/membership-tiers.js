/** Trust Points membership ladder (Normal → VVIP) — shared across loyalty UI */

export const DEMO_TRUST_POINTS = 128450;

export const MEMBERSHIP_TIERS = [
  {
    name: "Normal",
    points: 0,
    icon: "star",
    color: "#64969A",
    ring: "#64969A",
    benefits: [
      "Access to Trust Points program",
      "Earn points from eligible top-ups and referrals",
    ],
  },
  {
    name: "Silver",
    points: 10000,
    icon: "star",
    color: "#8A9399",
    ring: "#C0C0C0",
    benefits: [
      "$20 Welcome Bonus",
      "Earn $50 cashback for every 10 clients referred",
    ],
  },
  {
    name: "Gold",
    points: 50000,
    icon: "star",
    color: "#B8860B",
    ring: "#D4AF37",
    benefits: [
      "$50 Welcome Bonus",
      "Earn $150 cashback for every 10 clients referred, with each client receiving a $15 voucher for iTrustLD.",
    ],
  },
  {
    name: "Diamond",
    points: 100000,
    icon: "gem",
    color: "#3D8FA8",
    ring: "#7EC8E3",
    benefits: [
      "$100 Welcome Bonus",
      "Earn $250 cashback for every 10 clients referred, with each client receiving a $20 voucher for iTrustLD.",
    ],
  },
  {
    name: "VIP",
    points: 500000,
    icon: "badge",
    color: "#C48A12",
    ring: "#F4B42E",
    benefits: [
      "$200 Welcome Bonus",
      "Earn $400 cashback for every 10 clients referred, with each client receiving a $25 voucher for iTrustLD.",
      "Priority support and exclusive promotions",
    ],
  },
  {
    name: "VVIP",
    points: 1000000,
    icon: "badge",
    color: "#0D9F1B",
    ring: "#0D9F1B",
    filled: true,
    benefits: [
      "$500 Welcome Bonus",
      "Earn $600 cashback for every 10 clients referred, with each client receiving a $35 voucher for iTrustLD.",
      "Dedicated account manager and VIP event invites",
    ],
  },
];

export const MEMBERSHIP_TIER_NAMES = MEMBERSHIP_TIERS.map((t) => t.name);

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
