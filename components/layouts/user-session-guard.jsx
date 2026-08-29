"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserIdleTimeout from "@/components/layouts/user-idle-timeout";
import {
  fetchUserMe,
  getUserSession,
  hasUserSession,
  isUserBanned,
  updateUserSession,
  userNeedsVerification,
} from "@/lib/auth";

function redirectForSession(user, pathname, router) {
  if (!user) return false;
  if (isUserBanned(user)) {
    router.replace("/banned");
    return true;
  }
  if (userNeedsVerification(user) && !pathname.startsWith("/verify")) {
    router.replace("/verify");
    return true;
  }
  if (!userNeedsVerification(user) && pathname.startsWith("/verify")) {
    router.replace("/dashboard");
    return true;
  }
  return false;
}

export default function UserSessionGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(() => pathname.includes("/print") && hasUserSession());

  useLayoutEffect(() => {
    if (pathname.includes("/print")) {
      if (hasUserSession()) setReady(true);
      return;
    }
    if (hasUserSession() && getUserSession()) setReady(true);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      if (!hasUserSession()) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (pathname.includes("/print")) {
        setReady(true);
        return;
      }

      const cached = getUserSession();
      if (cached) {
        if (redirectForSession(cached, pathname, router)) return;
        setReady(true);
      }

      try {
        const { user } = await fetchUserMe();
        if (cancelled) return;
        updateUserSession(user);
        if (redirectForSession(user, window.location.pathname, router)) return;
        setReady(true);
      } catch (error) {
        if (cancelled) return;
        const status = Number(error?.status) || 0;
        if (status === 401 || status === 403 || !getUserSession()) {
          router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        setReady(true);
      }
    }

    verifySession();
    return () => {
      cancelled = true;
    };
    // Verify once per mount — do not block every client navigation on /me.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (pathname.includes("/print")) return;
    if (!hasUserSession()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const cached = getUserSession();
    if (cached) redirectForSession(cached, pathname, router);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-white/50">
        Checking your session…
      </div>
    );
  }

  return (
    <>
      <UserIdleTimeout />
      {children}
    </>
  );
}
