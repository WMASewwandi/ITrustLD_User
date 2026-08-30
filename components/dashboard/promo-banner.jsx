import Link from "next/link";
import { Megaphone } from "lucide-react";
import { isPromotionInActivePeriod, isPromotionVideoUrl } from "@/lib/promotion-utils";

function isExternalLink(href) {
  return /^https?:\/\//i.test(String(href || ""));
}

export default function PromoBanner({ banner }) {
  if (!banner?.title || !isPromotionInActivePeriod(banner)) return null;

  const color = banner.color || "#0D9F1B";
  const ctaHref = banner.ctaLink || "/dashboard/loyalty";
  const ctaLabel = banner.ctaLabel || "Learn More";
  const mediaUrl = banner.mediaUrl;
  const isVideo = isPromotionVideoUrl(mediaUrl);
  const hasMedia = Boolean(mediaUrl);

  const ctaClassName =
    "inline-flex shrink-0 items-center justify-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30";

  return (
    <section
      id={banner?.id != null ? `promotion-${banner.id}` : undefined}
      className="mx-auto w-full max-w-[1400px] scroll-mt-[var(--promo-scroll-offset,7rem)] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div
        className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: `${color}40`,
          background: `linear-gradient(90deg, ${color}33 0%, #12182C 45%, #14535b55 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full"
          style={{ backgroundColor: `${color}33` }}
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
          {hasMedia ? (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 lg:order-2 lg:w-[min(42%,320px)] lg:shrink-0">
              {isVideo ? (
                <video src={mediaUrl} className="h-auto w-full object-contain object-top" muted playsInline controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="h-auto w-full object-contain object-top" />
              )}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {!hasMedia ? (
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}33`, color }}
              >
                <Megaphone className="h-5 w-5" />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>
                Promotion
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{banner.title}</h2>
              {banner.description ? (
                <p className="mt-1 max-w-xl text-sm text-white/55">{banner.description}</p>
              ) : null}
            </div>
          </div>
          {ctaHref ? (
            isExternalLink(ctaHref) ? (
              <a href={ctaHref} target="_blank" rel="noreferrer" className={ctaClassName}>
                {ctaLabel}
              </a>
            ) : (
              <Link href={ctaHref} className={ctaClassName}>
                {ctaLabel}
              </Link>
            )
          ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
