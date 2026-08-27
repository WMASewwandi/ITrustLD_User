const TIERS_KEY = "itrustld_partner_tiers";
const TIERS_VERSION_KEY = "itrustld_partner_tiers_version";
const TIERS_VERSION = 3;

/** Partner level ladder — aligned with Laravel PointLevelCustomer thresholds */
export const DEFAULT_PARTNER_TIERS = [
  { id: "normal", name: "Normal", levelPoints: 0, pointsPerLot: 20 },
  { id: "silver", name: "Silver", levelPoints: 10000, pointsPerLot: 40 },
  { id: "gold", name: "Gold", levelPoints: 50000, pointsPerLot: 60 },
  { id: "diamond", name: "Diamond", levelPoints: 100000, pointsPerLot: 70 },
  { id: "vip", name: "VIP", levelPoints: 500000, pointsPerLot: 80 },
  { id: "vvip", name: "VVIP", levelPoints: 1000000, pointsPerLot: 90 },
];

export const TIER_PROGRESS_REWARDS = {
  normal: ["10000 POINTS", "GET USD 35"],
  silver: ["GET WELCOME BONUS", "USD 15"],
  gold: ["USD 0 VOUCHERS", "EVERY MONTH"],
  diamond: ["USD 0 VOUCHERS", "EVERY MONTH"],
  vip: ["USD 0 VOUCHERS", "EVERY MONTH"],
  vvip: ["USD 0 VOUCHERS", "EVERY MONTH"],
};

const VOUCHER_REWARD_TIERS = new Set(["gold", "diamond", "vip", "vvip"]);

function formatVoucherUsd(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function getTierProgressReward(tier) {
  const key = String(tier?.id || tier?.name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  const mapped = key === "bronze" ? "normal" : key === "platinum" ? "diamond" : key;
  const liveAmount = Number(tier?.voucherAmount ?? tier?.voucher_amount);
  if (VOUCHER_REWARD_TIERS.has(mapped) && Number.isFinite(liveAmount)) {
    return [`USD ${formatVoucherUsd(liveAmount)} VOUCHERS`, "EVERY MONTH"];
  }
  return TIER_PROGRESS_REWARDS[mapped] || TIER_PROGRESS_REWARDS.normal;
}

export function formatTierProgressReward(tier) {
  return getTierProgressReward(tier).join(" ");
}

/** Metallic / brand colors keyed by lowercase tier name / id */
export const TIER_COLORS = {
  normal: { border: "#64969A", bg: "rgba(100, 150, 154, 0.22)", text: "#A8D0D3", dot: "#64969A" },
  bronze: { border: "#CD7F32", bg: "rgba(205, 127, 50, 0.22)", text: "#E8A85C", dot: "#CD7F32" },
  silver: { border: "#C0C0C0", bg: "rgba(192, 192, 192, 0.22)", text: "#E8E8E8", dot: "#C0C0C0" },
  gold: { border: "#D4AF37", bg: "rgba(212, 175, 55, 0.22)", text: "#F0D78C", dot: "#D4AF37" },
  diamond: { border: "#7EC8E3", bg: "rgba(126, 200, 227, 0.22)", text: "#B8E0F0", dot: "#7EC8E3" },
  platinum: { border: "#A8B8C8", bg: "rgba(168, 184, 200, 0.22)", text: "#D0DCE8", dot: "#A8B8C8" },
  vip: { border: "#F4B42E", bg: "rgba(244, 180, 46, 0.22)", text: "#F4B42E", dot: "#F4B42E" },
  vvip: { border: "#0D9F1B", bg: "rgba(13, 159, 27, 0.22)", text: "#5DDB6A", dot: "#0D9F1B" },
};

export function getTierColor(nameOrId) {
  const key = String(nameOrId || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  return (
    TIER_COLORS[key] || {
      border: "rgba(255,255,255,0.35)",
      bg: "rgba(255,255,255,0.08)",
      text: "#ffffff",
      dot: "rgba(255,255,255,0.45)",
    }
  );
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isLegacyTierLadder(tiers) {
  if (!Array.isArray(tiers) || tiers.length === 0) return true;
  const silver = tiers.find((t) => String(t.name).toLowerCase() === "silver");
  return !silver || Number(silver.levelPoints) < 1000;
}

function seedDefaultTiers() {
  return DEFAULT_PARTNER_TIERS.map((t) => ({ ...t }));
}

export function getPartnerTiers() {
  if (!canUseStorage()) return seedDefaultTiers();
  try {
    const version = Number(localStorage.getItem(TIERS_VERSION_KEY) || 0);
    const raw = localStorage.getItem(TIERS_KEY);
    if (!raw || version < TIERS_VERSION) {
      const seeded = seedDefaultTiers();
      localStorage.setItem(TIERS_KEY, JSON.stringify(seeded));
      localStorage.setItem(TIERS_VERSION_KEY, String(TIERS_VERSION));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (isLegacyTierLadder(parsed)) {
      const seeded = seedDefaultTiers();
      localStorage.setItem(TIERS_KEY, JSON.stringify(seeded));
      localStorage.setItem(TIERS_VERSION_KEY, String(TIERS_VERSION));
      return seeded;
    }
    return parsed;
  } catch {
    return seedDefaultTiers();
  }
}

export function savePartnerTiers(tiers) {
  if (!canUseStorage()) return;
  localStorage.setItem(TIERS_KEY, JSON.stringify(tiers));
  localStorage.setItem(TIERS_VERSION_KEY, String(TIERS_VERSION));
}

export function getTierByName(name, tiers = getPartnerTiers()) {
  const key = String(name || "").toLowerCase();
  // Map legacy Bronze → Normal
  const normalized = key === "bronze" ? "normal" : key === "platinum" ? "diamond" : key;
  return tiers.find((t) => t.name.toLowerCase() === normalized) || tiers[0];
}

export function getNextTier(currentName, tiers = getPartnerTiers()) {
  const current = getTierByName(currentName, tiers);
  const idx = tiers.findIndex((t) => t.name.toLowerCase() === current.name.toLowerCase());
  if (idx < 0) return tiers[1] || null;
  return tiers[idx + 1] || null;
}

export function getPartnerProgress(partnerPoints, partnerTier, tiers = getPartnerTiers()) {
  const current = getTierByName(partnerTier, tiers);
  const next = getNextTier(partnerTier, tiers);
  const currentPts = Number(partnerPoints) || 0;
  const tierStart = Number(current?.levelPoints) || 0;
  const tierEnd = next ? Number(next.levelPoints) : tierStart;
  const remaining = next ? Math.max(0, tierEnd - currentPts) : 0;
  const span = tierEnd - tierStart;
  const progressPct = next
    ? Math.min(100, Math.max(0, span > 0 ? ((currentPts - tierStart) / span) * 100 : 100))
    : 100;

  return {
    current,
    next,
    currentPts,
    required: tierEnd,
    tierStart,
    remaining,
    progressPct: Math.round(progressPct),
  };
}

export function formatPartnerPoints(value) {
  const n = Number(value) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  return n.toLocaleString();
}
