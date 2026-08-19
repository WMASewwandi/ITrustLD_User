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
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || !TURNSTILE_SITE_KEY) {
      return undefined;
    }

    if (widgetIdRef.current !== null) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme,
      callback: (token) => onToken?.(token),
      "expired-callback": () => {
        onToken?.("");
        onExpire?.();
      },
      "error-callback": () => onToken?.(""),
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, onToken, onExpire, theme, resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="mt-2" />
    </>
  );
}
