import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

let displayNames;
try {
  displayNames = new Intl.DisplayNames(["en"], { type: "region" });
} catch {
  displayNames = null;
}

function countryName(iso) {
  if (displayNames) {
    return displayNames.of(iso) || iso;
  }
  return iso;
}

export const ALL_COUNTRIES = getCountries()
  .map((iso) => {
    let code;
    try {
      code = `+${getCountryCallingCode(iso)}`;
    } catch {
      return null;
    }
    return {
      iso,
      name: countryName(iso),
      code,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountryByIso(countries, iso) {
  const target = String(iso || "").trim().toUpperCase();
  return countries.find((country) => country.iso === target) ?? countries[0] ?? null;
}

export function findCountryByName(countries, name) {
  const target = String(name || "").trim().toLowerCase();
  return (
    countries.find((country) => country.name.toLowerCase() === target) ??
    countries.find((country) => country.iso.toLowerCase() === target) ??
    countries[0] ??
    null
  );
}

export function parseStoredMobileNumber(mobile, countries = ALL_COUNTRIES) {
  const value = String(mobile || "").trim();
  if (!value) {
    return { country: countries[0] ?? null, phone: "" };
  }

  try {
    const parsed = parsePhoneNumberFromString(value);
    if (parsed) {
      const iso = parsed.country;
      const country = iso ? findCountryByIso(countries, iso) : countries[0];
      return {
        country: country ?? countries[0] ?? null,
        phone: parsed.nationalNumber || "",
      };
    }
  } catch {
    // fall through to prefix matching
  }

  const sorted = [...countries].sort((a, b) => b.code.length - a.code.length);
  for (const country of sorted) {
    if (value.startsWith(country.code)) {
      return {
        country,
        phone: value.slice(country.code.length).replace(/\D/g, ""),
      };
    }
  }

  return { country: countries[0] ?? null, phone: value.replace(/\D/g, "") };
}

export function buildInternationalNumber(country, nationalDigits) {
  const digits = String(nationalDigits || "").replace(/\D/g, "");
  if (!country?.iso || !digits) return "";

  try {
    const parsed = parsePhoneNumberFromString(digits, country.iso);
    if (parsed?.isValid()) {
      return parsed.number;
    }
  } catch {
    // fall through
  }

  return `${country.code}${digits}`;
}

export function isValidInternationalPhone(country, nationalDigits) {
  const digits = String(nationalDigits || "").replace(/\D/g, "");
  if (!country?.iso || !digits) return false;

  try {
    const parsed = parsePhoneNumberFromString(digits, country.iso);
    return Boolean(parsed?.isValid());
  } catch {
    return false;
  }
}

export function isValidEmail(value) {
  const email = String(value || "").trim();
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && !/\s/.test(email);
}
