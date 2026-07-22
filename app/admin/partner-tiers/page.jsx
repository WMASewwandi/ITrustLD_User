"use client";

import { useEffect, useState } from "react";
import { getPartnerTiers, savePartnerTiers } from "@/lib/loyalty";

export default function PartnerTiersAdminPage() {
  const [tiers, setTiers] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTiers(getPartnerTiers());
  }, []);

  function updateTier(index, field, value) {
    setTiers((prev) =>
      prev.map((tier, i) => {
        if (i !== index) return tier;
        if (field === "name") return { ...tier, name: value };
        const num = Number(String(value).replace(/\D/g, "")) || 0;
        return { ...tier, [field]: num };
      })
    );
    setSaved(false);
  }

  function handleSave() {
    savePartnerTiers(tiers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Partner tiers</h1>
          <p className="mt-2 text-sm text-white/50">
            Edit level points and points-per-lot rewards. Values sync to partner loyalty UI.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Save tiers
        </button>
      </div>

      {saved ? (
        <p className="mt-4 rounded-xl border border-theme-green-action/30 bg-theme-green-action/10 px-4 py-2 text-sm text-theme-green-action">
          Partner tiers saved.
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/12 bg-[#141A2E]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Level points</th>
              <th className="px-4 py-3 font-medium">Points per lot</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr key={tier.id || tier.name} className="border-b border-white/8">
                <td className="px-4 py-3">
                  <input
                    value={tier.name}
                    onChange={(e) => updateTier(index, "name", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-3 py-2 text-white outline-none focus:border-theme-green-action/50"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={tier.levelPoints}
                    onChange={(e) => updateTier(index, "levelPoints", e.target.value)}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-3 py-2 text-white outline-none focus:border-theme-green-action/50"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={tier.pointsPerLot}
                    onChange={(e) => updateTier(index, "pointsPerLot", e.target.value)}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-white/15 bg-[#0B1020] px-3 py-2 text-white outline-none focus:border-theme-green-action/50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
