"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { fetchAuthConfig } from "@/lib/auth";

export default function TurnstileWidget({ onToken, onExpire, onReady }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [siteKey, setSiteKey] = useState(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  );
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (siteKey) return;
    fetchAuthConfig()
      .then((config) => {
        if (config?.turnstileSiteKey) {
          setSiteKey(config.turnstileSiteKey);
        }
      })
      .catch(() => {});
  }, [siteKey]);

  useEffect(() => {
    if (siteKey) {
      onReady?.();
    }
  }, [siteKey, onReady]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) {
      return undefined;
    }

    if (widgetIdRef.current !== null) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
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
  }, [siteKey, scriptReady, onToken, onExpire]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="mt-2" />
    </>
  );
}
