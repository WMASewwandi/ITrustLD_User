"use client";

import { Search, X } from "lucide-react";

const fieldClass =
  "w-full min-w-0 rounded-lg border border-white/12 bg-[#0B1020]/70 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium text-white/55";

/**
 * Live search + filter bar (updates as the user types / changes selects).
 * Responsive grid prevents overflow on tablet widths.
 */
export default function ListFilters({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  values = {},
  onFilterChange,
  from = "",
  to = "",
  onFromChange,
  onToChange,
  showDates = false,
  onReset,
  resultCount,
}) {
  return (
    <div className="mb-5 min-w-0 rounded-2xl border border-white/12 bg-[#0B1020]/85 p-4 sm:p-5">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <div className="min-w-0 sm:col-span-2 md:col-span-1">
          <label className={labelClass}>Search</label>
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className={`${fieldClass} pl-9`}
            />
          </div>
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="min-w-0">
            <label className={labelClass}>{filter.label}</label>
            <select
              value={values[filter.key] ?? filter.options[0]}
              onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
              className={fieldClass}
            >
              {filter.options.map((opt) => (
                <option key={opt} value={opt} className="bg-[#141A2E]">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {showDates ? (
          <>
            <div className="min-w-0">
              <label className={labelClass}>From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => onFromChange?.(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="min-w-0">
              <label className={labelClass}>To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => onToChange?.(e.target.value)}
                className={fieldClass}
              />
            </div>
          </>
        ) : null}

        <div className="flex min-w-0 items-end sm:col-span-2 md:col-span-1 xl:col-span-1">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-[42px] w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white sm:w-auto"
            aria-label="Reset filters"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {typeof resultCount === "number" ? (
        <p className="mt-3 text-xs text-white/40">
          Showing {resultCount} result{resultCount === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}
