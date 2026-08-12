"use client";

import { useEffect, useState } from "react";
import PromoBanner from "@/components/dashboard/promo-banner";
import PromotionalSlidersList from "@/components/dashboard/promotional-sliders-list";
import { fetchActivePromotionalBanners } from "@/lib/promotional-banners";
import { isPromotionInActivePeriod } from "@/lib/promotion-utils";

/**
 * Public-site promotions — static banner + slider carousel (not mixed into Latest Updates).
 */
export default function GuestPromotionsSection({ audience = "normal" }) {
  const [staticBanner, setStaticBanner] = useState(null);
  const [sliderBanners, setSliderBanners] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [staticItems, sliderItems] = await Promise.all([
          fetchActivePromotionalBanners({ audience, displayType: "static" }),
          fetchActivePromotionalBanners({ audience, displayType: "slider" }),
        ]);
        if (cancelled) return;
        const activeStatic = staticItems.filter(isPromotionInActivePeriod);
        const activeSlider = sliderItems.filter(isPromotionInActivePeriod);
        setStaticBanner(activeStatic[0] || null);
        setSliderBanners(activeSlider);
      } catch {
        if (!cancelled) {
          setStaticBanner(null);
          setSliderBanners([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [audience]);

  if (!staticBanner && sliderBanners.length === 0) return null;

  return (
    <div
      id="promotions"
      className="bg-[#070B16] scroll-mt-[var(--promo-scroll-offset,7rem)]"
    >
      {staticBanner ? <PromoBanner banner={staticBanner} /> : null}
      {sliderBanners.length > 0 ? (
        <PromotionalSlidersList banners={sliderBanners} audience={audience} />
      ) : null}
    </div>
  );
}
