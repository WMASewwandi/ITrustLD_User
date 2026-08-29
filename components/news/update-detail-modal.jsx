"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { UpdateModalMedia } from "@/components/news/promotion-media";

function isExternalLink(href) {
  return /^https?:\/\//i.test(String(href || ""));
}

export default function UpdateDetailModal({ item, onClose }) {
  if (!item) return null;

  const ctaHref = item.ctaLink || "";
  const ctaLabel = item.ctaLabel || "Learn More";
  const color = item.color || "#0D9F1B";

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom,0px)))] w-full max-w-md overflow-y-auto rounded-t-2xl border border-[#E6EBF2] bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <UpdateModalMedia item={item} />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 pb-8 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {item.initial || item.title?.charAt(0)?.toUpperCase() || "i"}
              </span>
              <div>
                <p className="text-sm font-medium text-theme-blue-dark">{item.author || "iTrustLD"}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
                  {item.category}
                </p>
              </div>
            </div>
            {item.time ? <time className="text-xs text-theme-gray">{item.time}</time> : null}
          </div>

          <h3 className="text-xl font-bold text-theme-blue-dark sm:text-2xl">{item.title}</h3>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-theme-gray sm:text-base">
            {item.description || item.excerpt}
          </p>

          {ctaHref ? (
            <div className="mt-6">
              {isExternalLink(ctaHref) ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: color }}
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: color }}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
