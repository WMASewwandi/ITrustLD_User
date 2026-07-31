"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!hasUserSession()) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
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

  return children;
}
