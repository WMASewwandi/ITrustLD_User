"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";

const updates = [
  {
    id: "left-top",
    title: "Top Tips to Stay Motivated and Avoid Burnout While Working Remotely",
    category: "Lifestyle",
    time: "9 months ago",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80",
    tone: {
      text: "text-[#0D9F1B]",
      iconBg: "bg-theme-red-action",
      icon: "text-white",
      arrow: "text-[#0D9F1B] group-hover:translate-x-0.5"
    },
    icon: "doc",
    parallax: 0.18
  },
  {
    id: "left-bottom",
    title: "The Future of AI: Trends Shaping the Next Decade",
    category: "Technology",
    time: "8 months ago",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    tone: {
      text: "text-[#7C3AED]",
      iconBg: "bg-theme-red-action",
      icon: "text-white",
      arrow: "text-[#7C3AED] group-hover:translate-x-0.5"
    },
    icon: "chart",
    parallax: 0.28
  },
  {
    id: "center",
    title: "Smartphone Hacks Everyone Needs to Know to Extend Battery Life",
    category: "Cultural",
    time: "9 months ago",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    tone: {
      text: "text-[#0D9F1B]",
      iconBg: "bg-theme-red-action",
      icon: "text-white",
      arrow: "text-[#0D9F1B] group-hover:translate-x-0.5"
    },
    icon: "calendar",
    featured: true,
    parallax: 0.22
  },
  {
    id: "right-top",
    title: "Global Markets Rebound as Inflation Worries Ease for Investors",
    category: "Travel",
    time: "9 months ago",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    tone: {
      text: "text-[#2563EB]",
      iconBg: "bg-theme-red-action",
      icon: "text-white",
      arrow: "text-[#2563EB] group-hover:translate-x-0.5"
    },
    icon: "bars",
    parallax: 0.2
  },
  {
    id: "right-bottom",
    title: "How Time in Nature Boosts Mental Health and Reduces Stress",
    category: "Lifestyle",
    time: "9 months ago",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    tone: {
      text: "text-[#EA580C]",
      iconBg: "bg-theme-red-action",
      icon: "text-white",
      arrow: "text-[#EA580C] group-hover:translate-x-0.5"
    },
    icon: "heart",
    parallax: 0.26
  }
];

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

function UpdateCard({ item }) {
  const featured = Boolean(item.featured);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#E6EBF2] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)] ${
        featured ? "lg:row-span-2" : ""
      }`}
    >
      <ParallaxImage src={item.image} speed={item.parallax} featured={featured} />

      <div className={`relative flex flex-none flex-col px-5 pb-5 ${featured ? "pt-8 sm:px-7 sm:pb-7" : "pt-7"}`}>
        <div
          className={`absolute left-5 top-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl shadow-[0_8px_18px_rgba(15,23,42,0.12)] ${item.tone.iconBg} ${item.tone.icon} ${
            featured ? "left-7" : ""
          }`}
        >
          <CategoryIcon type={item.icon} />
        </div>

        <p className={`mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] ${item.tone.text}`}>
          {item.category}
          <span className="mx-2 text-theme-gray/50">•</span>
          <span className="text-theme-gray">{item.time}</span>
        </p>

        <h3
          className={`mt-3 font-semibold leading-snug text-theme-blue-dark transition-colors duration-300 group-hover:text-theme-blue-darkshade ${
            featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          {item.title}
        </h3>

        <button type="button" className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold transition ${item.tone.arrow}`}>
          Read More
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12H19" />
            <path d="M13 6L19 12L13 18" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function LatestUpdatesSlider() {
  const leftTop = updates.find((item) => item.id === "left-top");
  const leftBottom = updates.find((item) => item.id === "left-bottom");
  const center = updates.find((item) => item.id === "center");
  const rightTop = updates.find((item) => item.id === "right-top");
  const rightBottom = updates.find((item) => item.id === "right-bottom");

  return (
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

        <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-[1fr_1.4fr_1fr] lg:grid-rows-2 xl:gap-8">
          <div className="h-full min-h-[320px] lg:col-start-1 lg:row-start-1 lg:min-h-0">
            <UpdateCard item={leftTop} />
          </div>
          <div className="h-full min-h-[480px] lg:col-start-2 lg:row-span-2 lg:min-h-[720px] xl:min-h-[780px]">
            <UpdateCard item={center} />
          </div>
          <div className="h-full min-h-[320px] lg:col-start-3 lg:row-start-1 lg:min-h-0">
            <UpdateCard item={rightTop} />
          </div>
          <div className="h-full min-h-[320px] lg:col-start-1 lg:row-start-2 lg:min-h-0">
            <UpdateCard item={leftBottom} />
          </div>
          <div className="h-full min-h-[320px] lg:col-start-3 lg:row-start-2 lg:min-h-0">
            <UpdateCard item={rightBottom} />
          </div>
        </div>
      </div>
    </section>
  );
}
