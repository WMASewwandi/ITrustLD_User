"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * Confirmation / status dialog.
 * Desktop: centered popup. Mobile: bottom sheet.
 * Supports two action buttons (primary + secondary).
 */
export default function BottomMessage({
  children,
  title,
  variant = "success",
  onClose,
  primaryAction,
  secondaryAction,
  className = "",
}) {
  const router = useRouter();

  const titles = {
    success: title || "Success",
    error: title || "Error",
    warning: title || "Please wait",
    info: title || "Notice",
  };

  const titleColor = {
    success: "text-theme-green-action",
    error: "text-theme-red-action",
    warning: "text-theme-green-shaded",
    info: "text-white",
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function runAction(action) {
    if (!action) return;
    if (action.href) {
      if (/^https?:\/\//i.test(action.href)) {
        window.location.href = action.href;
      } else {
        router.push(action.href);
      }
    }
    if (action.onClick) action.onClick();
    if (action.closeOnClick !== false && onClose) onClose();
  }

  const primary = primaryAction || { label: "OK", onClick: onClose };
  const secondary = secondaryAction || { label: "Close", onClick: onClose };

  return (
    <div className={`fixed inset-0 z-[90] ${className}`} role="dialog" aria-modal="true" aria-label={titles[variant]}>
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border border-white/10 bg-[#0B1020] shadow-[0_-16px_50px_rgba(0,0,0,0.5)] lg:inset-0 lg:m-auto lg:h-fit lg:max-h-[80vh] lg:w-full lg:max-w-md lg:rounded-2xl lg:shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/25 lg:hidden" aria-hidden />

        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h3 className={`text-lg font-bold ${titleColor[variant] || "text-white"}`}>
            {titles[variant]}
          </h3>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-white/50 transition hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-4 text-sm leading-relaxed text-white/80">
          {children}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/10 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:flex-row sm:justify-end lg:pb-4">
          <button
            type="button"
            onClick={() => runAction(secondary)}
            className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            {secondary.label}
          </button>
          <button
            type="button"
            onClick={() => runAction(primary)}
            className="rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {primary.label}
          </button>
        </div>
      </div>
    </div>
  );
}
