"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserIdleTimeout from "@/components/layouts/user-idle-timeout";
import {
  fetchUserMe,
  getUserSession,
  hasUserSession,
  isUnverifiedAllowedPath,
  isUserBanned,
  updateUserSession,
  userNeedsVerification,
} from "@/lib/auth";
import { hardRedirect, syncKycCookie } from "@/lib/kyc-access";

function isPrintPath(pathname) {
  return String(pathname || "").includes("/print");
}

function loginRedirect(pathname) {
  return `/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`;
}

function redirectForSession(user, pathname, { fromLiveSession = false } = {}) {
  if (!user) return false;
  syncKycCookie(user);
  if (isUserBanned(user)) {
    if (!pathname.startsWith("/banned")) {
      hardRedirect("/banned");
      return true;
    }
    return false;
  }
  if (userNeedsVerification(user) && !isUnverifiedAllowedPath(pathname)) {
    hardRedirect("/verify");
    return true;
  }
  if (fromLiveSession && !userNeedsVerification(user) && pathname.startsWith("/verify")) {
    hardRedirect("/dashboard");
    return true;
  }
  return false;
}

function canPaintCachedSession(user, pathname) {
  if (!user) return false;
  if (isUserBanned(user)) return pathname.startsWith("/banned");
  if (isPrintPath(pathname)) return !userNeedsVerification(user);
  if (pathname.startsWith("/verify")) return true;
  if (userNeedsVerification(user)) return isUnverifiedAllowedPath(pathname);
  return true;
}

export default function UserSessionGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!hasUserSession()) {
      hardRedirect(loginRedirect(pathname));
      return;
    }
    const cached = getUserSession();
    if (cached && redirectForSession(cached, pathname)) return;
    if (canPaintCachedSession(cached, pathname)) {
      setReady(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      if (!hasUserSession()) {
        hardRedirect(loginRedirect(pathname));
        return;
      }

      const cached = getUserSession();

      if (isPrintPath(pathname)) {
        if (cached && redirectForSession(cached, pathname)) return;
        setReady(true);
        return;
      }

      if (cached && redirectForSession(cached, pathname)) {
        return;
      }
      if (canPaintCachedSession(cached, pathname)) {
        setReady(true);
      }

      try {
        const { user } = await fetchUserMe();
        if (user) updateUserSession(user);
        if (cancelled) return;
        const currentPath = window.location.pathname;
        if (redirectForSession(user, currentPath, { fromLiveSession: true })) return;
        setReady(true);
      } catch (error) {
        if (cancelled) return;
        const status = Number(error?.status) || 0;
        const fallback = getUserSession();
        if (status === 401 || status === 403 || !fallback) {
          hardRedirect(loginRedirect(window.location.pathname));
          return;
        }
        if (redirectForSession(fallback, window.location.pathname)) return;
        if (canPaintCachedSession(fallback, window.location.pathname)) {
          setReady(true);
        }
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
    if (!hasUserSession()) {
      hardRedirect(loginRedirect(pathname));
      return;
    }
    const cached = getUserSession();
    if (cached) redirectForSession(cached, pathname);
  }, [pathname, router]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <UserIdleTimeout />
      {children}
    </>
  );
}
