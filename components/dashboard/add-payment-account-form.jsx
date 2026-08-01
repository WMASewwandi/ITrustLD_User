"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACCOUNT_TYPE_LABELS,
  accountTypeFieldConfig,
  accountTypeHint,
  accountTypeNeedsBankFields,
  buildCreatePayload,
  createPaymentAccount,
  paymentOptionNameToAccountType,
} from "@/lib/payment-accounts";
import { Loader2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";

export default function AddPaymentAccountForm({
  accountTypes = [],
  defaultAccountType = "",
  fixedAccountType = "",
  onSuccess,
  onCancel,
  compact = false,
}) {
  const options = useMemo(() => {
    const raw = fixedAccountType
      ? [fixedAccountType]
      : accountTypes.length
        ? accountTypes
        : Object.keys(ACCOUNT_TYPE_LABELS);

    const seen = new Set();
    const unique = [];
    for (const type of raw) {
      const key = paymentOptionNameToAccountType(type);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(type);
    }
    return unique;
  }, [accountTypes, fixedAccountType]);

  const [accountType, setAccountType] = useState(defaultAccountType || options[0] || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    xm_account_id: "",
    skrill_email: "",
    neteller_email: "",
    pm_account_id: "",
    crypto_account_id: "",
    account_number: "",
    beneficiary_name: "",
    bank: "",
    branch: "",
  });

  const rawType = fixedAccountType || accountType;
  const selectedType = paymentOptionNameToAccountType(rawType);
  const fieldConfig = accountTypeFieldConfig(rawType);
  const showBankFields = accountTypeNeedsBankFields(rawType);
  const typeLabel = ACCOUNT_TYPE_LABELS[selectedType] || rawType;
  const hint = accountTypeHint(rawType);

  useEffect(() => {
    setForm({
      xm_account_id: "",
      skrill_email: "",
      neteller_email: "",
      pm_account_id: "",
      crypto_account_id: "",
      account_number: "",
      beneficiary_name: "",
      bank: "",
      branch: "",
    });
    setError("");
  }, [selectedType]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await createPaymentAccount(buildCreatePayload(rawType, form));
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
            {options.map((type) => {
              const optionKey = paymentOptionNameToAccountType(type);
              return (
              <option key={optionKey} value={type} className="bg-[#141A2E]">
                {ACCOUNT_TYPE_LABELS[optionKey] || type}
              </option>
              );
            })}
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

      {showBankFields ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Bank name *</label>
            <input
              required
              value={form.bank}
              onChange={(e) => updateField("bank", e.target.value)}
              className={fieldClass}
              placeholder="e.g. Commercial Bank"
            />
          </div>
          <div>
            <label className={labelClass}>Branch *</label>
            <input
              required
              value={form.branch}
              onChange={(e) => updateField("branch", e.target.value)}
              className={fieldClass}
              placeholder="e.g. Colombo 03"
            />
          </div>
          <div>
            <label className={labelClass}>Account holder name *</label>
            <input
              required
              value={form.beneficiary_name}
              onChange={(e) => updateField("beneficiary_name", e.target.value)}
              className={fieldClass}
              placeholder="Name as on bank account"
            />
          </div>
          <div>
            <label className={labelClass}>Account number *</label>
            <input
              required
              inputMode="numeric"
              value={form.account_number}
              onChange={(e) => updateField("account_number", e.target.value.replace(/\D/g, ""))}
              className={fieldClass}
              placeholder="Digits only"
            />
          </div>
        </div>
      ) : fieldConfig.primaryName ? (
        <div>
          <label className={labelClass}>{fieldConfig.primaryLabel} *</label>
          <input
            required
            type={fieldConfig.primaryType || "text"}
            inputMode={fieldConfig.primaryInputMode}
            value={form[fieldConfig.primaryName]}
            onChange={(e) => updateField(fieldConfig.primaryName, e.target.value)}
            className={fieldClass}
            placeholder={fieldConfig.primaryPlaceholder}
          />
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
          disabled={busy || (!showBankFields && !fieldConfig.primaryName)}
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
