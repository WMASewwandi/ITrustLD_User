const PRINT_CACHE_KEY = "itrustld_transaction_print";

export function stashTransactionPrintPayload(payload) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PRINT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private-mode failures; print page will fetch.
  }
}

export function readTransactionPrintPayload() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PRINT_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearTransactionPrintPayload() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PRINT_CACHE_KEY);
  } catch {
    // ignore
  }
}
