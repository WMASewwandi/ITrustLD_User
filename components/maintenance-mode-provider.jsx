"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import LaunchCountdownOverlay from "@/components/launch-countdown-overlay";
import MaintenanceOverlay from "@/components/maintenance-overlay";
import { fetchMaintenanceMode, markMaintenanceModeLoaded } from "@/lib/maintenance-mode";
import {
  getMaintenanceModeState,
  subscribeMaintenanceMode,
} from "@/lib/maintenance-mode-store";

const MaintenanceModeContext = createContext(getMaintenanceModeState());

export function MaintenanceModeProvider({ children }) {
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

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        load();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      enabled: state.enabled,
      message: state.message,
      loading: state.loading,
      countdownActive: state.countdownActive,
    }),
    [state],
  );

  const showCountdown =
    !state.loading && !state.enabled && state.countdownActive && Boolean(state.countdownReleasesAt);
  const blocking = state.enabled || showCountdown;

  return (
    <MaintenanceModeContext.Provider value={value}>
      <div className={blocking ? "pointer-events-none select-none" : undefined} aria-hidden={blocking}>
        {children}
      </div>
      {!state.loading && state.enabled ? <MaintenanceOverlay message={state.message} /> : null}
      {showCountdown ? (
        <LaunchCountdownOverlay
          releasesAt={state.countdownReleasesAt}
          serverNow={state.serverNow}
          eyebrow={state.countdownEyebrow}
          title={state.countdownTitle}
          message={state.countdownMessage}
          footer={state.countdownFooter}
          backgroundUrl={state.countdownBackgroundUrl}
        />
      ) : null}
    </MaintenanceModeContext.Provider>
  );
}

export function useMaintenanceMode() {
  return useContext(MaintenanceModeContext);
}
