"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_SESSION_CHANGED_EVENT, hasUserSession } from "@/lib/auth";

const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY || "e3tkzblgnc6o2jkryjhomfcotdsnyybp";

/** Matches mobile bottom nav: 64px bar + 12px gap + iOS safe area. */
const MOBILE_NAV_OFFSET = "calc(76px + env(safe-area-inset-bottom, 0px))";
const MOBILE_MQ = "(max-width: 1023px)";

function tidioFrames() {
  return [
    document.getElementById("tidio-chat"),
    document.getElementById("tidio-chat-iframe"),
    ...document.querySelectorAll("#tidio-chat iframe"),
    ...document.querySelectorAll('iframe[id*="tidio"], iframe[src*="tidio"]'),
  ].filter((el, index, list) => el && list.indexOf(el) === index);
}

function offsetTidioForMobileNav() {
  if (typeof window === "undefined") return;
  const mobile = window.matchMedia(MOBILE_MQ).matches;
  tidioFrames().forEach((el) => {
    if (mobile) {
      if (el.style.getPropertyValue("bottom") === MOBILE_NAV_OFFSET) return;
      el.style.setProperty("bottom", MOBILE_NAV_OFFSET, "important");
    } else if (el.style.getPropertyValue("bottom") === MOBILE_NAV_OFFSET) {
      el.style.removeProperty("bottom");
    }
  });
}

function hideTidioDom() {
  tidioFrames().forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
  });
}

function restoreTidioDom() {
  tidioFrames().forEach((el) => {
    if (el.style.getPropertyValue("display") === "none") el.style.removeProperty("display");
    if (el.style.getPropertyValue("visibility") === "hidden") el.style.removeProperty("visibility");
  });
}

function setTidioVisible(visible) {
  if (typeof window === "undefined") return;

  const apply = () => {
    if (visible) {
      restoreTidioDom();
      window.tidioChatApi?.show?.();
      offsetTidioForMobileNav();
    } else {
      window.tidioChatApi?.hide?.();
      hideTidioDom();
    }
  };

  if (window.tidioChatApi) {
    apply();
    return;
  }

  if (!visible) {
    hideTidioDom();
    return;
  }

  document.addEventListener("tidioChat-ready", apply, { once: true });
}

/**
 * Tidio live chat — members only (same as Laravel `footer-customer.blade.php`).
 * Guests never see the widget, including after client-side navigation from dashboard.
 */
function isPrintPath(pathname) {
  return /\/print(?:\/|$)/.test(String(pathname || ""));
}

export default function TidioChat() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const onPrintPage = isPrintPath(pathname);

  useEffect(() => {
    function sync() {
      const loggedIn = hasUserSession() && !isPrintPath(window.location.pathname);
      setEnabled(loggedIn);
      setTidioVisible(loggedIn);
    }

    function hideForPrint() {
      setTidioVisible(false);
    }

    sync();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("beforeprint", hideForPrint);
    window.addEventListener("afterprint", sync);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("beforeprint", hideForPrint);
      window.removeEventListener("afterprint", sync);
      setTidioVisible(false);
    };
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return undefined;

    const mq = window.matchMedia(MOBILE_MQ);
    const onReady = () => offsetTidioForMobileNav();
    offsetTidioForMobileNav();
    document.addEventListener("tidioChat-ready", onReady);
    mq.addEventListener("change", onReady);
    window.addEventListener("resize", onReady);

    const observer = new MutationObserver(onReady);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      document.removeEventListener("tidioChat-ready", onReady);
      mq.removeEventListener("change", onReady);
      window.removeEventListener("resize", onReady);
      observer.disconnect();
    };
  }, [enabled]);

  if (!enabled || onPrintPage || !TIDIO_KEY) return null;

  return (
    <Script
      src={`https://code.tidio.co/${TIDIO_KEY}.js`}
      strategy="afterInteractive"
      onLoad={() => {
        if (hasUserSession() && !isPrintPath(window.location.pathname)) {
          setTidioVisible(true);
        } else {
          setTidioVisible(false);
        }
      }}
    />
  );
}
