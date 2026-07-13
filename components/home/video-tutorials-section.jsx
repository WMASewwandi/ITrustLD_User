"use client";

import { useMemo, useState } from "react";

const tutorials = [
  { title: "Sign Up on iTrustLD", subtitle: "How to create your account", duration: "3:12", category: "New and Trending", tone: "from-theme-blue-dark via-theme-blue-darkshade to-theme-blue-panel" },
  { title: "How to Redeem Bonus", subtitle: "Activate and use bonus credits", duration: "4:05", category: "New and Trending", tone: "from-theme-blue-darkshade via-theme-blue-panel to-theme-green-dark" },
  { title: "Add Account & Wallet", subtitle: "Link wallet and set payout account", duration: "5:01", category: "New and Trending", tone: "from-theme-blue-panel via-theme-blue-darkshade to-theme-green-shaded" },
  { title: "Top Up Your Wallet", subtitle: "Deposit funds in a few steps", duration: "3:48", category: "New and Trending", tone: "from-theme-green-dark via-theme-blue-panel to-theme-blue-dark" },
  { title: "How to Cash Out", subtitle: "Withdraw securely and quickly", duration: "4:24", category: "Wizarding World", tone: "from-theme-blue-dark via-theme-green-dark to-theme-blue-panel" },
  { title: "Redeem Trust Points", subtitle: "Convert points to rewards", duration: "3:36", category: "Wizarding World", tone: "from-theme-blue-darkshade via-theme-green-dark to-theme-blue-panel" },
  { title: "Secure Login Tutorial", subtitle: "Enable protection settings", duration: "2:52", category: "Wizarding World", tone: "from-theme-blue-panel via-theme-blue-dark to-theme-green-dark" },
  { title: "Profile Verification Walkthrough", subtitle: "Step-by-step profile checks", duration: "4:11", category: "Wizarding World", tone: "from-theme-blue-darkshade via-theme-blue-panel to-theme-green-dark" }
];

function ThumbCard({ item, wide = false }) {
  return (
    <article className={`group relative overflow-hidden border border-theme-blue-darkshade/70 bg-theme-blue-dark ${wide ? "min-h-[230px]" : "min-h-[132px]"}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/35 px-2 py-0.5 text-[11px] font-medium text-white">
        {item.duration}
      </div>

      <div className="absolute bottom-0 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/75">{item.category}</p>
        <h3 className={`${wide ? "mt-2 text-4xl" : "mt-1 text-md-lg"} font-semibold leading-tight text-white`}>{item.title}</h3>
        {!wide && <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>}
      </div>
    </article>
  );
}

function TutorialRow({ title, items, wideFirst = false }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-md-lg font-semibold text-white/90">{title}</h3>
      <div className={`grid gap-3 ${wideFirst ? "lg:grid-cols-[1.35fr_repeat(3,1fr)]" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {items.map((item, idx) => (
          <ThumbCard key={`${title}-${item.title}`} item={item} wide={wideFirst && idx === 0} />
        ))}
      </div>
    </div>
  );
}

export default function VideoTutorialsSection() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return tutorials;
    return tutorials.filter(
      (item) =>
        item.title.toLowerCase().includes(text) ||
        item.subtitle.toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text)
    );
  }, [query]);

  const trending = filtered.filter((item) => item.category === "New and Trending").slice(0, 4);
  const wizarding = filtered.filter((item) => item.category === "Wizarding World").slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-theme-blue-dark py-16 sm:py-20">
      <div className="container-shell relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Media Center</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Video <span className="text-theme-green-action">Tutorials</span>
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full border border-theme-blue-darkshade bg-theme-blue-panel px-10 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-theme-green-action focus:outline-none"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/65">⌕</span>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {filtered.length === 0 && (
            <p className="border border-theme-blue-darkshade bg-theme-blue-panel p-6 text-center text-sm text-white/75">
              No tutorials matched your search. Try a different keyword.
            </p>
          )}
          <TutorialRow title="New and Trending" items={trending} />
          <TutorialRow title="Wizarding World" items={wizarding} wideFirst />
        </div>
      </div>
    </section>
  );
}
