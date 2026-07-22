import Link from "next/link";
import PageHeader from "@/components/dashboard/page-header";
import { HelpCircle, MessageCircle, BookOpen } from "lucide-react";

const FAQS = [
  {
    q: "How long does document verification take?",
    a: "Most documents move from Pending to In-Progress within one business day. You will see rejection reasons on the Documents page if a file is declined.",
  },
  {
    q: "Can I reuse saved bank accounts?",
    a: "Yes. Add banks in My Profile and select them during top-up, cash-out, and loyalty cash redemption.",
  },
  {
    q: "How do Trust Points tiers work?",
    a: "Tiers progress with activity: Normal → Silver → Gold → Diamond → VIP (500k points) → VVIP (1M points). Tap a level on the Loyalty page to see benefits.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="Guides for KYC, top-ups, cash-outs, transactions, and Trust Points. Live chat support is available 24/7."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/dashboard/documents", label: "KYC docs", icon: BookOpen },
          { href: "/dashboard/transactions", label: "Transaction help", icon: HelpCircle },
          { href: "#", label: "Chat support", icon: MessageCircle },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-medium text-white transition hover:border-white/20"
          >
            <item.icon className="h-4 w-4 text-theme-green-action" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {FAQS.map((item) => (
          <article key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-semibold text-white">{item.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{item.a}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
