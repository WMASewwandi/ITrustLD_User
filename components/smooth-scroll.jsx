"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";

const DESKTOP_SCROLL_MQ = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function shouldUseLenis(pathname) {
  // Root Lenis scroll adds extra space below the footer on dashboard pages.
  return !String(pathname || "").startsWith("/dashboard");
}

/**
 * Lenis transforms the document. On mobile that fights the keyboard:
 * opening/closing it leaves the visual viewport scaled, so the layout
 * looks zoomed-out until the user pinches in. Use native scroll on touch.
 */
export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_SCROLL_MQ);
    const sync = () => {
      const next = mq.matches && shouldUseLenis(window.location.pathname);
      setEnableLenis(next);
      if (!next) {
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
        document.documentElement.style.height = "";
        document.body.style.height = "";
        document.body.style.minHeight = "";
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [pathname]);

  if (!enableLenis) {
    return children;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
