"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AffiliateLinkCard from "@/components/dashboard/affiliate-link-card";
import LoyaltyLevels from "@/components/dashboard/loyalty-levels";
import { getMembershipTierByPoints } from "@/lib/membership-tiers";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Bell,
  Ellipsis,
  FileCheck2,
  Headphones,
  Home,
  LogOut,
  Receipt,
  Trophy,
  User,
  X,
} from "lucide-react";

const NAV_SOLID = "#060C1F";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/deposit", label: "Top-up", icon: ArrowDownToLine },
  { href: "/dashboard/withdrawal", label: "Cash-out", icon: ArrowUpFromLine },
  { href: "/dashboard/loyalty", label: "Loyalty", icon: Trophy },
  { href: "/dashboard/documents", label: "Documents", icon: FileCheck2 },
];

const MOBILE_BOTTOM_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/deposit", label: "Top-up", icon: ArrowDownToLine },
  { href: "/dashboard/withdrawal", label: "Cash-out", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", label: "History", icon: Receipt },
];

const MOBILE_MORE_LINKS = [
  { href: "/dashboard/loyalty", label: "Loyalty", icon: Trophy },
  { href: "/dashboard/documents", label: "Documents", icon: FileCheck2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/help", label: "Support", icon: Headphones },
];

const LOYALTY_OPTIONS = [
  { href: "/dashboard/loyalty", label: "Loyalty Overview", icon: Trophy },
  { href: "/dashboard/loyalty", label: "Redeem Trust Points", icon: ArrowRight },
  { href: "/dashboard/help", label: "Loyalty Help", icon: Headphones },
];

const DEMO_NOTIFICATIONS = [
  { id: 1, title: "Top-up pending", body: "Your top-up request is being reviewed.", time: "2h ago" },
  { id: 2, title: "Document update", body: "National ID (Back) is In-Progress.", time: "1d ago" },
  { id: 3, title: "Loyalty tip", body: "Earn double Trust Points this week.", time: "2d ago" },
];

const LOYALTY_POINTS_NUM = 128450;
const LOYALTY_POINTS = LOYALTY_POINTS_NUM.toLocaleString();
const LOYALTY_TIER = getMembershipTierByPoints(LOYALTY_POINTS_NUM).name;
const WALLET_ACCOUNT_ID = "67104269";

function NavIconLink({ href, label, icon: Icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative flex h-11 w-11 items-center justify-center rounded-xl transition"
      aria-label={label}
    >
      <Icon
        className={`h-5 w-5 transition ${
          active ? "text-theme-green-action" : "text-white/55 group-hover:text-white"
        }`}
      />
      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0B1020] opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
      {active ? (
        <span className="absolute left-0 h-5 w-0.5 rounded-full bg-theme-green-action" aria-hidden />
      ) : null}
    </Link>
  );
}

function PanelShell({ title, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ui = (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[70]"
        style={{ backgroundColor: NAV_SOLID }}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        data-lenis-prevent
        className="fixed inset-0 z-[80] flex w-full flex-col lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[380px] lg:border-l lg:border-white/10"
        style={{ backgroundColor: NAV_SOLID }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
          {children}
        </div>
      </aside>
    </>
  );

  if (!mounted) return null;
  return createPortal(ui, document.body);
}

export default function NavigationUser() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => setMounted(true), []);
  const [accountId, setAccountId] = useState(WALLET_ACCOUNT_ID);

  const moreActive = MOBILE_MORE_LINKS.some((item) =>
    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserName(parsed.name);
        if (parsed?.accountId) setAccountId(String(parsed.accountId));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setPanel(null);
  }, [pathname]);

  useEffect(() => {
    if (!panel && !moreOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panel, moreOpen]);

  function handleLogout() {
    localStorage.removeItem("itrustld_user");
    router.push("/");
  }

  function isActive(href) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function openPanel(name) {
    setMoreOpen(false);
    setPanel(name);
  }

  return (
    <>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b border-white/10 lg:pl-[60px]"
        style={{ backgroundColor: NAV_SOLID }}
      >
        <div className="flex h-14 w-full items-center justify-between gap-3 px-3 sm:h-16 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/dashboard" className="inline-flex shrink-0 items-center">
              <img
                src="/assets/img/logos/logo-itrustld-wide.png"
                alt="iTrustLD"
                className="h-12 w-auto object-contain sm:h-11"
              />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => openPanel("loyalty")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/5"
              aria-label="Loyalty"
            >
              <Trophy className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => openPanel("notifications")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/5"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => openPanel("profile")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/5"
              aria-label="Account"
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop left sidebar */}
      <aside
        className="fixed bottom-0 left-0 top-0 z-40 hidden w-[60px] flex-col border-r border-white/10 lg:flex"
        style={{ backgroundColor: NAV_SOLID }}
      >
        <div className="flex h-14 items-center justify-center border-b border-white/10 sm:h-16">
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center" aria-label="iTrustLD Home">
            <img src="/assets/img/logos/logo-itrustld.svg" alt="" className="h-7 w-7 object-contain" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col items-center gap-1.5 py-4">
          {NAV_LINKS.map((item) => (
            <NavIconLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1.5 border-t border-white/10 py-4">
          <NavIconLink
            href="/dashboard/help"
            label="Support"
            icon={Headphones}
            active={isActive("/dashboard/help")}
          />
        </div>
      </aside>

      {/* Mobile bottom nav portaled to body so Lenis transforms cannot make it translucent */}
      {mounted
        ? createPortal(
            <>
              <nav
                className="fixed inset-x-0 bottom-0 z-[9998] border-t border-white/15 px-1 pb-[env(safe-area-inset-bottom)] lg:hidden"
                style={{ backgroundColor: NAV_SOLID, opacity: 1 }}
              >
                <div
                  className="mx-auto flex h-[64px] max-w-lg items-stretch justify-between"
                  style={{ backgroundColor: NAV_SOLID }}
                >
                  {MOBILE_BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition ${
                          active ? "text-theme-green-action" : "text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                        <span className="truncate">{label}</span>
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setPanel(null);
                      setMoreOpen(true);
                    }}
                    className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition ${
                      moreOpen || moreActive ? "text-theme-green-action" : "text-white"
                    }`}
                  >
                    <Ellipsis
                      className="h-5 w-5"
                      strokeWidth={moreOpen || moreActive ? 2.25 : 1.75}
                    />
                    <span className="truncate">More</span>
                  </button>
                </div>
              </nav>

              {moreOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[9997] lg:hidden"
                    style={{ backgroundColor: NAV_SOLID }}
                    aria-label="Close more menu"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div
                    className="fixed inset-x-0 bottom-[64px] z-[9999] border-t border-white/15 px-4 pb-4 pt-3 lg:hidden"
                    style={{ backgroundColor: NAV_SOLID }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">More</p>
                      <button
                        type="button"
                        onClick={() => setMoreOpen(false)}
                        className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {MOBILE_MORE_LINKS.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMoreOpen(false)}
                            className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                              active
                                ? "border-theme-green-action/40 bg-theme-green-action/10 text-theme-green-action"
                                : "border-white/15 text-white hover:bg-white/5"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}
            </>,
            document.body
          )
        : null}

      {/* Right panels: loyalty / notifications / profile */}
      {panel === "loyalty" ? (
        <PanelShell title="Loyalty" onClose={() => setPanel(null)}>
          <div className="rounded-xl border border-white/15 bg-[#141A2E] px-4 py-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white">Trust Points</p>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-black">
                {LOYALTY_TIER}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">{LOYALTY_POINTS}</p>
            <p className="mt-1 text-sm text-white/45">Account #{accountId}</p>
          </div>

          <div className="mt-5 rounded-xl border border-white/15 bg-[#141A2E] px-3 py-4">
            <LoyaltyLevels
              variant="compact"
              currentTier={LOYALTY_TIER}
              initialTier={LOYALTY_TIER}
              showBenefits
              showPointsHint
            />
          </div>

          <div className="mt-5 rounded-xl border border-white/15 bg-[#141A2E] px-4 py-4">
            <AffiliateLinkCard />
          </div>

          <h3 className="mb-3 mt-7 text-base font-semibold text-white">Loyalty Options</h3>
          <div className="space-y-2.5">
            {LOYALTY_OPTIONS.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setPanel(null)}
                className="flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/5"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/80" />
                {label}
              </Link>
            ))}
          </div>
        </PanelShell>
      ) : null}

      {panel === "notifications" ? (
        <PanelShell title="Notifications" onClose={() => setPanel(null)}>
          <div className="space-y-3">
            {DEMO_NOTIFICATIONS.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/15 bg-[#141A2E] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <span className="shrink-0 text-[11px] text-white/40">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </PanelShell>
      ) : null}

      {panel === "profile" ? (
        <PanelShell title="Profile" onClose={() => setPanel(null)}>
          <div className="rounded-xl border border-white/15 bg-[#141A2E] px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-theme-green-action/20 text-theme-green-action">
                <User className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-sm text-white/45">#{accountId}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setPanel(null)}
              className="flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
            <Link
              href="/dashboard/documents"
              onClick={() => setPanel(null)}
              className="flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <FileCheck2 className="h-4 w-4" />
              Documents
            </Link>
            <Link
              href="/dashboard/loyalty"
              onClick={() => setPanel(null)}
              className="flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <Trophy className="h-4 w-4" />
              Loyalty
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 text-sm font-medium text-theme-red-action transition hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </PanelShell>
      ) : null}
    </>
  );
}
