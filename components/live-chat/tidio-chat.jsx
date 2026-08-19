"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { AUTH_SESSION_CHANGED_EVENT, hasUserSession } from "@/lib/auth";

const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY || "e3tkzblgnc6o2jkryjhomfcotdsnyybp";

function setTidioVisible(visible) {
  if (typeof window === "undefined") return;

  const apply = () => {
    if (visible) {
      window.tidioChatApi?.show?.();
    } else {
      window.tidioChatApi?.hide?.();
    }
  };

  if (window.tidioChatApi) {
    apply();
    return;
  }

  if (!visible) return;

  document.addEventListener("tidioChat-ready", apply, { once: true });
}

/**
 * Tidio live chat — members only (same as Laravel `footer-customer.blade.php`).
 * Guests never see the widget, including after client-side navigation from dashboard.
 */
export default function TidioChat() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      const loggedIn = hasUserSession();
      setEnabled(loggedIn);
      setTidioVisible(loggedIn);
    }

    sync();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
      setTidioVisible(false);
    };
  }, []);

  if (!enabled || !TIDIO_KEY) return null;

  return (
    <Script
      src={`https://code.tidio.co/${TIDIO_KEY}.js`}
      strategy="afterInteractive"
      onLoad={() => {
        if (hasUserSession()) {
          setTidioVisible(true);
        } else {
          setTidioVisible(false);
        }
      }}
    />
  );
}
