"use client";

import { useEffect, useMemo, useState } from "react";
import { parseDbDateTime } from "@/lib/sl-time";
import { Clock3 } from "lucide-react";

export const VOUCHER_VALIDITY_DAYS = 30;

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function getVoucherExpiresAt(expiresAt, createdAt) {
  const fromExpires = parseDbDateTime(expiresAt);
  if (fromExpires) return fromExpires;

  const created = parseDbDateTime(createdAt);
  if (!created) return null;
  return new Date(created.getTime() + VOUCHER_VALIDITY_DAYS * 24 * 60 * 60 * 1000);
}

export function getCountdownParts(expiresAt) {
  if (!expiresAt) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const totalMs = expiresAt.getTime() - Date.now();
  if (totalMs <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { expired: false, days, hours, minutes, seconds, totalMs };
}

function formatCompact(parts) {
  if (parts.expired) return "Expired";
  // Always include seconds so the UI visibly ticks every second.
  if (parts.days > 0) {
    return `${parts.days}d ${pad2(parts.hours)}h ${pad2(parts.minutes)}m ${pad2(parts.seconds)}s`;
  }
  if (parts.hours > 0) {
    return `${parts.hours}h ${pad2(parts.minutes)}m ${pad2(parts.seconds)}s`;
  }
  return `${parts.minutes}m ${pad2(parts.seconds)}s`;
}

/**
 * Live countdown for client bonus vouchers (30-day validity from issue).
 * Shown for Pending vouchers; Claimed/Rejected show a static label.
 */
export default function VoucherCountdown({
  expiresAt,
  createdAt,
  status,
  compact = false,
  className = "",
  footerLabel = "to claim",
}) {
  const expiresMs = useMemo(() => {
    const expires = getVoucherExpiresAt(expiresAt, createdAt);
    return expires ? expires.getTime() : null;
  }, [expiresAt, createdAt]);

  const expires = useMemo(
    () => (expiresMs == null ? null : new Date(expiresMs)),
    [expiresMs],
  );

  const [nowMs, setNowMs] = useState(() => Date.now());
  const normalized = String(status || "Pending");
  const isPending = normalized === "Pending";

  useEffect(() => {
    if (!isPending || expiresMs == null) return undefined;

    setNowMs(Date.now());
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, [expiresMs, isPending]);

  const parts = useMemo(() => {
    if (expiresMs == null) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    const totalMs = expiresMs - nowMs;
    if (totalMs <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    const totalSec = Math.floor(totalMs / 1000);
    return {
      expired: false,
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
      totalMs,
    };
  }, [expiresMs, nowMs]);

  if (normalized === "Claimed") {
    return <span className={`text-xs text-white/40 ${className}`}>—</span>;
  }

  if (!expires) {
    return <span className={`text-xs text-white/40 ${className}`}>—</span>;
  }

  if (!isPending || parts.expired) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold text-theme-red-action ${className}`}
      >
        <Clock3 className="h-3.5 w-3.5" />
        Expired
      </span>
    );
  }

  const urgent = parts.days < 3;
  const tone = urgent ? "text-theme-orange" : "text-theme-green-action";

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${tone} ${className}`}>
        <Clock3 className="h-3.5 w-3.5 shrink-0" />
        {formatCompact(parts)}
      </span>
    );
  }

  return (
    <div className={`inline-flex flex-col gap-0.5 ${className}`}>
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums ${tone}`}>
        <Clock3 className="h-3.5 w-3.5 shrink-0" />
        {parts.days > 0 ? (
          <>
            {parts.days}d {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
          </>
        ) : (
          <>
            {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
          </>
        )}
      </span>
      {footerLabel ? <span className="text-[10px] text-white/40">{footerLabel}</span> : null}
    </div>
  );
}
