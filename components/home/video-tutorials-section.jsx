"use client";

import { useMemo, useState } from "react";

const tutorials = [
  {
    title: "Sign Up on iTrustLD",
    subtitle: "How to create your account",
    duration: "3:12",
    category: "New and Trending",
    isNew: true,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "How to Redeem Bonus",
    subtitle: "Activate and use bonus credits",
    duration: "4:05",
    category: "New and Trending",
    isNew: true,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Add Account & Wallet",
    subtitle: "Link wallet and set payout account",
    duration: "5:01",
    category: "New and Trending",
    isNew: true,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Top Up Your Wallet",
    subtitle: "Deposit funds in a few steps",
    duration: "3:48",
    category: "New and Trending",
    isNew: true,
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "How to Cash Out",
    subtitle: "Withdraw securely and quickly",
    duration: "4:24",
    category: "Wizarding World",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Redeem Trust Points",
    subtitle: "Convert points to rewards",
    duration: "3:36",
    category: "Wizarding World",
    image: "https://images.unsplash.com/photo-1639763480225-03900137dabe?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Secure Login Tutorial",
    subtitle: "Enable protection settings",
    duration: "2:52",
    category: "Wizarding World",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff36?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Profile Verification Walkthrough",
    subtitle: "Step-by-step profile checks",
    duration: "4:11",
    category: "Wizarding World",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
  }
];

function PlayIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.5 6.8v10.4L17.2 12L8.5 6.8Z" />
    </svg>
  );
}

function VideoCard({ item, accent = "green" }) {
  const isGreen = accent === "green";
  const arrowClass = isGreen
    ? "border-theme-green-action/50 text-theme-green-action hover:bg-theme-green-action hover:text-white"
    : "border-[#A855F7]/50 text-[#C084FC] hover:bg-[#A855F7] hover:text-white";
  const dotsClass = isGreen ? "bg-theme-green-action" : "bg-[#A855F7]";
  const showMeta = item.category === "Wizarding World";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12172A]/85 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/80 via-transparent to-black/20" />

        <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {item.duration}
        </span>

        {item.isNew ? (
          <span className="absolute right-3 top-3 rounded-md bg-theme-green-action px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/25">
            <PlayIcon className="ml-0.5 h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        {showMeta ? (
          <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isGreen ? "text-theme-green-action" : "text-[#C084FC]"}`}>
            Wizarding World
          </p>
        ) : null}

        <h3 className={`font-semibold text-white ${showMeta ? "mt-1.5" : ""}`}>{item.title}</h3>
        <p className="mt-1 text-sm text-white/55">{item.subtitle}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {showMeta ? (
            <div className="flex items-center gap-1.5">
              <span className={`h-0.5 w-8 rounded-full ${dotsClass}`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-80`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-50`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-30`} />
            </div>
          ) : (
            <span />
          )}

          <button
            type="button"
            aria-label={`Open ${item.title}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition duration-300 ${arrowClass}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ title, accent = "green", icon }) {
  const isGreen = accent === "green";
  const linkClass = isGreen ? "text-theme-green-action" : "text-[#C084FC]";

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${isGreen ? "bg-theme-green-action/15 text-theme-green-action" : "bg-[#A855F7]/15 text-[#C084FC]"}`}>
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-white sm:text-xl">{title}</h3>
      </div>
      <button type="button" className={`inline-flex items-center gap-1 text-sm font-semibold transition hover:brightness-110 ${linkClass}`}>
        View all
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6L15 12L9 18" />
        </svg>
      </button>
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
    <section className="relative overflow-hidden bg-[#070B16] py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/video.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#070B16]/55" aria-hidden="true" />
      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">
              <span className="h-4 w-1 rounded-full bg-[#A855F7]" />
              Media Center
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5-6xl">
              Video <span className="text-theme-green-action">Tutorials</span>
            </h2>
            <p className="mt-3 max-w-xl text-md leading-7 text-white/60 sm:text-md-lg sm:leading-8">
              Step-by-step video guides to help you learn, explore and master our platform with confidence.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.5 16.5" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full rounded-full border border-white/10 bg-[#12172A]/80 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.25)] outline-none backdrop-blur-md transition focus:border-[#A855F7]/50"
            />
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-[#12172A]/80 p-6 text-center text-sm text-white/70">
              No tutorials matched your search. Try a different keyword.
            </p>
          ) : null}

          {trending.length > 0 ? (
            <div>
              <SectionHeading
                title="New and Trending"
                accent="green"
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 3L5 13H12L11 21L19 11H12L13 3Z" />
                  </svg>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {trending.map((item) => (
                  <VideoCard key={item.title} item={item} accent="green" />
                ))}
              </div>
            </div>
          ) : null}

          {wizarding.length > 0 ? (
            <div>
              <SectionHeading
                title="Wizarding World"
                accent="purple"
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 10L12 4L16 10" />
                    <path d="M6 14H18" />
                    <path d="M7 14L5.5 20H18.5L17 14" />
                    <path d="M12 10V14" />
                  </svg>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {wizarding.map((item, index) => (
                  <VideoCard key={item.title} item={item} accent={index === 0 ? "green" : "purple"} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
