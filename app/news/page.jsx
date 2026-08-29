"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";
import UpdateCard from "@/components/news/update-card";
import UpdateDetailModal from "@/components/news/update-detail-modal";
import { fetchLatestUpdates } from "@/lib/latest-updates";

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const updates = await fetchLatestUpdates();
        if (!cancelled) setItems(updates);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B16]">
      <NavigationGuest />

      <main className="bg-white">
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/sec.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-white/45" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/25 bg-[#EAF8EC] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action shadow-sm">
                <span className="h-2 w-2 rounded-full bg-theme-green-action" />
                Latest News
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl">
                All <span className="text-theme-green-action">News</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-theme-gray sm:text-base">
                Browse every published news post from iTrustLD.
              </p>
            </div>

            {loading ? (
              <p className="mt-12 text-center text-sm text-theme-gray">Loading updates…</p>
            ) : items.length === 0 ? (
              <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-[#E6EBF2] bg-white px-5 py-10 text-center text-sm text-theme-gray">
                No news posts are available right now. Please check back soon.
              </p>
            ) : (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <div key={item.id} className="h-full">
                    <UpdateCard item={item} onOpen={setActiveItem} />
                  </div>
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
      <UpdateDetailModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}
