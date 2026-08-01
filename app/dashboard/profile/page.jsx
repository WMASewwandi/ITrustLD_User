"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/dashboard/page-header";
import BottomMessage from "@/components/dashboard/bottom-message";
import { ArrowRight, Building2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  function handleSaveProfile(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            className="rounded-xl bg-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30"
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Payment accounts</h2>
            <p className="mt-1 max-w-xl text-sm text-white/45">
              Save bank, e-wallet, XM, and other receiving accounts. These are used when you cash out,
              redeem loyalty points, or choose where payouts are sent.
            </p>
          </div>
          <Link
            href="/dashboard/profile/accounts"
            className="inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Manage accounts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-theme-green-action">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-white">Receiving accounts</p>
            <p className="mt-1 text-sm text-white/50">
              Add XM, Skrill, Neteller, Perfect Money, bank transfer, or crypto accounts from the
              accounts page. You can also add an account during cash-out if you do not have one saved
              yet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
