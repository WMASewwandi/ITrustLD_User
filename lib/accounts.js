const ACCOUNTS_KEY = "itrustld_accounts";

export const DEFAULT_ACCOUNTS = [
  {
    id: "acc-partner-1",
    email: "partner@itrustld.com",
    name: "Partner Demo",
    userType: "partner",
    partnerTier: "Normal",
    partnerPoints: 45,
    accountId: "88001001",
    phone: "+94 77 000 1001",
  },
  {
    id: "acc-normal-1",
    email: "john12@gmail.com",
    name: "John",
    userType: "normal",
    partnerTier: null,
    partnerPoints: 0,
    accountId: "67104269",
    phone: "+94 77 123 4567",
  },
  {
    id: "acc-normal-2",
    email: "avishka@email.com",
    name: "Avishka",
    userType: "normal",
    partnerTier: null,
    partnerPoints: 0,
    accountId: "67104270",
    phone: "+94 77 555 1212",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function ensureAccountsSeeded() {
  if (!canUseStorage()) return DEFAULT_ACCOUNTS.map((a) => ({ ...a }));
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      const seeded = DEFAULT_ACCOUNTS.map((a) => ({ ...a }));
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      parsed = DEFAULT_ACCOUNTS.map((a) => ({ ...a }));
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));
      return parsed;
    }

    // Always ensure default partner exists
    const partnerEmail = "partner@itrustld.com";
    if (!parsed.some((a) => normalizeEmail(a.email) === partnerEmail)) {
      parsed = [{ ...DEFAULT_ACCOUNTS[0] }, ...parsed];
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));
    }

    // Migrate legacy partner tier names → Normal / Diamond / VVIP ladder
    let changed = false;
    parsed = parsed.map((a) => {
      if (a.partnerTier === "Bronze") {
        changed = true;
        return { ...a, partnerTier: "Normal" };
      }
      if (a.partnerTier === "Platinum") {
        changed = true;
        return { ...a, partnerTier: "Diamond" };
      }
      return a;
    });
    if (changed) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));

    return parsed;
  } catch {
    return DEFAULT_ACCOUNTS.map((a) => ({ ...a }));
  }
}

export function getAccounts() {
  return ensureAccountsSeeded();
}

export function saveAccounts(accounts) {
  if (!canUseStorage()) return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function findAccountByEmail(email) {
  const accounts = getAccounts();
  return accounts.find((a) => normalizeEmail(a.email) === normalizeEmail(email)) || null;
}

export function upsertAccount(partial) {
  const accounts = getAccounts();
  const email = normalizeEmail(partial.email);
  const idx = accounts.findIndex((a) => normalizeEmail(a.email) === email);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], ...partial, email: accounts[idx].email };
  } else {
    accounts.push({
      id: `acc-${Date.now()}`,
      email: partial.email,
      name: partial.name || partial.email?.split("@")[0] || "User",
      userType: partial.userType || "normal",
      partnerTier: partial.partnerTier || null,
      partnerPoints: partial.partnerPoints || 0,
      accountId: partial.accountId || String(Math.floor(10000000 + Math.random() * 89999999)),
      phone: partial.phone || "",
    });
  }
  saveAccounts(accounts);
  return findAccountByEmail(email);
}

export function setAccountPartnerEnabled(email, enabled, partnerTier = "Normal") {
  const account = findAccountByEmail(email);
  if (!account) return null;
  return upsertAccount({
    ...account,
    userType: enabled ? "partner" : "normal",
    partnerTier: enabled ? partnerTier || account.partnerTier || "Normal" : null,
    partnerPoints: enabled ? account.partnerPoints || 0 : 0,
  });
}

export function resolveSessionUser({ email, name }) {
  ensureAccountsSeeded();
  const normalized = normalizeEmail(email);
  let account = findAccountByEmail(normalized);

  if (!account && normalized === "partner@itrustld.com") {
    account = upsertAccount({ ...DEFAULT_ACCOUNTS[0] });
  }

  if (!account) {
    account = upsertAccount({
      email,
      name: name || email.split("@")[0] || "User",
      userType: "normal",
    });
  }

  const displayName =
    account.name ||
    name ||
    email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);

  return {
    name: displayName,
    email: account.email,
    accountId: account.accountId,
    phone: account.phone || "",
    userType: account.userType || "normal",
    partnerTier: account.partnerTier || null,
    partnerPoints: Number(account.partnerPoints) || 0,
  };
}
