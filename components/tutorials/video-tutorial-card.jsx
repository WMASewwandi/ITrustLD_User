"use client";

function PlayIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.5 6.8v10.4L17.2 12L8.5 6.8Z" />
    </svg>
  );
}

export default function VideoTutorialCard({ item, accent = "green", onPlay }) {
  const isGreen = accent === "green";
  const arrowClass = isGreen
    ? "border-theme-green-action/50 text-theme-green-action hover:bg-theme-green-action hover:text-white"
    : "border-[#A855F7]/50 text-[#C084FC] hover:bg-[#A855F7] hover:text-white";
  const dotsClass = isGreen ? "bg-theme-green-action" : "bg-[#A855F7]";
  const showMeta = item.categoryKey === "guides";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12172A]/85 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]">
      <button
        type="button"
        onClick={() => onPlay(item)}
        className="relative aspect-[16/10] overflow-hidden text-left"
        aria-label={`Play ${item.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnailUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/80 via-transparent to-black/20" />

        {item.duration ? (
          <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {item.duration}
          </span>
        ) : null}

        {item.isNew ? (
          <span className="absolute right-3 top-3 rounded-md bg-theme-green-action px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/25">
            <PlayIcon className="ml-0.5 h-5 w-5" />
          </span>
        </div>
      </button>

      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        {showMeta ? (
          <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isGreen ? "text-theme-green-action" : "text-[#C084FC]"}`}>
            Wizarding World
          </p>
        ) : null}

        <h3 className={`font-semibold text-white ${showMeta ? "mt-1.5" : ""}`}>{item.title}</h3>
        {item.subtitle ? <p className="mt-1 text-sm text-white/55">{item.subtitle}</p> : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {showMeta ? (
            <div className="flex items-center gap-1.5">
              <span className={`h-0.5 w-8 rounded-full ${dotsClass}`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-80`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-50`} />
              <span className={`h-1 w-1 rounded-full ${dotsClass} opacity-30`} />
            </div>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => onPlay(item)}
            aria-label={`Open ${item.title}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition duration-300 ${arrowClass}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
