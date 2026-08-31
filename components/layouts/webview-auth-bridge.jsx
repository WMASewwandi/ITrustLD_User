"use client";

import { useEffect } from "react";
import {
  AUTH_SESSION_CHANGED_EVENT,
  getUserSession,
  hasUserSession,
  publishWebViewAuthChannel,
} from "@/lib/auth";

/**
 * Mirrors Laravel @auth AuthChannel + localStorage.username on authenticated pages
 * so the Android WebView can save quick-access login details.
 */
export default function WebViewAuthBridge() {
  useEffect(() => {
    function sync() {
      if (!hasUserSession()) return;
      publishWebViewAuthChannel(getUserSession());
    }

    sync();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
  }, []);

  return null;
}
