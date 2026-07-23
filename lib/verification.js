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

export const DEMO_CODE = "123456";

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
    documentsSubmitted: false,
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
  const {
    identityFront,
    identityBack,
    identityFile,
    addressFile,
    ...rest
  } = state;
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
