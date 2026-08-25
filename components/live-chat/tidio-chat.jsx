"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_SESSION_CHANGED_EVENT, hasUserSession } from "@/lib/auth";

const TIDIO_KEY =
  process.env.NEXT_PUBLIC_TIDIO_KEY || "e3tkzblgnc6o2jkryjhomfcotdsnyybp";

const MOBILE_MQ = "(max-width: 1023px)";
const NAV_GAP_PX = 8;

function tidioFrames() {
  return [
    document.getElementById("tidio-chat"),
    document.getElementById("tidio-chat-code"),
    document.getElementById("tidio-chat-iframe"),
    document.getElementById("tidio"),
    ...document.querySelectorAll("#tidio-chat iframe"),
    ...document.querySelectorAll('iframe[id*="tidio"], iframe[src*="tidio"]'),
  ].filter((el, index, list) => el && list.indexOf(el) === index);
}

function tidioIframes() {
  return tidioFrames().filter((el) => el.tagName === "IFRAME");
}

function mobileNavClearance() {
  const nav = document.querySelector("[data-mobile-bottom-nav]");
  if (!nav) return 0;
  const rect = nav.getBoundingClientRect();
  if (rect.height < 8 || rect.width < 8) return 0;
  return Math.max(0, Math.round(window.innerHeight - rect.top + NAV_GAP_PX));
}

function isHiddenTidioPanel(el) {
  const style = window.getComputedStyle(el);
  const bottom = parseFloat(style.bottom);
  return (
    style.display === "none" ||
    style.visibility === "hidden" ||
    (Number.isFinite(bottom) && bottom < -40)
  );
}

/**
 * Launcher / greeting chip only. Do not touch the conversation iframe —
 * Tidio hides that panel with a negative bottom; overriding it shows a
 * white box on the page.
 */
function isTidioLauncher(el) {
  if (!el || el.tagName !== "IFRAME" || isHiddenTidioPanel(el)) return false;
  const w = el.offsetWidth || el.getBoundingClientRect().width;
  const h = el.offsetHeight || el.getBoundingClientRect().height;
  return w > 0 && h > 0 && w <= 420 && h <= 240;
}

function applyLauncherOffset(el, clearancePx) {
  const next = `${clearancePx}px`;
  el.style.setProperty("position", "fixed", "important");
  if (el.style.getPropertyValue("bottom") !== next) {
    el.style.setProperty("bottom", next, "important");
  }
  el.dataset.itrustNavOffset = next;
}

function clearLauncherOffset(el) {
  if (!el.dataset.itrustNavOffset) return;
  el.style.removeProperty("bottom");
  delete el.dataset.itrustNavOffset;
}

function applyOfficialTidioOffset(clearancePx) {
  const api = window.tidioChatApi;
  if (!api?.adjustStyles || clearancePx <= 0) return;
  if (applyOfficialTidioOffset.last === clearancePx) return;
  applyOfficialTidioOffset.last = clearancePx;
  try {
    api.adjustStyles(
      `@media only screen and (max-width: 1023px) { #tidio { bottom: ${clearancePx}px !important; } }`,
    );
  } catch {
    applyOfficialTidioOffset.last = undefined;
  }
}

function overlapsMobileNav(el, navTop) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > navTop + 2;
}

function offsetTidioForMobileNav() {
  if (typeof window === "undefined") return;
  const wrapper = document.getElementById("tidio-chat") || document.getElementById("tidio-chat-code");
  if (wrapper) {
    wrapper.style.setProperty("position", "fixed", "important");
    wrapper.style.setProperty("background", "transparent", "important");
  }

  const mobile = window.matchMedia(MOBILE_MQ).matches;
  const clearance = mobile ? mobileNavClearance() : 0;
  const navTop = mobile ? window.innerHeight - Math.max(clearance - NAV_GAP_PX, 0) : 0;

  if (clearance > 0) {
    applyOfficialTidioOffset(clearance);
  }

  tidioIframes().forEach((el) => {
    if (clearance <= 0) {
      clearLauncherOffset(el);
      return;
    }

    const w = el.offsetWidth || el.getBoundingClientRect().width;
    const h = el.offsetHeight || el.getBoundingClientRect().height;
    if ((w === 0 && h === 0) || isHiddenTidioPanel(el)) return;

    // Skip the open conversation panel (large iframe). Lift the bubble if it
    // is a launcher, or if a compact iframe is still sitting on the nav.
    const conversation = w > 280 && h > 280;
    if (!conversation && (isTidioLauncher(el) || overlapsMobileNav(el, navTop))) {
      applyLauncherOffset(el, clearance);
      return;
    }
    clearLauncherOffset(el);
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
    const onTidioEvent = () => offsetTidioForMobileNav();

    document.addEventListener("tidioChat-ready", onReady);
    mq.addEventListener("change", onReady);
    window.addEventListener("resize", onReady);
    window.addEventListener("orientationchange", onReady);
    window.tidioChatApi?.on?.("ready", onTidioEvent);
    window.tidioChatApi?.on?.("close", onTidioEvent);

    let rafId = 0;
    const observer = new MutationObserver(() => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        offsetTidioForMobileNav();
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    let tries = 0;
    const retry = window.setInterval(() => {
      offsetTidioForMobileNav();
      tries += 1;
      if (tries >= 20) window.clearInterval(retry);
    }, 300);

    return () => {
      document.removeEventListener("tidioChat-ready", onReady);
      mq.removeEventListener("change", onReady);
      window.removeEventListener("resize", onReady);
      window.removeEventListener("orientationchange", onReady);
      observer.disconnect();
      window.clearInterval(retry);
      if (rafId) window.cancelAnimationFrame(rafId);
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
