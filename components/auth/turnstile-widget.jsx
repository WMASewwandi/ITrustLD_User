"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";

export default function TurnstileWidget({
  onToken,
  onExpire,
  theme = "light",
  resetKey = 0,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const [scriptReady, setScriptReady] = useState(false);

  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (typeof window !== "undefined" && window.turnstile) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || !TURNSTILE_SITE_KEY) {
      return undefined;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme,
      callback: (token) => onTokenRef.current?.(token),
      "expired-callback": () => {
        onTokenRef.current?.("");
        onExpireRef.current?.();
      },
      "error-callback": () => onTokenRef.current?.(""),
    });
    widgetIdRef.current = widgetId;

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Widget may already be gone if the container unmounted first.
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, theme, resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="mt-2 min-h-[65px]" />
    </>
  );
}
