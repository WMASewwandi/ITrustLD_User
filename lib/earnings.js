const CLAIMS_KEY = "itrustld_user_claims";

export const MY_CLIENTS = [
  {
    accountId: "88210451",
    firstTransaction: "2026-03-12",
    lastTransaction: "2026-07-18",
    points: 420,
  },
  {
    accountId: "88210988",
    firstTransaction: "2026-04-02",
    lastTransaction: "2026-07-10",
    points: 185,
  },
  {
    accountId: "88211320",
    firstTransaction: "2026-05-21",
    lastTransaction: "2026-06-30",
    points: 96,
  },
  {
    accountId: "88212077",
    firstTransaction: "2026-01-15",
    lastTransaction: "2026-07-20",
    points: 640,
  },
  {
    accountId: "88212501",
    firstTransaction: "2026-07-01",
    lastTransaction: "2026-07-19",
    points: 32,
  },
];

export const SUB_CLIENTS = [
  {
    accountId: "99120011",
    firstTransaction: "2026-02-08",
    lastTransaction: "2026-07-15",
    points: 310,
  },
  {
    accountId: "99120444",
    firstTransaction: "2026-06-01",
    lastTransaction: "2026-07-02",
    points: 54,
  },
  {
    accountId: "99120890",
    firstTransaction: "2026-03-20",
    lastTransaction: "2026-07-12",
    points: 210,
  },
  {
    accountId: "99121102",
    firstTransaction: "2026-07-05",
    lastTransaction: "2026-07-18",
    points: 18,
  },
];

/** Admin-approved voucher claims ready for the user (demo seed). */
export const SEED_VOUCHER_CLAIMS = [
  {
    id: "vc-1001",
    token: "VCH-3M7Q-B20L",
    topupMethod: "Crypto",
    platform: "iTrustLD",
    amount: "USD 25.00",
    approvedAt: "2026-07-01 09:05",
    adminStatus: "Approved",
    userStatus: "Ready",
  },
  {
    id: "vc-1002",
    token: "VCH-9Z1R-C55N",
    topupMethod: "Skrill",
    platform: "XM",
    amount: "USD 100.00",
    approvedAt: "2026-07-18 18:40",
    adminStatus: "Approved",
    userStatus: "Ready",
  },
  {
    id: "vc-1003",
    token: "VCH-1P0L-E33K",
    topupMethod: "Crypto",
    platform: "XM",
    amount: "USD 40.00",
    approvedAt: "2026-07-20 08:15",
    adminStatus: "Approved",
    userStatus: "Ready",
  },
];

/** Admin-approved bonus claims ready for the user (demo seed). */
export const SEED_BONUS_CLAIMS = [
  {
    id: "bc-2001",
    title: "Referral cashback bonus",
    description: "Cashback for 10 referred clients this period.",
    amount: "USD 50.00",
    approvedAt: "2026-07-15 11:20",
    adminStatus: "Approved",
    userStatus: "Ready",
  },
  {
    id: "bc-2002",
    title: "Silver tier welcome bonus",
    description: "Welcome bonus unlocked at Silver membership.",
    amount: "USD 20.00",
    approvedAt: "2026-07-10 14:05",
    adminStatus: "Approved",
    userStatus: "Ready",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function seedClaimsState() {
  return {
    vouchers: SEED_VOUCHER_CLAIMS.map((v) => ({ ...v })),
    bonuses: SEED_BONUS_CLAIMS.map((b) => ({ ...b })),
    history: [],
  };
}

export function loadClaimsState() {
  if (!canUseStorage()) return seedClaimsState();
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    if (!raw) {
      const seeded = seedClaimsState();
      localStorage.setItem(CLAIMS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return {
      vouchers: Array.isArray(parsed.vouchers) ? parsed.vouchers : seedClaimsState().vouchers,
      bonuses: Array.isArray(parsed.bonuses) ? parsed.bonuses : seedClaimsState().bonuses,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return seedClaimsState();
  }
}

export function saveClaimsState(state) {
  if (!canUseStorage()) return;
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(state));
  notifyClaimsUpdated();
}

export function getReadyVoucherClaims(state) {
  return (state?.vouchers || []).filter((v) => v.userStatus === "Ready" && v.adminStatus === "Approved");
}

export function getReadyBonusClaims(state) {
  return (state?.bonuses || []).filter((b) => b.userStatus === "Ready" && b.adminStatus === "Approved");
}

/** Total admin-approved claims waiting for the user (vouchers + bonuses). */
export function getReadyClaimsCount(state = loadClaimsState()) {
  return getReadyVoucherClaims(state).length + getReadyBonusClaims(state).length;
}

export const CLAIMS_UPDATED_EVENT = "itrustld-claims-updated";

export function notifyClaimsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLAIMS_UPDATED_EVENT));
}

export function claimVoucherById(state, id, platformId = "") {
  const now = new Date();
  const stamped = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
  const item = state.vouchers.find((v) => v.id === id);
  if (!item || item.userStatus !== "Ready") return state;

  const vouchers = state.vouchers.map((v) =>
    v.id === id ? { ...v, userStatus: "Claimed", claimedAt: stamped, platformId } : v
  );
  const history = [
    {
      id: `h-${id}-${Date.now()}`,
      type: "Voucher",
      ref: item.token,
      amount: item.amount,
      platformId,
      claimedAt: stamped,
      status: "Completed",
    },
    ...(state.history || []),
  ];
  const next = { ...state, vouchers, history };
  saveClaimsState(next);
  return next;
}

export function claimBonusById(state, id, platformId = "") {
  const now = new Date();
  const stamped = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
  const item = state.bonuses.find((b) => b.id === id);
  if (!item || item.userStatus !== "Ready") return state;

  const bonuses = state.bonuses.map((b) =>
    b.id === id ? { ...b, userStatus: "Claimed", claimedAt: stamped, platformId } : b
  );
  const history = [
    {
      id: `h-${id}-${Date.now()}`,
      type: "Bonus",
      ref: item.title,
      amount: item.amount,
      platformId,
      claimedAt: stamped,
      status: "Completed",
    },
    ...(state.history || []),
  ];
  const next = { ...state, bonuses, history };
  saveClaimsState(next);
  return next;
}
