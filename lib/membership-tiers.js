/** Trust Points membership ladder (Normal → VVIP) — shared across loyalty UI */

export const MEMBERSHIP_TIERS = [
  {
    name: "Normal",
    points: 0,
    icon: "star",
    color: "#F4B42E",
    ring: "#64969A",
    benefits: [
      "Access to Trust Points program",
      "Earn points from eligible top-ups and referrals",
    ],
  },
  {
    name: "Silver",
    points: 50000,
    icon: "star",
    color: "#F4B42E",
    ring: "#64969A",
    benefits: [
      "$20 Welcome Bonus",
      "Earn $50 cashback for every 10 clients referred",
    ],
  },
  {
    name: "Gold",
    points: 250000,
    icon: "star",
    color: "#F4B42E",
    ring: "#64969A",
    benefits: [
      "$50 Welcome Bonus",
      "Earn $150 cashback for every 10 clients referred, with each client receiving a $15 voucher for iTrustLD.",
    ],
  },
  {
    name: "Diamond",
    points: 400000,
    icon: "gem",
    color: "#64969A",
    ring: "#64969A",
    benefits: [
      "$100 Welcome Bonus",
      "Earn $250 cashback for every 10 clients referred, with each client receiving a $20 voucher for iTrustLD.",
    ],
  },
  {
    name: "VIP",
    points: 500000,
    icon: "badge",
    color: "#F4B42E",
    ring: "#64969A",
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
    color: "#FFFFFF",
    ring: "#64969A",
    filled: true,
    benefits: [
      "$500 Welcome Bonus",
      "Earn $600 cashback for every 10 clients referred, with each client receiving a $35 voucher for iTrustLD.",
      "Dedicated account manager and VIP event invites",
    ],
  },
];

export const MEMBERSHIP_TIER_NAMES = MEMBERSHIP_TIERS.map((t) => t.name);

export function getMembershipTierByPoints(points) {
  const pts = Number(points) || 0;
  let current = MEMBERSHIP_TIERS[0];
  for (const tier of MEMBERSHIP_TIERS) {
    if (pts >= tier.points) current = tier;
  }
  return current;
}

export function getNextMembershipTier(pointsOrName) {
  const current =
    typeof pointsOrName === "number" || /^\d+$/.test(String(pointsOrName))
      ? getMembershipTierByPoints(pointsOrName)
      : MEMBERSHIP_TIERS.find((t) => t.name.toLowerCase() === String(pointsOrName || "").toLowerCase()) ||
        MEMBERSHIP_TIERS[0];
  const idx = MEMBERSHIP_TIERS.findIndex((t) => t.name === current.name);
  return MEMBERSHIP_TIERS[idx + 1] || null;
}

export function getMembershipProgress(points) {
  const pts = Number(points) || 0;
  const current = getMembershipTierByPoints(pts);
  const next = getNextMembershipTier(pts);
  const required = next ? next.points : current.points;
  const remaining = next ? Math.max(0, required - pts) : 0;
  const progressPct = next
    ? Math.min(100, Math.round((pts / Math.max(required, 1)) * 100))
    : 100;
  return { current, next, currentPts: pts, required, remaining, progressPct };
}
