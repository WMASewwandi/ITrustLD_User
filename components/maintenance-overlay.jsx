"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { BrandLogoImage } from "@/components/brand-logo";

export default function MaintenanceOverlay({ message }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0b1220]/95 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      aria-describedby="maintenance-message"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-8 text-center shadow-2xl">
        <BrandLogoImage variant="wide" className="mx-auto h-10 w-auto object-contain" />
        <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15">
          <AlertTriangle className="h-7 w-7 text-amber-400" aria-hidden="true" />
        </div>
        <h2 id="maintenance-title" className="mt-5 text-xl font-bold text-white">
          Under Maintenance
        </h2>
        <p id="maintenance-message" className="mt-3 text-sm leading-relaxed text-slate-300">
          {message}
        </p>
        <p className="mt-5 text-xs text-slate-500">
          The website is temporarily unavailable. Please try again later.
        </p>
      </div>
    </div>
  );
}
