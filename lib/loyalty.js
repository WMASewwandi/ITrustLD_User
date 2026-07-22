const TIERS_KEY = "itrustld_partner_tiers";
const TIERS_VERSION_KEY = "itrustld_partner_tiers_version";
const TIERS_VERSION = 2;

/** Partner level ladder — aligned with Loyalty Levels (Normal → VVIP) */
export const DEFAULT_PARTNER_TIERS = [
  { id: "normal", name: "Normal", levelPoints: 0, pointsPerLot: 20 },
  { id: "silver", name: "Silver", levelPoints: 200, pointsPerLot: 40 },
  { id: "gold", name: "Gold", levelPoints: 300, pointsPerLot: 60 },
  { id: "diamond", name: "Diamond", levelPoints: 400, pointsPerLot: 70 },
  { id: "vip", name: "VIP", levelPoints: 500, pointsPerLot: 80 },
  { id: "vvip", name: "VVIP", levelPoints: 600, pointsPerLot: 90 },
];

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
  const names = tiers.map((t) => String(t.name || "").toLowerCase());
  return names.includes("bronze") || names.includes("platinum") || !names.includes("normal") || !names.includes("vvip");
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
  const required = next ? next.levelPoints : current.levelPoints;
  const remaining = next ? Math.max(0, required - currentPts) : 0;
  const progressPct = next
    ? Math.min(100, Math.round((currentPts / Math.max(required, 1)) * 100))
    : 100;
  return { current, next, currentPts, required, remaining, progressPct };
}
