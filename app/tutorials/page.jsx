"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";
import VideoTutorialCard from "@/components/tutorials/video-tutorial-card";
import VideoPlayerModal from "@/components/tutorials/video-player-modal";
import { fetchActiveVideoTutorials } from "@/lib/video-tutorials";

const CATEGORY_FILTERS = [
  { key: "all", label: "All Tutorials" },
  { key: "trending", label: "New and Trending" },
  { key: "guides", label: "Wizarding World" },
];

export default function TutorialsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [activeTutorial, setActiveTutorial] = useState(null);

  useEffect(() => {
    const param = searchParams.get("category") || "all";
    setCategory(param);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const items = await fetchActiveVideoTutorials();
        if (!cancelled) setTutorials(items);
      } catch {
        if (!cancelled) setTutorials([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return tutorials.filter((item) => {
      const matchesCategory = category === "all" || item.categoryKey === category;
      if (!matchesCategory) return false;
      if (!text) return true;
      return (
        item.title.toLowerCase().includes(text) ||
        (item.subtitle || "").toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text)
      );
    });
  }, [category, query, tutorials]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B16]">
      <NavigationGuest />

      <main>
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/video.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#070B16]/70" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">
                <span className="h-4 w-1 rounded-full bg-[#A855F7]" />
                Media Center
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Video <span className="text-theme-green-action">Tutorials</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Browse every tutorial and learn how to get the most out of iTrustLD.
              </p>
            </div>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORY_FILTERS.map((item) => {
                  const active = category === item.key;
                  return (
                    <Link
                      key={item.key}
                      href={item.key === "all" ? "/tutorials" : `/tutorials?category=${item.key}`}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-theme-green-action text-white"
                          : "border border-white/10 bg-[#12172A]/80 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="relative w-full sm:max-w-xs">
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
                  className="w-full rounded-full border border-white/10 bg-[#12172A]/80 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#A855F7]/50"
                />
              </div>
            </div>

            {loading ? (
              <p className="mt-12 text-center text-sm text-white/70">Loading tutorials…</p>
            ) : filtered.length === 0 ? (
              <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/10 bg-[#12172A]/80 px-5 py-10 text-center text-sm text-white/70">
                {query ? "No tutorials matched your search." : "No video tutorials are available in this category."}
              </p>
            ) : (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {filtered.map((item, index) => (
                  <VideoTutorialCard
                    key={item.id}
                    item={item}
                    accent={item.categoryKey === "guides" && index % 2 === 1 ? "purple" : "green"}
                    onPlay={setActiveTutorial}
                  />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-theme-green-action/30 px-6 py-3 text-sm font-semibold text-theme-green-action transition hover:bg-theme-green-action hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterGuest />
      <VideoPlayerModal tutorial={activeTutorial} onClose={() => setActiveTutorial(null)} />
    </div>
  );
}
