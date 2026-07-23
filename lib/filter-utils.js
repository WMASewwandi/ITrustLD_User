/** Shared list filtering helpers for dashboard tables */

export function normalizeQuery(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function rowMatchesSearch(row, query, fields = []) {
  const q = normalizeQuery(query);
  if (!q) return true;
  return fields.some((field) => {
    const raw = row[field];
    if (raw == null) return false;
    return String(raw).toLowerCase().includes(q);
  });
}

/** Inclusive date compare for YYYY-MM-DD (and datetime prefixes). */
export function inDateRange(dateValue, from, to) {
  if (!dateValue) return !from && !to;
  const day = String(dateValue).slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

function toLocalYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function matchesPeriod(dateValue, period, today = new Date()) {
  if (!period || period === "All" || period === "Custom") return true;
  if (!dateValue) return false;

  const day = String(dateValue).slice(0, 10);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);

  if (period === "Daily") {
    // today only
  } else if (period === "Weekly") {
    start.setDate(start.getDate() - 6);
  } else if (period === "Monthly") {
    start.setDate(start.getDate() - 29);
  } else {
    return true;
  }

  return inDateRange(day, toLocalYmd(start), toLocalYmd(end));
}
