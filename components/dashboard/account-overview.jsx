import Link from "next/link";
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
  "In-Progress": "text-theme-green-shaded bg-theme-green-shaded/10 border-theme-green-shaded/25",
  Pending: "text-white/60 bg-white/5 border-white/10",
  Rejected: "text-theme-red-action bg-theme-red-action/10 border-theme-red-action/25",
};

export default function AccountOverview() {
  const points = 128450;
  const nextTier = "Gold";
  const nextNeeded = 250000;
  const progress = Math.min(100, Math.round((points / nextNeeded) * 100));

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-2 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* KYC / Documents */}
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">Document Verification</h2>
                <p className="text-xs text-white/45">KYC status overview</p>
              </div>
            </div>
            <Link
              href="/dashboard/documents"
              className="text-xs font-medium text-theme-green-action hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-theme-green-shaded/25 bg-theme-green-shaded/10 px-3 py-2.5 text-xs text-theme-green-shaded">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Complete verification to unlock all deposit methods.
          </div>

          <ul className="space-y-2.5">
            {DOCS.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <FileText className="h-3.5 w-3.5 text-white/40" />
                  {doc.name}
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[doc.status]}`}
                >
                  {doc.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        {/* Trust Points */}
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-green-action/15 text-theme-green-action">
                <Trophy className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">Trust Points</h2>
                <p className="text-xs text-white/45">Loyalty tier progression</p>
              </div>
            </div>
            <Link
              href="/dashboard/loyalty"
              className="text-xs font-medium text-theme-green-action hover:underline"
            >
              View tiers
            </Link>
          </div>

          <div className="mb-1 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Current tier</p>
              <p className="mt-1 text-2xl font-bold text-white">Silver</p>
            </div>
            <p className="text-right">
              <span className="block text-xs text-white/40">Points</span>
              <span className="text-lg font-semibold text-theme-green-action">{points.toLocaleString()}</span>
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-white/50">
              <span>Progress to {nextTier}</span>
              <span>{progress}%</span>
            </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-theme-green-action"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/40">
              Need {(nextNeeded - points).toLocaleString()} more points for {nextTier}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {["Silver", "Gold", "Diamond", "VIP", "VVIP"].map((tier) => (
              <span
                key={tier}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  tier === "Silver"
                    ? "border-theme-green-action/40 bg-theme-green-action/15 text-theme-green-action"
                    : "border-white/10 text-white/40"
                }`}
              >
                {tier}
              </span>
            ))}
          </div>
        </article>

        {/* Quick account */}
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-1">
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
              <dd className="font-medium text-white">Normal User</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Saved banks</dt>
              <dd className="font-medium text-white">2 accounts</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Pending requests</dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-theme-green-shaded">
                <Clock3 className="h-3.5 w-3.5" />1 deposit
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
