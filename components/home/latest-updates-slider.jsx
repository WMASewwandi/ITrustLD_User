"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UpdateCard from "@/components/news/update-card";
import UpdateDetailModal from "@/components/news/update-detail-modal";
import {
  assignLandingSlots,
  fetchLatestUpdates,
  LANDING_PREVIEW_COUNT,
} from "@/lib/latest-updates";

export default function LatestUpdatesSlider() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await fetchLatestUpdates();
        if (!cancelled) setAllItems(items);
      } catch {
        if (!cancelled) setAllItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const previewItems = useMemo(
    () => assignLandingSlots(allItems.slice(0, LANDING_PREVIEW_COUNT)),
    [allItems],
  );

  const slots = useMemo(() => {
    const map = {};
    for (const item of previewItems) {
      map[item.slot] = item;
    }
    return map;
  }, [previewItems]);

  if (!loading && allItems.length === 0) {
    return null;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/sec.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-white/40" aria-hidden="true" />

        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/25 bg-[#EAF8EC] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action shadow-sm">
              <span className="h-2 w-2 rounded-full bg-theme-green-action" />
              Latest News
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl lg:text-5-6xl">
              Latest <span className="text-theme-green-action">Updates</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-md leading-7 text-theme-gray sm:text-md-lg sm:leading-8">
              Stay informed with our latest updates, promotions, and important announcements.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex min-h-[320px] items-center justify-center">
              <p className="text-sm text-theme-gray">Loading updates…</p>
            </div>
          ) : (
            <>
              <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-[1fr_1.4fr_1fr] lg:grid-rows-2 xl:gap-8">
                {slots["left-top"] ? (
                  <div className="h-full min-h-[320px] lg:col-start-1 lg:row-start-1 lg:min-h-0">
                    <UpdateCard item={slots["left-top"]} onOpen={setActiveItem} />
                  </div>
                ) : null}
                {slots.center ? (
                  <div className="h-full min-h-[480px] lg:col-start-2 lg:row-span-2 lg:min-h-[720px] xl:min-h-[780px]">
                    <UpdateCard item={slots.center} onOpen={setActiveItem} featuredLayout />
                  </div>
                ) : null}
                {slots["right-top"] ? (
                  <div className="h-full min-h-[320px] lg:col-start-3 lg:row-start-1 lg:min-h-0">
                    <UpdateCard item={slots["right-top"]} onOpen={setActiveItem} />
                  </div>
                ) : null}
                {slots["left-bottom"] ? (
                  <div className="h-full min-h-[320px] lg:col-start-1 lg:row-start-2 lg:min-h-0">
                    <UpdateCard item={slots["left-bottom"]} onOpen={setActiveItem} />
                  </div>
                ) : null}
                {slots["right-bottom"] ? (
                  <div className="h-full min-h-[320px] lg:col-start-3 lg:row-start-2 lg:min-h-0">
                    <UpdateCard item={slots["right-bottom"]} onOpen={setActiveItem} />
                  </div>
                ) : null}
              </div>

              {allItems.length > 0 ? (
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/news"
                    className="inline-flex items-center justify-center rounded-xl border border-theme-green-action/30 bg-[#EAF8EC] px-6 py-3 text-sm font-semibold text-theme-green-action transition hover:bg-theme-green-action hover:text-white"
                  >
                    View All News
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <UpdateDetailModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
