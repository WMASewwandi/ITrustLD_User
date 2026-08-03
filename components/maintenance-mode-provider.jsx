"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import MaintenanceOverlay from "@/components/maintenance-overlay";
import { fetchMaintenanceMode, markMaintenanceModeLoaded } from "@/lib/maintenance-mode";
import {
  getMaintenanceModeState,
  subscribeMaintenanceMode,
} from "@/lib/maintenance-mode-store";

const MaintenanceModeContext = createContext(getMaintenanceModeState());

const POLL_INTERVAL_MS = 3_000;

export function MaintenanceModeProvider({ children }) {
  const pathname = usePathname();
  const [state, setState] = useState(getMaintenanceModeState());

  useEffect(() => subscribeMaintenanceMode(setState), []);

  useEffect(() => {
    let active = true;

    async function load() {
      await fetchMaintenanceMode();
      if (!active) return;
      markMaintenanceModeLoaded();
    }

    load();
    const intervalId = window.setInterval(load, POLL_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        load();
      }
    }

    function handleFocus() {
      load();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    fetchMaintenanceMode().then(() => {
      markMaintenanceModeLoaded();
    });
  }, [pathname]);

  const value = useMemo(
    () => ({
      enabled: state.enabled,
      message: state.message,
      loading: state.loading,
    }),
    [state],
  );

  return (
    <MaintenanceModeContext.Provider value={value}>
      <div className={state.enabled ? "pointer-events-none select-none" : undefined} aria-hidden={state.enabled}>
        {children}
      </div>
      {!state.loading && state.enabled ? <MaintenanceOverlay message={state.message} /> : null}
    </MaintenanceModeContext.Provider>
  );
}

export function useMaintenanceMode() {
  return useContext(MaintenanceModeContext);
}
