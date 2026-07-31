const VERIFICATION_KEY = "itrustld_verification";

export const IDENTITY_DOC_TYPES = [
  "National Identity Card (Both sides)",
  "Driver's License",
  "Passport",
];

export const ADDRESS_DOC_TYPES = [
  "Electricity Bill",
  "Water Bill",
  "Telephone Bill",
  "Utility Bill",
  "Other",
];

export const IDENTITY_TYPE_TO_API = {
  "National Identity Card (Both sides)": "NIC",
  "Driver's License": "DL",
  Passport: "PASSPORT",
};

export const ADDRESS_TYPE_TO_API = {
  "Electricity Bill": "ELECTRICITY_BILL",
  "Water Bill": "WATER_BILL",
  "Telephone Bill": "TELEPHONE_BILL",
  "Utility Bill": "UTILITY_BILL",
  Other: "OTHER",
};

export const IDENTITY_TYPE_FROM_API = Object.fromEntries(
  Object.entries(IDENTITY_TYPE_TO_API).map(([label, value]) => [value, label])
);

export const ADDRESS_TYPE_FROM_API = Object.fromEntries(
  Object.entries(ADDRESS_TYPE_TO_API).map(([label, value]) => [value, label])
);

export function formatVerificationEnum(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function needsIdentityDocumentUpload(accountHolder) {
  if (!accountHolder) return true;
  return (
    accountHolder.identity_document_status !== "RECEIVED" ||
    accountHolder.identity_verification === "REJECTED"
  );
}

export function needsAddressDocumentUpload(accountHolder) {
  if (!accountHolder) return true;
  return (
    accountHolder.address_document_status !== "RECEIVED" ||
    accountHolder.address_verification === "REJECTED"
  );
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getDefaultVerification(user = {}) {
  return {
    email: user.email || "",
    phone: user.phone || "",
    emailVerified: false,
    phoneVerified: false,
    identityType: "",
    addressType: "",
    identityFront: null,
    identityBack: null,
    identityFile: null,
    addressFile: null,
    status: "unverified",
  };
}

export function loadVerification(user) {
  const fallback = getDefaultVerification(user);
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(VERIFICATION_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function saveVerification(state) {
  if (!canUseStorage()) return;
  const { identityFront, identityBack, identityFile, addressFile, ...rest } = state;
  localStorage.setItem(
    VERIFICATION_KEY,
    JSON.stringify({
      ...rest,
      identityFrontName: identityFront?.name || null,
      identityBackName: identityBack?.name || null,
      identityFileName: identityFile?.name || null,
      addressFileName: addressFile?.name || null,
    })
  );
}

export function isNationalId(type) {
  return String(type || "").toLowerCase().includes("national");
}
