"use client";

import PromotionalSlider from "@/components/dashboard/promotional-slider";
import { consolidateSliderBanners, isPromotionInActivePeriod } from "@/lib/promotion-utils";

/**
 * One promotion card per distinct banner.
 * Multiple images on the same banner can be browsed with arrows/dots.
 * Legacy duplicate rows (one image per old row) are merged into one card.
 */
export default function PromotionalSlidersList({ banners, audience }) {
  const promotions = consolidateSliderBanners(
    (banners || []).filter(isPromotionInActivePeriod),
  );

  if (!promotions.length) return null;

  return (
    <>
      {promotions.map((banner) => (
        <PromotionalSlider key={banner.id} banner={banner} audience={audience} />
      ))}
    </>
  );
}
