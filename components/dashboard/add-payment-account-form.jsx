"use client";

import { useEffect, useMemo, useState } from "react";
import {
  accountTypeHint,
  buildCreatePayload,
  createPaymentAccount,
  fetchPaymentAccounts,
  optionDisplayName,
  paymentOptionNameToAccountType,
} from "@/lib/payment-accounts";
import { Loader2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";

function normalizeOptions(raw) {
  return (raw || [])
    .map((item) => {
      if (item && typeof item === "object") {
        return {
          ...item,
          name: item.name || item.display_name || "",
          display_name: item.display_name || item.displayName || item.name || "",
          fields: Array.isArray(item.fields) ? item.fields : [],
        };
      }
      const name = String(item || "").trim();
      if (!name) return null;
      return { name, display_name: name, kind: "unknown", fields: [] };
    })
    .filter((item) => item?.name);
}

export default function AddPaymentAccountForm({
  accountTypes = [],
  defaultAccountType = "",
  fixedAccountType = "",
  onSuccess,
  onCancel,
  compact = false,
}) {
  const providedOptions = useMemo(() => normalizeOptions(accountTypes), [accountTypes]);
  const [fetchedOptions, setFetchedOptions] = useState([]);
  const [accountType, setAccountType] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});

  const catalog = providedOptions.some((item) => item.fields?.length || item.kind)
    ? providedOptions
    : fetchedOptions.length
      ? fetchedOptions
      : providedOptions;

  const options = useMemo(() => {
    if (fixedAccountType) {
      const key = paymentOptionNameToAccountType(fixedAccountType);
      const match = catalog.find(
        (item) =>
          paymentOptionNameToAccountType(item.name) === key ||
          String(item.display_name || "").toUpperCase() === key,
      );
      return match ? [match] : catalog.filter((item) => paymentOptionNameToAccountType(item.name) === key);
    }
    const seen = new Set();
    const unique = [];
    for (const item of catalog) {
      const key = `${item.kind || ""}:${paymentOptionNameToAccountType(item.name)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return unique;
  }, [catalog, fixedAccountType]);

  const selectedOption =
    options.find((item) => item.name === accountType) ||
    options.find(
      (item) => paymentOptionNameToAccountType(item.name) === paymentOptionNameToAccountType(accountType),
    ) ||
    options[0] ||
    null;
  const fields = selectedOption?.fields || [];
  const typeLabel = optionDisplayName(selectedOption, accountType);
  const hint = selectedOption?.hint || accountTypeHint(selectedOption?.name || accountType);
  const canSave = fields.length > 0;

  useEffect(() => {
    let cancelled = false;
    const needsCatalog =
      Boolean(fixedAccountType) ||
      !providedOptions.some((item) => item.fields?.length || item.kind === "custom" || item.kind === "builtin");
    if (!needsCatalog) return undefined;
    fetchPaymentAccounts()
      .then((data) => {
        if (cancelled) return;
        setFetchedOptions(normalizeOptions(data.system_payment_options || []));
      })
      .catch(() => {
        if (!cancelled) setFetchedOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [fixedAccountType, providedOptions]);

  useEffect(() => {
    if (!options.length) return;
    const preferred = defaultAccountType || fixedAccountType || options[0].name;
    const match =
      options.find((item) => item.name === preferred) ||
      options.find(
        (item) => paymentOptionNameToAccountType(item.name) === paymentOptionNameToAccountType(preferred),
      ) ||
      options[0];
    setAccountType(match.name);
  }, [options, defaultAccountType, fixedAccountType]);

  useEffect(() => {
    const next = {};
    for (const field of fields) next[field.key] = "";
    setForm(next);
    setError("");
  }, [selectedOption?.name, selectedOption?.kind, fields.length]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedOption || !canSave) {
      setError("This account type is not supported yet. Please choose another type.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await createPaymentAccount(
        buildCreatePayload(selectedOption.name, form, selectedOption),
      );
      if (result?.error) {
        setError(result.message || "Failed to add account.");
        return;
      }
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || "Failed to add account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {!fixedAccountType ? (
        <div>
          <label className={labelClass}>Account type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className={fieldClass}
          >
            {options.map((item) => (
              <option key={item.id || item.name} value={item.name} className="bg-[#141A2E]">
                {optionDisplayName(item, item.name)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-sm text-white/60">
          Adding: <span className="font-medium text-white">{typeLabel}</span>
        </p>
      )}

      <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/55">
        {hint}
      </p>

      {fields.length ? (
        <div className={`grid gap-3 ${fields.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {fields.map((field) => (
            <div key={field.key}>
              <label className={labelClass}>
                {field.label}
                {field.required === false ? "" : " *"}
              </label>
              <input
                required={field.required !== false}
                type={field.type === "email" ? "email" : "text"}
                inputMode={field.inputMode}
                value={form[field.key] || ""}
                onChange={(e) => {
                  const next =
                    field.inputMode === "numeric" ? e.target.value.replace(/\D/g, "") : e.target.value;
                  updateField(field.key, next);
                }}
                className={fieldClass}
                placeholder={field.placeholder || ""}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-theme-red-action">
          This account type is not supported yet. Please choose another type.
        </p>
      )}

      {error ? <p className="text-xs text-theme-red-action">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy || !canSave}
          className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save account
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
