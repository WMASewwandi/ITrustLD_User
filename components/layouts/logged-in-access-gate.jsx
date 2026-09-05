"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getUserSession,
  hasUserSession,
  isUnverifiedAllowedPath,
  isUserBanned,
  userNeedsVerification,
} from "@/lib/auth";
import { hardRedirect, syncKycCookie } from "@/lib/kyc-access";

export default function LoggedInAccessGate({ children }) {
  const pathname = usePathname();
  const holdUntilCheck = pathname.startsWith("/dashboard");
  const [allow, setAllow] = useState(!holdUntilCheck);

  useLayoutEffect(() => {
    if (!hasUserSession()) {
      setAllow(true);
      return;
    }
    const user = getUserSession();
    syncKycCookie(user || null);
    if (!user) {
      if (holdUntilCheck) {
        hardRedirect("/verify");
        setAllow(false);
        return;
      }
      setAllow(true);
      return;
    }
    if (isUserBanned(user) && !pathname.startsWith("/banned")) {
      hardRedirect("/banned");
      setAllow(false);
      return;
    }
    if (!isUserBanned(user) && userNeedsVerification(user) && !isUnverifiedAllowedPath(pathname)) {
      hardRedirect("/verify");
      setAllow(false);
      return;
    }
    setAllow(true);
  }, [pathname, holdUntilCheck]);

  if (!allow) {
    return null;
  }

  return children;
}
