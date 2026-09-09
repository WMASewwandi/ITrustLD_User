export const KYC_COOKIE = "itrustld_kyc";

export const UNVERIFIED_ALLOWED_PREFIXES = [
  "/verify",
  "/banned",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/support",
  "/help",
];

function isUnverifiedDashboardAllowed(path) {
  if (path === "/dashboard") return true;
  if (path === "/dashboard/help" || path.startsWith("/dashboard/help/")) return true;
  if (path === "/dashboard/documents" || path.startsWith("/dashboard/documents/")) return true;
  if (path === "/dashboard/profile" || path.startsWith("/dashboard/profile/")) {
    return path !== "/dashboard/profile/accounts" && !path.startsWith("/dashboard/profile/accounts/");
  }
  return false;
}

export function isUnverifiedAllowedPath(pathname = "") {
  const path = String(pathname || "").split("?")[0];
  if (
    UNVERIFIED_ALLOWED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }
  return isUnverifiedDashboardAllowed(path);
}

export function resolveKycStatus(user) {
  if (!user) return null;
  const ah = user.account_holder;
  if (ah?.account_status === "BANNED") return "banned";
  if (!ah) return "pending";
  if (
    ah.email_verification !== "VERIFIED" ||
    ah.mobile_number_verification !== "VERIFIED" ||
    ah.identity_verification !== "VERIFIED" ||
    ah.address_verification !== "VERIFIED"
  ) {
    return "pending";
  }
  return "ok";
}

export function syncKycCookie(user) {
  if (typeof document === "undefined") return;
  const status = resolveKycStatus(user);
  if (!status) {
    document.cookie = `${KYC_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${KYC_COOKIE}=${status}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function hardRedirect(path) {
  if (typeof window === "undefined") return;
  const next = String(path || "");
  if (!next || window.location.pathname === next.split("?")[0]) return;
  window.location.replace(next);
}
