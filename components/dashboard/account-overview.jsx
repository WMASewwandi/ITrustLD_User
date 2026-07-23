"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_TRUST_POINTS, getMembershipProgress } from "@/lib/membership-tiers";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Trophy,
} from "lucide-react";

const DOCS = [
  { name: "National ID (Front)", status: "Completed" },
  { name: "National ID (Back)", status: "In-Progress" },
  { name: "Proof of Address", status: "Pending" },
];

const STATUS_STYLE = {
  Completed: "text-theme-green-action bg-theme-green-action/10 border-theme-green-action/25",
  "In-Progress": "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Pending: "text-theme-orange bg-theme-orange/10 border-theme-orange/25",
  Rejected: "text-theme-red-action bg-theme-red-action/10 border-theme-red-action/25",
};

export default function AccountOverview() {
  const points = DEMO_TRUST_POINTS;
  const { current, next, remaining, progressPct } = getMembershipProgress(points);
  const nextTier = next?.name || current.name;
  const progress = progressPct;
  const [userType, setUserType] = useState("normal");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const user = JSON.parse(raw);
        setUserType(user?.userType === "partner" ? "partner" : "normal");
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-2 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        {/* KYC / Documents */}
        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">Document Verification</h2>
                <p className="truncate text-xs text-white/45">KYC status overview</p>
              </div>
            </div>
            <Link
              href="/dashboard/documents"
              className="shrink-0 pt-0.5 text-xs font-medium text-theme-green-action hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="mb-4 flex items-start gap-2 rounded-xl border border-theme-green-shaded/25 bg-theme-green-shaded/10 px-3 py-2.5 text-xs text-theme-green-shaded">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 leading-relaxed">
              Complete verification to unlock all top-up methods.
            </span>
          </div>

          <ul className="space-y-2.5">
            {DOCS.map((doc) => (
              <li
                key={doc.name}
                className="flex min-w-0 items-center gap-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-white/80">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-white/40" />
                  <span className="truncate">{doc.name}</span>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[doc.status]}`}
                >
                  {doc.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        {/* Trust Points */}
        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <Trophy className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">Trust Points</h2>
                <p className="truncate text-xs text-white/45">Loyalty tier progression</p>
              </div>
            </div>
            <Link
              href="/dashboard/loyalty"
              className="shrink-0 pt-0.5 text-xs font-medium text-white hover:underline"
            >
              View
            </Link>
          </div>

          <div className="mb-1 flex min-w-0 items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-white/40">Current tier</p>
              <span className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                {current.name}
              </span>
            </div>
            <p className="shrink-0 text-right">
              <span className="block text-xs text-white/40">Points</span>
              <span className="text-base font-semibold text-white sm:text-lg">
                {points.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="mt-4 min-w-0">
            <div className="mb-2 flex justify-between gap-2 text-xs text-white/50">
              <span className="min-w-0 truncate">Progress to {nextTier}</span>
              <span className="shrink-0">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-white to-theme-green-action"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 break-words text-xs text-white/40">
              {next
                ? `Need ${remaining.toLocaleString()} more points for ${nextTier}`
                : "Max membership tier reached"}
            </p>
          </div>
        </article>

        {/* Quick account */}
        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">Account Snapshot</h2>
              <p className="text-xs text-white/45">Saved banks & profile</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">User type</dt>
              <dd className="font-medium text-white">
                {userType === "partner" ? "Partner" : "Normal User"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Saved banks</dt>
              <dd className="font-medium text-white">2 accounts</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Pending requests</dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-theme-green-shaded">
                <Clock3 className="h-3.5 w-3.5" />1 top-up
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-white/45">Phone</dt>
              <dd className="font-medium text-white">+94 77 123 4567</dd>
            </div>
          </dl>

          <Link
            href="/dashboard/profile"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Open My Profile
          </Link>
        </article>
      </div>
    </section>
  );
}
