"use client";

import { useEffect } from "react";

export default function AlpineInit() {
  useEffect(() => {
    let isMounted = true;

    async function bootAlpine() {
      const { default: Alpine } = await import("alpinejs");
      if (!isMounted) return;
      window.Alpine = Alpine;
      Alpine.start();
    }

    bootAlpine();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
