"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogoImage } from "@/components/brand-logo";
import { fetchMaintenanceMode } from "@/lib/maintenance-mode";

function pad(value) {
  return String(value).padStart(2, "0");
}

function remainingParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function parseReleaseMs(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  const iso = /[zZ]|[+-]\d{2}:\d{2}$/.test(raw)
    ? raw
    : raw.includes("T")
      ? raw
      : raw.replace(" ", "T");
  const parsed = Date.parse(iso);
  if (!Number.isNaN(parsed)) return parsed;
  const withOffset = Date.parse(`${iso}+05:30`);
  return Number.isNaN(withOffset) ? 0 : withOffset;
}

function cssUrl(url) {
  return `url(${JSON.stringify(String(url || ""))})`;
}

function Unit({ label, value }) {
  return (
    <div className="min-w-[4.5rem] rounded-2xl border border-white/12 bg-black/35 px-3 py-4 backdrop-blur-sm sm:min-w-[5.5rem] sm:px-4">
      <p className="font-mono text-3xl font-semibold tabular-nums text-white sm:text-4xl">{pad(value)}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{label}</p>
    </div>
  );
}

export default function LaunchCountdownOverlay({
  releasesAt,
  serverNow,
  eyebrow,
  title,
  message,
  footer,
  backgroundUrl,
}) {
  const endedRef = useRef(false);

  const offsetMs = useMemo(() => {
    const server = Date.parse(serverNow || "");
    if (Number.isNaN(server)) return 0;
    return server - Date.now();
  }, [serverNow]);

  const targetMs = useMemo(() => parseReleaseMs(releasesAt), [releasesAt]);

  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, targetMs - (Date.now() + offsetMs)));

  useEffect(() => {
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    endedRef.current = false;

    function tick() {
      const next = Math.max(0, targetMs - (Date.now() + offsetMs));
      setRemainingMs(next);
      if (next <= 0 && !endedRef.current) {
        endedRef.current = true;
        fetchMaintenanceMode();
      }
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [offsetMs, targetMs]);

  const parts = remainingParts(remainingMs);

  return (
    <div
      className="fixed inset-0 z-[99999] h-[100dvh] max-h-[100dvh] w-screen overflow-hidden bg-black"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="launch-countdown-title"
      aria-describedby="launch-countdown-message"
    >
      {backgroundUrl ? (
        <>
          <div
            className="absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: cssUrl(backgroundUrl) }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/75" aria-hidden="true" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-theme-green-action/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-theme-green-shaded/20 blur-3xl" />
        </>
      )}

      {!backgroundUrl ? <div className="absolute inset-0 bg-[#060C1F]" aria-hidden="true" /> : null}

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-4">
        <div className="relative w-full max-w-xl text-center">
          <BrandLogoImage variant="wide" className="mx-auto h-10 w-auto object-contain sm:h-12" />
          {eyebrow ? (
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-theme-green-action">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 id="launch-countdown-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {message ? (
            <p id="launch-countdown-message" className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
              {message}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Unit label="Days" value={parts.days} />
            <Unit label="Hours" value={parts.hours} />
            <Unit label="Minutes" value={parts.minutes} />
            <Unit label="Seconds" value={parts.seconds} />
          </div>

          {footer ? <p className="mt-8 text-xs text-white/55">{footer}</p> : null}
        </div>
      </div>
    </div>
  );
}
