"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Users, Layers } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/partner-tiers", label: "Partner Tiers", icon: Layers },
  { href: "/admin/accounts", label: "Accounts", icon: Users },
];

export default function NavigationAdmin() {
  const pathname = usePathname();

  function isActive(href, exact) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060C1F] backdrop-blur-md lg:pl-[220px]">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Shield className="h-5 w-5 text-theme-green-action" />
            <span className="text-sm font-semibold text-white">Admin</span>
          </div>
          <p className="hidden text-sm text-white/50 lg:block">Master screens · frontend demo</p>
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Open user app
          </Link>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[220px] flex-col border-r border-white/10 bg-theme-blue-dark backdrop-blur-md lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4 sm:h-16">
          <Shield className="h-5 w-5 text-theme-green-action" />
          <div>
            <p className="text-sm font-bold text-white">iTrustLD Admin</p>
            <p className="text-[10px] text-white/40">Partner masters</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-theme-green-action/15 text-theme-green-action"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-theme-blue-dark px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-14 max-w-lg items-stretch justify-between">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                  active ? "text-theme-green-action" : "text-white/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
