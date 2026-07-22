import Link from "next/link";
import { Layers, Users } from "lucide-react";

const CARDS = [
  {
    href: "/admin/partner-tiers",
    title: "Partner Tiers",
    description: "Update level-point thresholds and points-per-lot rewards for Normal → VVIP.",
    icon: Layers,
  },
  {
    href: "/admin/accounts",
    title: "Accounts",
    description: "Enable partner option on accounts and assign the current partner tier.",
    icon: Users,
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Admin masters</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/50">
        Frontend demo masters for partner loyalty. Changes save to localStorage and appear on the user
        loyalty page for partner accounts.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CARDS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-white/12 bg-[#141A2E] p-5 transition hover:border-theme-green-action/40 hover:bg-[#1A2238]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-theme-green-action/15 text-theme-green-action">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/50">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
