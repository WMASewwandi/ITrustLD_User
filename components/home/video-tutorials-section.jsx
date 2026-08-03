"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import VideoTutorialCard from "@/components/tutorials/video-tutorial-card";
import VideoPlayerModal from "@/components/tutorials/video-player-modal";
import { fetchActiveVideoTutorials } from "@/lib/video-tutorials";

const HOME_PREVIEW_COUNT = 4;

function SectionHeading({ title, accent = "green", icon, href }) {
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
      <Link
        href={href}
        className={`inline-flex items-center gap-1 text-sm font-semibold transition hover:brightness-110 ${linkClass}`}
      >
        View all
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6L15 12L9 18" />
        </svg>
      </Link>
    </div>
  );
}

export default function VideoTutorialsSection() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTutorial, setActiveTutorial] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const items = await fetchActiveVideoTutorials();
        if (!cancelled) setTutorials(items);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load video tutorials.");
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
    if (!text) return tutorials;
    return tutorials.filter(
      (item) =>
        item.title.toLowerCase().includes(text) ||
        (item.subtitle || "").toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text)
    );
  }, [query, tutorials]);

  const trendingAll = filtered.filter((item) => item.categoryKey === "trending");
  const guidesAll = filtered.filter((item) => item.categoryKey === "guides");
  const trending = trendingAll.slice(0, HOME_PREVIEW_COUNT);
  const guides = guidesAll.slice(0, HOME_PREVIEW_COUNT);

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
          {loading ? (
            <p className="rounded-2xl border border-white/10 bg-[#12172A]/80 p-6 text-center text-sm text-white/70">
              Loading video tutorials...
            </p>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {!loading && !error && filtered.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-[#12172A]/80 p-6 text-center text-sm text-white/70">
              {query ? "No tutorials matched your search. Try a different keyword." : "No video tutorials available yet."}
            </p>
          ) : null}

          {trending.length > 0 ? (
            <div>
              <SectionHeading
                title="New and Trending"
                accent="green"
                href="/tutorials?category=trending"
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 3L5 13H12L11 21L19 11H12L13 3Z" />
                  </svg>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {trending.map((item) => (
                  <VideoTutorialCard key={item.id} item={item} accent="green" onPlay={setActiveTutorial} />
                ))}
              </div>
            </div>
          ) : null}

          {guides.length > 0 ? (
            <div>
              <SectionHeading
                title="Wizarding World"
                accent="purple"
                href="/tutorials?category=guides"
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
                {guides.map((item, index) => (
                  <VideoTutorialCard
                    key={item.id}
                    item={item}
                    accent={index === 0 ? "green" : "purple"}
                    onPlay={setActiveTutorial}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <VideoPlayerModal tutorial={activeTutorial} onClose={() => setActiveTutorial(null)} />
    </section>
  );
}
