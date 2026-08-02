"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasUserSession } from "@/lib/auth";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
  );
}

export default function HeroCtaButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncSession = () => setIsLoggedIn(hasUserSession());
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  if (isLoggedIn) {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
        <Link
          href="/support"
          className="group inline-flex items-center gap-2 rounded-[4px] border border-white/25 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.08]"
        >
          Learn More
          <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 rounded-xl bg-theme-green-action px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Go to Dashboard
          <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
      <Link
        href="/register"
        className="group inline-flex items-center gap-2 rounded-xl bg-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/30"
      >
        Open Account
        <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/support"
        className="group inline-flex items-center gap-2 rounded-[4px] border border-white/25 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.08]"
      >
        Learn More
        <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
