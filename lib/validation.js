export const COUNTRIES = [
  { name: "Sri Lanka", code: "+94", iso: "LK" },
  { name: "India", code: "+91", iso: "IN" },
  { name: "Singapore", code: "+65", iso: "SG" },
  { name: "United Arab Emirates", code: "+971", iso: "AE" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "United States", code: "+1", iso: "US" },
  { name: "Australia", code: "+61", iso: "AU" },
  { name: "Malaysia", code: "+60", iso: "MY" },
  { name: "China", code: "+86", iso: "CN" },
  { name: "Japan", code: "+81", iso: "JP" },
];

export function lettersOnly(value) {
  return /^[A-Za-z\s'-]+$/.test(value.trim()) && value.trim().length > 0;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/\s/.test(value);
}

export function isValidPhone(value, min = 7, max = 12) {
  return /^\d+$/.test(value) && value.length >= min && value.length <= max;
}

export function isOldEnough(dob, minAge = 10) {
  if (!dob) return false;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= minAge;
}
