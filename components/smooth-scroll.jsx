"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

const DESKTOP_SCROLL_MQ = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/**
 * Lenis transforms the document. On mobile that fights the keyboard:
 * opening/closing it leaves the visual viewport scaled, so the layout
 * looks zoomed-out until the user pinches in. Use native scroll on touch.
 */
export default function SmoothScroll({ children }) {
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_SCROLL_MQ);
    const sync = () => setEnableLenis(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
