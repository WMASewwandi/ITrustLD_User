"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { getUserSession, getUserToken } from "@/lib/auth";
import { fetchActivePromotionalBanners } from "@/lib/promotional-banners";
import { resolvePromotionAudience } from "@/lib/latest-updates";
import { DASHBOARD_UPDATED_EVENT } from "@/lib/dashboard";
import {
  consolidateSliderBanners,
  consumePromotionScrollTarget,
  getPromotionHashTarget,
  isPromotionInActivePeriod,
  PROMO_SECTION_ID,
  rememberPromotionScroll,
  waitAndScrollToPromotion,
} from "@/lib/promotion-utils";

const SLIDE_MS = 4000;

function contentKey(item) {
  return `${String(item?.title || "")
    .trim()
    .toLowerCase()}|${String(item?.description || "")
    .trim()
    .toLowerCase()}`;
}

function dedupeBanners(candidates) {
  const seen = new Set();
  const list = [];
  for (const item of candidates || []) {
    if (!item?.title || !isPromotionInActivePeriod(item)) continue;
    const key = contentKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({ ...item, id: item.id ?? key });
  }
  return list;
}

/** Same promotions the dashboard section renders: static card + each slider card. */
function bannersFromDashboard(dash) {
  const staticBanner = dash?.promo_banner;
  const sliders = consolidateSliderBanners(
    dash?.promotional_slider_banners ?? dash?.promotional_sliders ?? [],
  );
  const extras = consolidateSliderBanners(dash?.promotional_banners || []);

  return dedupeBanners([staticBanner, ...sliders, ...extras].filter(Boolean));
}

function bannerMessage(banner) {
  if (!banner) return "";
  return banner.description?.trim()
    ? `${banner.title} — ${banner.description.trim()}`
    : banner.title;
}

/**
 * Fixed promo alert at the top of the viewport (same position on guest and dashboard).
 * Nav sits below via --guest-promo-alert-height.
 * When 2+ promotions exist, the message auto-rotates like a slider.
 * Close only hides until refresh; active period controls whether it loads again.
 */
export default function PromoTopAlert() {
  const router = useRouter();
  const pathname = usePathname();
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef(null);
  const bannersRef = useRef(banners);
  const pendingScrollRef = useRef("");
  bannersRef.current = banners;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;

    function applyList(list) {
      if (cancelled) return;
      setBanners(list);
      setIndex(0);
    }

    async function load() {
      try {
        const audience = resolvePromotionAudience(getUserSession());
        const allBanners = await fetchActivePromotionalBanners({
          audience,
          displayType: "all",
        });
        applyList(dedupeBanners(allBanners || []));
      } catch {
        if (!cancelled) applyList([]);
      }
    }

    function onDashboardUpdated(event) {
      const dash = event?.detail;
      if (!dash) return;
      applyList(bannersFromDashboard(dash));
    }

    load();
    window.addEventListener(DASHBOARD_UPDATED_EVENT, onDashboardUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener(DASHBOARD_UPDATED_EVENT, onDashboardUpdated);
    };
  }, []);

  const active = banners[index] || null;
  const multi = banners.length > 1;

  useEffect(() => {
    if (!multi) return undefined;
    const timer = window.setInterval(() => {
      const total = bannersRef.current.length;
      if (total < 2) return;
      setIndex((current) => (current + 1) % total);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [multi, banners.length]);

  useEffect(() => {
    if (!active || !barRef.current) {
      setBarHeight(0);
      return undefined;
    }

    const el = barRef.current;
    const update = () => setBarHeight(el.offsetHeight || 0);
    update();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [active, mounted, index]);

  const isDashboard = pathname?.startsWith("/dashboard");
  const loggedIn = Boolean(getUserToken() || getUserSession());
  const homePath = pathname === "/" ? "/" : isDashboard || loggedIn ? "/dashboard" : "/";
  const offsetFallback = homePath === "/dashboard" ? 120 : 140;

  // Push nav below this bar (guest + dashboard) so the strip stays at the top.
  // Also expose total sticky offset for View / hash scroll targets.
  useEffect(() => {
    const guestNav = typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 80 : 64;
    const dashNav = typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 64 : 56;
    const alertH = active ? barHeight || 0 : 0;
    const navH = isDashboard ? dashNav : guestNav;

    document.documentElement.style.setProperty("--guest-promo-alert-height", `${alertH}px`);
    document.documentElement.style.setProperty(
      "--promo-scroll-offset",
      `${alertH + navH + 12}px`,
    );
    return () => {
      document.documentElement.style.setProperty("--guest-promo-alert-height", "0px");
      document.documentElement.style.setProperty("--promo-scroll-offset", "0px");
    };
  }, [active, barHeight, isDashboard]);

  function dismissCurrent() {
    if (!active) return;
    const id = String(active.id);
    const key = contentKey(active);
    setBanners((prev) => {
      const next = prev.filter(
        (item) => String(item.id) !== id && contentKey(item) !== key,
      );
      setIndex(0);
      return next;
    });
  }

  useEffect(() => {
    if (pathname !== homePath) return undefined;
    const targetId =
      pendingScrollRef.current || consumePromotionScrollTarget() || getPromotionHashTarget();
    if (!targetId) return undefined;
    pendingScrollRef.current = "";
    return waitAndScrollToPromotion(targetId, offsetFallback);
  }, [pathname, homePath, offsetFallback]);

  function goToPromotions() {
    const targetId = active?.id != null ? `promotion-${active.id}` : PROMO_SECTION_ID;
    rememberPromotionScroll(targetId);

    if (pathname === homePath) {
      waitAndScrollToPromotion(targetId, offsetFallback);
      return;
    }

    pendingScrollRef.current = targetId;
    router.push(`${homePath}#${targetId}`);
  }

  const color = active?.color || "#0D9F1B";
  const message = bannerMessage(active);

  const bar = active ? (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[55]"
      role="status"
      aria-live="polite"
      style={{ backgroundColor: color }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-2.5 px-3 py-1.5 sm:gap-3 sm:px-5 lg:px-6">
        <p
          key={String(active.id)}
          className="min-w-0 flex-1 truncate text-xs font-medium text-white sm:text-sm"
        >
          {message}
        </p>
        <button
          type="button"
          onClick={goToPromotions}
          className="inline-flex shrink-0 items-center justify-center rounded px-2.5 py-1 text-xs font-semibold text-white transition hover:brightness-110"
          style={{ backgroundColor: "rgba(0,0,0,0.28)" }}
        >
          View
        </button>
        <button
          type="button"
          onClick={dismissCurrent}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/90 transition hover:bg-black/20"
          aria-label="Dismiss promotion"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {mounted && bar ? createPortal(bar, document.body) : null}
      {active ? (
        <div aria-hidden style={{ height: barHeight || 34 }} className="w-full shrink-0" />
      ) : null}
    </>
  );
}
