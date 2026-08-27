"use client";

import { useEffect, useState } from "react";
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

export default function UserSessionGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(() => pathname.includes("/print") && hasUserSession());

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!hasUserSession()) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Print preview must not wait on /me — that path only needs a local token.
      if (pathname.includes("/print")) {
        setReady(true);
        return;
      }

      try {
        const { user } = await fetchUserMe();
        if (cancelled) return;

        updateUserSession(user);

        if (isUserBanned(user)) {
          router.replace("/banned");
          return;
        }

        if (userNeedsVerification(user) && !pathname.startsWith("/verify")) {
          router.replace("/verify");
          return;
        }

        if (!userNeedsVerification(user) && pathname.startsWith("/verify")) {
          router.replace("/dashboard");
          return;
        }

        setReady(true);
      } catch {
        if (cancelled) return;
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  useEffect(() => {
    const cached = getUserSession();
    if (cached?.name) {
      // Warm cache for nav while /me loads.
    }
  }, []);

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
