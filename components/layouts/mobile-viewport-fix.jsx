"use client";

import { useEffect } from "react";

const VIEWPORT_CONTENT = "width=device-width, initial-scale=1, viewport-fit=cover";

function getViewportMeta() {
  return document.querySelector('meta[name="viewport"]');
}

/**
 * iOS/Android leave the visual viewport scaled after the keyboard hides.
 * The page then looks "zoomed out" / not responsive until the user pinches in.
 * Briefly lock maximum-scale to snap back to 1, then restore pinch-zoom.
 */
function snapViewport() {
  const meta = getViewportMeta();
  if (!meta) return;
  meta.setAttribute("content", `${VIEWPORT_CONTENT}, maximum-scale=1`);
  window.scrollTo(0, window.scrollY);
  requestAnimationFrame(() => {
    meta.setAttribute("content", VIEWPORT_CONTENT);
  });
}

export default function MobileViewportFix() {
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return undefined;

    let lastHeight = window.visualViewport?.height ?? window.innerHeight;

    const onVisualResize = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      if (height > lastHeight + 80) {
        snapViewport();
      }
      lastHeight = height;
    };

    const onFocusOut = (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        window.setTimeout(snapViewport, 80);
      }
    };

    const onOrientation = () => {
      window.setTimeout(snapViewport, 200);
    };

    window.visualViewport?.addEventListener("resize", onVisualResize);
    document.addEventListener("focusout", onFocusOut);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.visualViewport?.removeEventListener("resize", onVisualResize);
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);

  return null;
}
