"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/page-header";
import BottomMessage from "@/components/dashboard/bottom-message";
import { Building2, Plus, Trash2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";

export default function ProfilePage() {
  const [banks, setBanks] = useState([
    {
      id: 1,
      bankName: "Commercial Bank",
      accountName: "Avishka Perera",
      accountNumber: "8001234567",
      branch: "Colombo 03",
    },
    {
      id: 2,
      bankName: "Hatton National Bank",
      accountName: "Avishka Perera",
      accountNumber: "0690123456",
      branch: "Nugegoda",
    },
  ]);
  const [selectedBank, setSelectedBank] = useState(1);
  const [showAddBank, setShowAddBank] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSaveProfile(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleAddBank(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const next = {
      id: Date.now(),
      bankName: form.bankName.value,
      accountName: form.accountName.value,
      accountNumber: form.accountNumber.value,
      branch: form.branch.value,
    };
    setBanks((prev) => [...prev, next]);
    setSelectedBank(next.id);
    setShowAddBank(false);
    form.reset();
  }

  function removeBank(id) {
    setBanks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBank === id) setSelectedBank(banks.find((b) => b.id !== id)?.id || null);
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Update phone number and residential address. Save bank accounts to select during top-up, cash-out, and loyalty cash redemption."
      />

      <form onSubmit={handleSaveProfile} className="mb-10 space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Personal & residential details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>First Name *</label>
            <input className={fieldClass} defaultValue="Avishka" />
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input className={fieldClass} defaultValue="Perera" />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" className={fieldClass} defaultValue="avishka@email.com" disabled />
          </div>
          <div>
            <label className={labelClass}>Phone Number *</label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-xl border border-white/12 bg-white/[0.06] px-3 text-sm text-white/70">
                +94
              </span>
              <input className={fieldClass} defaultValue="771234567" inputMode="numeric" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Residential Address *</label>
            <input className={fieldClass} defaultValue="12 Flower Road, Colombo 07" />
          </div>
          <div>
            <label className={labelClass}>City / Town *</label>
            <input className={fieldClass} defaultValue="Colombo" />
          </div>
          <div>
            <label className={labelClass}>Zip Code *</label>
            <input className={fieldClass} defaultValue="00700" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Country *</label>
            <select className={fieldClass} defaultValue="Sri Lanka (+94)">
              <option>Sri Lanka (+94)</option>
              <option>India (+91)</option>
              <option>Singapore (+65)</option>
              <option>United Arab Emirates (+971)</option>
              <option>United Kingdom (+44)</option>
              <option>United States (+1)</option>
            </select>
            <p className="mt-1 text-[11px] text-white/35">
              Country selection updates phone country code (same rule as registration)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-white/20 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,255,255,0.08)] transition hover:bg-white/30"
          >
            Save profile
          </button>
          {saved ? (
            <BottomMessage
              title="Profile saved"
              variant="success"
              onClose={() => setSaved(false)}
              primaryAction={{ label: "OK", onClick: () => setSaved(false) }}
              secondaryAction={{ label: "Close", onClick: () => setSaved(false) }}
            >
              Profile saved (demo)
            </BottomMessage>
          ) : null}
        </div>
      </form>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Saved bank accounts</h2>
            <p className="mt-1 text-sm text-white/45">
              Select a preferred account for top-up, cash-out, and loyalty rewards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBank((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Add bank
          </button>
        </div>

        {showAddBank ? (
          <form onSubmit={handleAddBank} className="mb-5 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Bank name *</label>
              <input name="bankName" required className={fieldClass} placeholder="Bank name" />
            </div>
            <div>
              <label className={labelClass}>Account name *</label>
              <input name="accountName" required className={fieldClass} placeholder="Account holder" />
            </div>
            <div>
              <label className={labelClass}>Account number *</label>
              <input name="accountNumber" required className={fieldClass} placeholder="Account number" />
            </div>
            <div>
              <label className={labelClass}>Branch *</label>
              <input name="branch" required className={fieldClass} placeholder="Branch" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,255,255,0.08)] transition hover:bg-white/30">
                Save bank account
              </button>
            </div>
          </form>
        ) : null}

        <div className="space-y-3">
          {banks.map((bank) => (
            <label
              key={bank.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                selectedBank === bank.id
                  ? "border-theme-green-action/40 bg-theme-green-action/10"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="preferredBank"
                className="mt-1"
                checked={selectedBank === bank.id}
                onChange={() => setSelectedBank(bank.id)}
              />
              <div className="flex flex-1 items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-theme-green-action">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{bank.bankName}</p>
                    <p className="mt-0.5 text-sm text-white/55">
                      {bank.accountName} · {bank.accountNumber}
                    </p>
                    <p className="text-xs text-white/40">{bank.branch}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeBank(bank.id);
                  }}
                  className="rounded-lg p-2 text-white/35 transition hover:bg-white/5 hover:text-theme-red-action"
                  aria-label="Remove bank"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </label>
          ))}
          {banks.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/40">No saved banks yet. Add one to continue.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
