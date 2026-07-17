"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  FileCheck2,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Trophy,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  User,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdrawal", label: "Withdrawal", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/loyalty", label: "Loyalty", icon: Trophy },
  { href: "/dashboard/documents", label: "Documents", icon: FileCheck2 },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
];

export default function NavigationUser() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserName(parsed.name);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("itrustld_user");
    router.push("/");
  }

  function isActive(href) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex shrink-0 items-center">
          <img
            src="/assets/img/logos/logo-itrustld-wide.png"
            alt="iTrustLD"
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-2.5 py-1.5 text-sm text-white transition hover:bg-white/12"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-theme-green-action/20 text-theme-green-action">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden max-w-[120px] truncate font-medium sm:inline">{userName}</span>
              <ChevronDown className={`h-4 w-4 text-white/50 transition ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#141A2E] py-1 shadow-2xl">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 transition hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0B1020] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive(href) ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
