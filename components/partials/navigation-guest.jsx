"use client";

import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "@/components/ui/primary-button";

function BrandLogo() {
  return (
    <Link href="/" className="inline-flex items-center text-white">
      <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
    </Link>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/help", label: "Help" }
];

export default function NavigationGuest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="hidden h-20 bg-theme-blue-dark sm:block">
        <div className="container-shell flex h-full items-center justify-between">
          <BrandLogo />
          <nav className="flex items-center gap-8">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-white transition hover:text-theme-green-action">
                {item.label}
              </Link>
            ))}
            <Link href="/login">
              <PrimaryButton className="px-6 py-2">Login</PrimaryButton>
            </Link>
            <Link href="/register">
              <PrimaryButton className="px-6 py-2">Register</PrimaryButton>
            </Link>
          </nav>
        </div>
      </header>

      <header className="fixed left-0 right-0 top-0 z-40 h-16 bg-theme-blue-dark sm:hidden">
        <div className="container-shell flex h-full items-center justify-between">
          <BrandLogo />
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-md border border-white/30 p-2 text-white"
          >
            <span className="block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-theme-blue-dark sm:hidden">
          <div className="container-shell flex h-full flex-col pb-6 pt-5">
            <div className="flex items-center justify-between">
              <BrandLogo />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-white/30 px-3 py-1 text-sm text-white"
              >
                Close
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-5">
              {[...navLinks, { href: "/login", label: "Login" }, { href: "/register", label: "Register" }].map(
                (item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium text-white"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="mt-auto rounded-xl bg-[#3C3957] p-5 text-white">
              <p className="text-lg font-semibold">News and Promos</p>
              <p className="mt-1 text-sm text-white/80">Learn about our exciting promos and latest news.</p>
              <Link href="/" onClick={() => setIsOpen(false)} className="mt-4 inline-block">
                <PrimaryButton className="px-6 py-2">Explore</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
