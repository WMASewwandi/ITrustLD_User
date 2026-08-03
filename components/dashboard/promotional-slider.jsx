"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchActivePromotionalBanners } from "@/lib/promotional-banners";
import { getUserSession } from "@/lib/auth";
import { isPromotionInActivePeriod, isPromotionVideoUrl } from "@/lib/promotion-utils";

function isExternalLink(href) {
  return /^https?:\/\//i.test(String(href || ""));
}

function resolveAudience(user) {
  if (user?.user_type === "partner" || user?.is_affiliate) return "affiliate";
  return "normal";
}

export default function PromotionalSlider({ slides: propSlides, audience }) {
  const [fallbackSlides, setFallbackSlides] = useState([]);
  const slides = (propSlides?.length ? propSlides : fallbackSlides).filter(isPromotionInActivePeriod);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (propSlides?.length) return undefined;

    let cancelled = false;
    const resolvedAudience = audience || resolveAudience(getUserSession());

    async function load() {
      try {
        const banners = await fetchActivePromotionalBanners({
          audience: resolvedAudience,
          displayType: "slider",
        });
        if (!cancelled) setFallbackSlides(banners.filter(isPromotionInActivePeriod));
      } catch {
        // Keep section hidden when unavailable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [audience, propSlides?.length]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  if (!slides.length) return null;

  const active = slides[index] || slides[0];
  const color = active.color || "#0D9F1B";
  const ctaHref = active.ctaLink || "";
  const ctaLabel = active.ctaLabel || "Learn More";
  const mediaUrl = active.mediaUrl;
  const isVideo = isPromotionVideoUrl(mediaUrl);
  const hasMedia = Boolean(mediaUrl);

  function go(delta) {
    setIndex((current) => {
      const next = current + delta;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }

  const ctaClassName =
    "inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110";

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          borderColor: `${color}40`,
          background: `linear-gradient(120deg, ${color}22 0%, #12182C 55%, #0B1020 100%)`,
        }}
      >
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-stretch">
          {hasMedia ? (
            <div className="overflow-hidden rounded-xl border border-white/10 lg:w-[min(42%,320px)] lg:shrink-0">
              {isVideo ? (
                <video src={mediaUrl} className="h-44 w-full object-cover lg:h-full lg:min-h-[140px]" muted playsInline controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="h-44 w-full object-cover lg:h-full lg:min-h-[140px]" />
              )}
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>
              Promotion
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{active.title}</h2>
            {active.description ? (
              <p className="mt-1 max-w-2xl text-sm text-white/60">{active.description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            {slides.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Previous promotion"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Next promotion"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : null}
            {ctaHref ? (
              isExternalLink(ctaHref) ? (
                <a href={ctaHref} target="_blank" rel="noreferrer" className={ctaClassName} style={{ backgroundColor: color }}>
                  {ctaLabel}
                </a>
              ) : (
                <Link href={ctaHref} className={ctaClassName} style={{ backgroundColor: color }}>
                  {ctaLabel}
                </Link>
              )
            ) : null}
          </div>
        </div>

        {slides.length > 1 ? (
          <div className="flex justify-center gap-2 border-t border-white/10 px-4 py-3">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`h-2 rounded-full transition ${
                  slideIndex === index ? "w-6" : "w-2 bg-white/25 hover:bg-white/40"
                }`}
                style={slideIndex === index ? { backgroundColor: color } : undefined}
                aria-label={`Show promotion ${slideIndex + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
