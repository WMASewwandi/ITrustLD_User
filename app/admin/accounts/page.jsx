"use client";

import { useEffect, useState } from "react";
import { getAccounts, saveAccounts } from "@/lib/accounts";
import { getPartnerTiers } from "@/lib/loyalty";

export default function AccountsAdminPage() {
  const [accounts, setAccounts] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAccounts(getAccounts());
    setTiers(getPartnerTiers());
  }, []);

  function updateAccount(index, patch) {
    setAccounts((prev) => prev.map((acc, i) => (i === index ? { ...acc, ...patch } : acc)));
    setSaved(false);
  }

  function togglePartner(index, enabled) {
    const tierName = tiers[0]?.name || "Normal";
    updateAccount(index, {
      userType: enabled ? "partner" : "normal",
      partnerTier: enabled ? accounts[index].partnerTier || tierName : null,
      partnerPoints: enabled ? accounts[index].partnerPoints || 0 : 0,
    });
  }

  function handleSave() {
    saveAccounts(accounts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Accounts</h1>
          <p className="mt-2 text-sm text-white/50">
            Enable partner option per account. Default partner: partner@itrustld.com
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Save accounts
        </button>
      </div>

      {saved ? (
        <p className="mt-4 rounded-xl border border-theme-green-action/30 bg-theme-green-action/10 px-4 py-2 text-sm text-theme-green-action">
          Accounts saved. Re-login as the user to refresh session flags.
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {accounts.map((acc, index) => {
          const isPartner = acc.userType === "partner";
          return (
            <article
              key={acc.id || acc.email}
              className="rounded-2xl border border-white/12 bg-[#141A2E] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-white">{acc.name}</p>
                  <p className="text-sm text-white/50">{acc.email}</p>
                  <p className="mt-1 text-xs text-white/35">ID #{acc.accountId}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0B1020]/70 px-3 py-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={isPartner}
                      onChange={(e) => togglePartner(index, e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent text-theme-green-action"
                    />
                    Enable partner
                  </label>

                  <select
                    disabled={!isPartner}
                    value={acc.partnerTier || tiers[0]?.name || "Normal"}
                    onChange={(e) => updateAccount(index, { partnerTier: e.target.value })}
                    className="rounded-xl border border-white/15 bg-[#0B1020]/70 px-3 py-2 text-sm text-white outline-none disabled:opacity-40"
                  >
                    {tiers.map((t) => (
                      <option key={t.id || t.name} value={t.name} className="bg-[#141A2E]">
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <input
                    disabled={!isPartner}
                    value={acc.partnerPoints ?? 0}
                    onChange={(e) =>
                      updateAccount(index, {
                        partnerPoints: Number(String(e.target.value).replace(/\D/g, "")) || 0,
                      })
                    }
                    inputMode="numeric"
                    className="w-28 rounded-xl border border-white/15 bg-[#0B1020]/70 px-3 py-2 text-sm text-white outline-none disabled:opacity-40"
                    aria-label="Partner points"
                    title="Partner level points"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
