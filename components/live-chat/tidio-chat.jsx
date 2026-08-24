"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_SESSION_CHANGED_EVENT, hasUserSession } from "@/lib/auth";

const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY || "e3tkzblgnc6o2jkryjhomfcotdsnyybp";

/** Sit just above the 64px mobile bottom nav. */
const MOBILE_NAV_OFFSET = "calc(66px + env(safe-area-inset-bottom, 0px))";
const MOBILE_MQ = "(max-width: 1023px)";

function tidioFrames() {
  return [
    document.getElementById("tidio-chat"),
    document.getElementById("tidio-chat-iframe"),
    ...document.querySelectorAll("#tidio-chat iframe"),
    ...document.querySelectorAll('iframe[id*="tidio"], iframe[src*="tidio"]'),
  ].filter((el, index, list) => el && list.indexOf(el) === index);
}

function tidioIframes() {
  return tidioFrames().filter((el) => el.tagName === "IFRAME");
}

/** Launcher bubble is a small square; the conversation panel is a large white iframe. */
function isTidioLauncher(el) {
  if (!el || el.tagName !== "IFRAME") return false;
  const w = el.offsetWidth || el.getBoundingClientRect().width;
  const h = el.offsetHeight || el.getBoundingClientRect().height;
  return w > 0 && h > 0 && w <= 140 && h <= 180;
}

function offsetTidioForMobileNav() {
  if (typeof window === "undefined") return;
  const wrapper = document.getElementById("tidio-chat") || document.getElementById("tidio-chat-code");
  if (wrapper) {
    wrapper.style.setProperty("position", "fixed", "important");
    wrapper.style.setProperty("background", "transparent", "important");
  }

  const mobile = window.matchMedia(MOBILE_MQ).matches;
  tidioIframes().forEach((el) => {
    const ours = el.style.getPropertyValue("bottom") === MOBILE_NAV_OFFSET;
    if (mobile && isTidioLauncher(el)) {
      if (!ours) el.style.setProperty("bottom", MOBILE_NAV_OFFSET, "important");
      return;
    }
    if (ours) el.style.removeProperty("bottom");
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

function applyTidioVisibility(visible) {
  if (visible) {
    restoreTidioDom();
    window.tidioChatApi?.show?.();
    offsetTidioForMobileNav();
    return;
  }
  window.tidioChatApi?.hide?.();
  hideTidioDom();
}

function setTidioVisible(visible) {
  if (typeof window === "undefined") return;

  if (window.tidioChatApi) {
    applyTidioVisibility(visible);
    return;
  }

  if (!visible) {
    hideTidioDom();
    return;
  }

  const showWhenReady = () => applyTidioVisibility(true);
  document.addEventListener("tidioChat-ready", showWhenReady, { once: true });

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (window.tidioChatApi) {
      window.clearInterval(timer);
      showWhenReady();
    } else if (attempts >= 20) {
      window.clearInterval(timer);
    }
  }, 250);
}

function isPrintPath(pathname) {
  return /\/print(?:\/|$)/.test(String(pathname || ""));
}

/**
 * Tidio live chat — members only (same as Laravel `footer-customer.blade.php`).
 * Script stays mounted after login so client-side navigations do not hide it.
 */
export default function TidioChat() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const shouldShow = loggedIn && !isPrintPath(pathname);

  useEffect(() => {
    function syncAuth() {
      setLoggedIn(hasUserSession());
    }

    syncAuth();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    setTidioVisible(shouldShow);
    if (!shouldShow) return undefined;

    const mq = window.matchMedia(MOBILE_MQ);
    const onReady = () => {
      applyTidioVisibility(true);
    };
    document.addEventListener("tidioChat-ready", onReady);
    mq.addEventListener("change", onReady);
    window.addEventListener("resize", onReady);

    const observer = new MutationObserver(() => offsetTidioForMobileNav());
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
  }, [shouldShow]);

  if (!loggedIn || !TIDIO_KEY) return null;

  return (
    <Script
      src={`https://code.tidio.co/${TIDIO_KEY}.js`}
      strategy="afterInteractive"
      onLoad={() => {
        setTidioVisible(hasUserSession() && !isPrintPath(window.location.pathname));
      }}
    />
  );
}
