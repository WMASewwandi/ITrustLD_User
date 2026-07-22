"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function BrandLogo({ className = "h-10" }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className={`${className} w-auto`} />
    </Link>
  );
}

function AuthButtonGroup({ className = "", onNavigate, pathname = "" }) {
  const loginActive = pathname === "/login";
  const registerActive = pathname === "/register";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} role="group" aria-label="Account">
      <Link
        href="/login"
        onClick={onNavigate}
        className={`inline-flex min-w-[5.5rem] items-center justify-center rounded-[4px] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-green-action ${
          loginActive || (!loginActive && !registerActive)
            ? "bg-theme-green-action hover:brightness-110"
            : "border border-white/30 bg-transparent hover:bg-white/10"
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className={`inline-flex min-w-[5.5rem] items-center justify-center rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 ${
          registerActive ? "bg-white/30 hover:bg-white/40" : "bg-white/20 hover:bg-white/30"
        }`}
      >
        Register
      </Link>
    </div>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/support", label: "Help" }
];

export default function NavigationGuest() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    const updateHeaderState = () => {
      if (!isHome) {
        setPastHero(true);
        return;
      }

      const hero = document.getElementById("home-hero");
      if (!hero) {
        setPastHero(window.scrollY > 8);
        return;
      }

      const headerOffset = window.matchMedia("(min-width: 640px)").matches ? 80 : 64;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setPastHero(heroBottom <= headerOffset);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);
    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const solidHeader = !isHome || pastHero || isOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isOpen
            ? "border-b border-white/10"
            : solidHeader
              ? "border-b border-white/10 shadow-[0_12px_40px_rgba(8,12,30,0.45)]"
              : "border-b border-transparent bg-transparent shadow-none"
        }`}
        style={isOpen || solidHeader ? { backgroundColor: "#060C1F" } : undefined}
      >
        <div className="container-shell flex h-16 items-center justify-between sm:h-20">
          <BrandLogo className="h-12 sm:h-11" />

          <div className="hidden items-center gap-8 sm:flex">
            <nav className="flex items-center gap-8" aria-label="Primary">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative pb-1.5 text-sm font-medium uppercase tracking-wide transition ${
                      isActive ? "text-theme-green-action" : "text-white hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-theme-green-action transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <AuthButtonGroup pathname={pathname} />
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition hover:border-white/35 hover:bg-white/10 sm:hidden"
          >
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ${
                isOpen ? "scale-x-0 opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </header>

      {!isHome && <div className="h-16 sm:h-20" aria-hidden="true" />}

      <div
        className={`fixed inset-0 z-30 sm:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
          style={{ backgroundColor: "#060C1F" }}
        >
          <div className="container-shell flex h-full flex-col gap-6 overflow-y-auto pb-8 pt-20">
            <nav className="flex flex-col gap-1 border-b border-white/10 pb-5" aria-label="Mobile">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-1 py-3 text-lg font-medium uppercase tracking-wide transition ${
                      isActive ? "text-theme-green-action" : "text-white hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-theme-green-action transition ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <AuthButtonGroup
              className="w-full [&>a]:flex-1 [&>a]:py-2.5"
              onNavigate={() => setIsOpen(false)}
              pathname={pathname}
            />

            <div
              className="mt-auto rounded-2xl border border-white/10 p-5 text-white"
              style={{ backgroundColor: "#060C1F" }}
            >
              <p className="text-base font-semibold">News and Promos</p>
              <p className="mt-1 text-sm text-white/70">Learn about our exciting promos and latest news.</p>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/30"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
