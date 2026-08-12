"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchActivePromotionalBanners } from "@/lib/promotional-banners";
import { getUserSession } from "@/lib/auth";
import {
  consolidateSliderBanners,
  getBannerSlideUrls,
  isPromotionInActivePeriod,
  isPromotionVideoUrl,
} from "@/lib/promotion-utils";

function isExternalLink(href) {
  return /^https?:\/\//i.test(String(href || ""));
}

function resolveAudience(user) {
  if (user?.user_type === "partner" || user?.is_affiliate) return "affiliate";
  return "normal";
}

/**
 * One promotion card. Multiple images rotate inside this card (image slider only).
 */
export default function PromotionalSlider({ banner: propBanner, slides, audience }) {
  const [fallbackBanner, setFallbackBanner] = useState(null);

  useEffect(() => {
    if (propBanner || (Array.isArray(slides) && slides.length)) return undefined;

    let cancelled = false;
    const resolvedAudience = audience || resolveAudience(getUserSession());

    async function load() {
      try {
        const banners = await fetchActivePromotionalBanners({
          audience: resolvedAudience,
          displayType: "slider",
        });
        const consolidated = consolidateSliderBanners(
          banners.filter(isPromotionInActivePeriod),
        );
        if (!cancelled) setFallbackBanner(consolidated[0] || null);
      } catch {
        // Keep section hidden when unavailable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [audience, propBanner, slides]);

  const banner = useMemo(() => {
    if (propBanner && isPromotionInActivePeriod(propBanner)) return propBanner;
    if (Array.isArray(slides) && slides.length) {
      const [consolidated] = consolidateSliderBanners(slides.filter(isPromotionInActivePeriod));
      return consolidated || null;
    }
    return fallbackBanner;
  }, [propBanner, slides, fallbackBanner]);

  const mediaUrls = useMemo(() => (banner ? getBannerSlideUrls(banner) : []), [banner]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= mediaUrls.length) setIndex(0);
  }, [index, mediaUrls.length]);

  if (!banner || !isPromotionInActivePeriod(banner)) return null;

  const color = banner.color || "#0D9F1B";
  const ctaHref = banner.ctaLink || "";
  const ctaLabel = banner.ctaLabel || "Learn More";
  const mediaUrl = mediaUrls[index] || mediaUrls[0] || null;
  const isVideo = isPromotionVideoUrl(mediaUrl);
  const hasMedia = Boolean(mediaUrl);
  const hasMultiple = mediaUrls.length > 1;

  function go(delta) {
    setIndex((current) => {
      const next = current + delta;
      if (next < 0) return mediaUrls.length - 1;
      if (next >= mediaUrls.length) return 0;
      return next;
    });
  }

  const ctaClassName =
    "inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110";

  return (
    <section
      id={banner?.id != null ? `promotion-${banner.id}` : undefined}
      className="mx-auto w-full max-w-[1400px] scroll-mt-[var(--promo-scroll-offset,7rem)] px-4 py-4 sm:px-6 lg:px-8"
    >
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          borderColor: `${color}40`,
          background: `linear-gradient(120deg, ${color}22 0%, #12182C 55%, #0B1020 100%)`,
        }}
      >
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-stretch">
          {hasMedia ? (
            <div className="relative overflow-hidden rounded-xl border border-white/10 lg:w-[min(42%,320px)] lg:shrink-0">
              {isVideo ? (
                <video
                  key={mediaUrl}
                  src={mediaUrl}
                  className="h-44 w-full object-cover transition-opacity duration-700 lg:h-full lg:min-h-[140px]"
                  muted
                  playsInline
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={mediaUrl}
                  src={mediaUrl}
                  alt=""
                  className="h-44 w-full object-cover transition-opacity duration-700 lg:h-full lg:min-h-[140px]"
                />
              )}
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>
              Promotion
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{banner.title}</h2>
            {banner.description ? (
              <p className="mt-1 max-w-2xl text-sm text-white/60">{banner.description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Next image"
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

        {hasMultiple ? (
          <div className="flex justify-center gap-2 border-t border-white/10 px-4 py-3">
            {mediaUrls.map((url, slideIndex) => (
              <button
                key={`${banner.id}-${url}-${slideIndex}`}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`h-2 rounded-full transition ${
                  slideIndex === index ? "w-6" : "w-2 bg-white/25 hover:bg-white/40"
                }`}
                style={slideIndex === index ? { backgroundColor: color } : undefined}
                aria-label={`Show image ${slideIndex + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
