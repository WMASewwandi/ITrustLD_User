"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { Megaphone } from "lucide-react";
import { isPromotionVideoUrl } from "@/lib/promotion-utils";

function ParallaxImage({ src, speed = 0.2, featured = false }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useLenis(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.style.transform = "translate3d(0, 0, 0) scale(1.12)";
      return;
    }

    const rect = container.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    const progress = (viewH / 2 - (rect.top + rect.height / 2)) / viewH;
    const offset = progress * speed * 120;
    image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.18)`;
  });

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[170px] flex-1 overflow-hidden ${featured ? "min-h-[280px] sm:min-h-[340px]" : ""}`}
    >
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="absolute left-0 top-[-12%] h-[124%] w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}

function ColorPromotionHeader({ item, featured = false, variant = "card" }) {
  const color = item.color || "#0D9F1B";
  const isModal = variant === "modal";

  return (
    <div
      className={
        isModal
          ? "relative flex aspect-[16/10] items-center justify-center overflow-hidden p-8"
          : `relative min-h-[170px] flex-1 overflow-hidden ${featured ? "min-h-[280px] sm:min-h-[340px]" : ""}`
      }
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 42%, ${color}99 100%)`,
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/10" />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
          <Megaphone className="h-6 w-6" />
        </span>
        <p className={`font-bold text-white ${isModal || featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
          {item.title}
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}

export function UpdateCardMedia({ item, featured = false, speed = 0.2 }) {
  const color = item.color || "#0D9F1B";
  const mediaUrl = item.mediaUrl || (item.kind === "promotion" ? null : item.image);
  const isVideo = isPromotionVideoUrl(mediaUrl);
  const featuredClass = featured ? "min-h-[280px] sm:min-h-[340px]" : "";
  const baseClass = `relative min-h-[170px] flex-1 overflow-hidden ${featuredClass}`;

  if (item.kind === "promotion" && !mediaUrl) {
    return <ColorPromotionHeader item={item} featured={featured} variant="card" />;
  }

  if (mediaUrl && isVideo) {
    return (
      <div className={baseClass}>
        <video src={mediaUrl} className="h-full w-full object-cover" muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
    );
  }

  if (mediaUrl) {
    return <ParallaxImage src={mediaUrl} speed={speed} featured={featured} />;
  }

  return (
    <div className={`${baseClass} bg-[#EEF2F7]`}>
      <div className="flex h-full min-h-[inherit] items-center justify-center p-6">
        <span className="text-sm font-medium text-theme-gray">No image</span>
      </div>
    </div>
  );
}

export function UpdateModalMedia({ item }) {
  const mediaUrl = item.mediaUrl || (item.kind === "promotion" ? null : item.image);
  const isVideo = isPromotionVideoUrl(mediaUrl);

  if (item.kind === "promotion" && !mediaUrl) {
    return <ColorPromotionHeader item={item} variant="modal" />;
  }

  if (mediaUrl && isVideo) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF2F7]">
        <video src={mediaUrl} className="h-full w-full object-cover" controls playsInline />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF2F7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#EEF2F7]"
      style={{ backgroundColor: `${item.color || "#0D9F1B"}22` }}
    >
      <span className="text-sm font-medium text-theme-gray">No image</span>
    </div>
  );
}
