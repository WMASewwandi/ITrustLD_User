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

export const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export function isStrongPassword(value) {
  return STRONG_PASSWORD_PATTERN.test(String(value || ""));
}

const NATIONAL_PHONE_RULES = {
  LK: {
    min: 9,
    max: 9,
    example: "71 234 5678",
    format(digits) {
      const x = digits.slice(0, 9);
      if (x.length <= 2) return x;
      if (x.length <= 5) return `${x.slice(0, 2)} ${x.slice(2)}`;
      return `${x.slice(0, 2)} ${x.slice(2, 5)} ${x.slice(5)}`;
    },
  },
  IN: {
    min: 10,
    max: 10,
    example: "98765 43210",
    format(digits) {
      const x = digits.slice(0, 10);
      if (x.length <= 5) return x;
      return `${x.slice(0, 5)} ${x.slice(5)}`;
    },
  },
  SG: {
    min: 8,
    max: 8,
    example: "9123 4567",
    format(digits) {
      const x = digits.slice(0, 8);
      if (x.length <= 4) return x;
      return `${x.slice(0, 4)} ${x.slice(4)}`;
    },
  },
  AE: {
    min: 9,
    max: 9,
    example: "50 123 4567",
    format(digits) {
      const x = digits.slice(0, 9);
      if (x.length <= 2) return x;
      if (x.length <= 5) return `${x.slice(0, 2)} ${x.slice(2)}`;
      return `${x.slice(0, 2)} ${x.slice(2, 5)} ${x.slice(5)}`;
    },
  },
  GB: {
    min: 10,
    max: 10,
    example: "7123 456 789",
    format(digits) {
      const x = digits.slice(0, 10);
      if (x.length <= 4) return x;
      if (x.length <= 7) return `${x.slice(0, 4)} ${x.slice(4)}`;
      return `${x.slice(0, 4)} ${x.slice(4, 7)} ${x.slice(7)}`;
    },
  },
  US: {
    min: 10,
    max: 10,
    example: "(712) 345-6789",
    format(digits) {
      const x = digits.slice(0, 10);
      if (x.length <= 3) return x;
      if (x.length <= 6) return `(${x.slice(0, 3)}) ${x.slice(3)}`;
      return `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
    },
  },
  AU: {
    min: 9,
    max: 9,
    example: "4123 456 78",
    format(digits) {
      const x = digits.slice(0, 9);
      if (x.length <= 4) return x;
      if (x.length <= 7) return `${x.slice(0, 4)} ${x.slice(4)}`;
      return `${x.slice(0, 4)} ${x.slice(4, 7)} ${x.slice(7)}`;
    },
  },
  MY: {
    min: 9,
    max: 10,
    example: "12 345 6789",
    format(digits) {
      const x = digits.slice(0, 10);
      if (x.length <= 2) return x;
      if (x.length <= 5) return `${x.slice(0, 2)} ${x.slice(2)}`;
      return `${x.slice(0, 2)} ${x.slice(2, 5)} ${x.slice(5)}`;
    },
  },
  CN: {
    min: 11,
    max: 11,
    example: "138 0013 8000",
    format(digits) {
      const x = digits.slice(0, 11);
      if (x.length <= 3) return x;
      if (x.length <= 7) return `${x.slice(0, 3)} ${x.slice(3)}`;
      return `${x.slice(0, 3)} ${x.slice(3, 7)} ${x.slice(7)}`;
    },
  },
  JP: {
    min: 10,
    max: 11,
    example: "90 1234 5678",
    format(digits) {
      const x = digits.slice(0, 11);
      if (x.length <= 2) return x;
      if (x.length <= 6) return `${x.slice(0, 2)} ${x.slice(2)}`;
      return `${x.slice(0, 2)} ${x.slice(2, 6)} ${x.slice(6)}`;
    },
  },
  DEFAULT: {
    min: 7,
    max: 12,
    example: "123 456 7890",
    format(digits) {
      const x = digits.slice(0, 12);
      const parts = [];
      for (let i = 0; i < x.length; i += 3) {
        parts.push(x.slice(i, i + 3));
      }
      return parts.join(" ");
    },
  },
};

const STRIP_LEADING_ZERO_ISOS = new Set(["LK", "GB", "IN", "MY", "AU", "JP"]);

export function getNationalPhoneRules(iso) {
  return NATIONAL_PHONE_RULES[iso] || NATIONAL_PHONE_RULES.DEFAULT;
}

export function getNationalPhoneExample(iso) {
  return getNationalPhoneRules(iso).example;
}

export function normalizeNationalPhoneDigits(digits, iso) {
  let d = String(digits || "").replace(/\D/g, "");
  if (STRIP_LEADING_ZERO_ISOS.has(iso) && d.startsWith("0")) {
    d = d.replace(/^0+/, "");
  }
  const { max } = getNationalPhoneRules(iso);
  return d.slice(0, max);
}

export function formatNationalPhone(digits, iso) {
  const normalized = normalizeNationalPhoneDigits(digits, iso);
  return getNationalPhoneRules(iso).format(normalized);
}

export function isValidPhone(value, min = 7, max = 12) {
  return /^\d+$/.test(value) && value.length >= min && value.length <= max;
}

export function isValidPhoneForCountry(digits, iso) {
  const normalized = normalizeNationalPhoneDigits(digits, iso);
  const { min, max } = getNationalPhoneRules(iso);
  return /^\d+$/.test(normalized) && normalized.length >= min && normalized.length <= max;
}

export function isValidCalendarDate(dob) {
  if (!dob || typeof dob !== "string") return false;
  const trimmed = dob.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isOldEnough(dob, minAge = 10) {
  if (!isValidCalendarDate(dob)) return false;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= minAge;
}
