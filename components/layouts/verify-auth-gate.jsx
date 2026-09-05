"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUserMe,
  hasUserSession,
  isUserBanned,
  updateUserSession,
  userNeedsVerification,
} from "@/lib/auth";

/**
 * /verify must always paint for signed-in users. The dashboard session guard
 * can hold a dark "checking" state or bounce to Home; this gate does neither.
 */
export default function VerifyAuthGate({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useLayoutEffect(() => {
    if (!hasUserSession()) {
      router.replace("/login?redirect=/verify");
      return;
    }
    setAllowed(true);

    let cancelled = false;
    fetchUserMe()
      .then(({ user }) => {
        if (cancelled || !user) return;
        updateUserSession(user);
        if (isUserBanned(user)) {
          router.replace("/banned");
          return;
        }
        if (!userNeedsVerification(user)) {
          router.replace("/dashboard");
        }
      })
      .catch((error) => {
        if (cancelled) return;
        const status = Number(error?.status) || 0;
        if (status === 401 || status === 403) {
          router.replace("/login?redirect=/verify");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white text-sm text-theme-black/60">
        Loading verification…
      </div>
    );
  }

  return children;
}
