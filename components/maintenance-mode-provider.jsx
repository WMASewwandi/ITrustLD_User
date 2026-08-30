"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import LaunchCountdownOverlay from "@/components/launch-countdown-overlay";
import MaintenanceOverlay from "@/components/maintenance-overlay";
import { fetchMaintenanceMode, markMaintenanceModeLoaded } from "@/lib/maintenance-mode";
import {
  getMaintenanceModeState,
  hydrateLaunchCountdownFromStorage,
  subscribeMaintenanceMode,
} from "@/lib/maintenance-mode-store";

const MaintenanceModeContext = createContext(getMaintenanceModeState());

export function MaintenanceModeProvider({ children }) {
  const [state, setState] = useState(getMaintenanceModeState());

  useLayoutEffect(() => {
    hydrateLaunchCountdownFromStorage();
  }, []);

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

    function handlePageShow(event) {
      if (event.persisted) {
        hydrateLaunchCountdownFromStorage();
        load();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
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
    !state.enabled && state.countdownActive && Boolean(state.countdownReleasesAt);
  const waitingForStatus = state.loading && !state.enabled && !showCountdown;
  const blocking = state.enabled || showCountdown || waitingForStatus;

  return (
    <MaintenanceModeContext.Provider value={value}>
      <div className={blocking ? "pointer-events-none select-none" : undefined} aria-hidden={blocking}>
        {children}
      </div>
      {waitingForStatus ? (
        <div className="fixed inset-0 z-[99999] h-[100dvh] w-screen bg-black" aria-hidden="true" />
      ) : null}
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
