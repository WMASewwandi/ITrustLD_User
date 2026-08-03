const CODE_KEY = "itrustld_affiliate_code";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Build a short uppercase code from account id / email seed */
export function buildAffiliateCode(seed) {
  const raw = String(seed || "itrustld")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  if (raw.length >= 8) return raw.slice(0, 8);
  const pad = "Q8ZYIOPB";
  return (raw + pad).slice(0, 8);
}

export function getOrCreateAffiliateCode(seed) {
  if (!canUseStorage()) return buildAffiliateCode(seed);
  try {
    const existing = localStorage.getItem(CODE_KEY);
    if (existing && /^[A-Z0-9]{6,12}$/.test(existing)) return existing;
    const code = buildAffiliateCode(seed);
    localStorage.setItem(CODE_KEY, code);
    return code;
  } catch {
    return buildAffiliateCode(seed);
  }
}

export function getAffiliateLink(code) {
  const safe = String(code || "").toUpperCase();
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_USER_APP_URL || "https://www.itrustld.com";
  return `${origin.replace(/\/$/, "")}/join/${safe}`;
}
