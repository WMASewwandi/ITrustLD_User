"use client";

import { ArrowRight } from "lucide-react";
import { UpdateCardMedia } from "@/components/news/promotion-media";

function CategoryIcon({ type }) {
  const common = "h-4 w-4";

  if (type === "doc") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3.5H14L17.5 7V20.5H7V3.5Z" />
        <path d="M14 3.5V7H17.5" />
        <path d="M9.5 12H14.5" />
        <path d="M9.5 15.5H14.5" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19H20" />
        <path d="M6 16L10 10L13.5 13.5L18 6" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5V7" />
        <path d="M16 3.5V7" />
        <path d="M4 10H20" />
      </svg>
    );
  }

  if (type === "bars") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19V11" />
        <path d="M10 19V7" />
        <path d="M15 19V13" />
        <path d="M20 19V5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20S5 15.5 5 10.5C5 7.5 7.5 5.5 10 5.5C11.1 5.5 12.2 6 12.8 6.8C13.4 6 14.5 5.5 15.6 5.5C18.1 5.5 20.6 7.5 20.6 10.5C20.6 15.5 12 20 12 20Z" />
    </svg>
  );
}

export default function UpdateCard({ item, onOpen, featuredLayout = false }) {
  const featured = featuredLayout || Boolean(item.featured);
  const showTitleInBody = !(item.kind === "promotion" && !item.mediaUrl);

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] border border-[#E6EBF2] bg-white text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)] ${
        featured ? "lg:row-span-2" : ""
      }`}
    >
      <UpdateCardMedia item={item} featured={featured} speed={item.parallax} />

      <div className={`relative flex flex-none flex-col px-5 pb-5 ${featured ? "pt-8 sm:px-7 sm:pb-7" : "pt-7"}`}>
        <div
          className={`absolute left-5 top-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-white shadow-[0_8px_18px_rgba(15,23,42,0.12)] ${
            featured ? "left-7" : ""
          }`}
          style={{ backgroundColor: item.color }}
        >
          <CategoryIcon type={item.icon} />
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: item.color }}>
          {item.category}
          {item.time ? (
            <>
              <span className="mx-2 text-theme-gray/50">•</span>
              <span className="text-theme-gray">{item.time}</span>
            </>
          ) : null}
        </p>

        {showTitleInBody ? (
          <h3
            className={`mt-3 font-semibold leading-snug text-theme-blue-dark transition-colors duration-300 group-hover:text-theme-blue-darkshade ${
              featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {item.title}
          </h3>
        ) : null}

        {item.description ? (
          <p className={`mt-2 text-sm leading-relaxed text-theme-gray ${featured ? "line-clamp-4" : "line-clamp-2"}`}>
            {item.description}
          </p>
        ) : null}

        <span
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition group-hover:translate-x-0.5"
          style={{ color: item.color }}
        >
          {item.ctaLabel || "Read More"}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
