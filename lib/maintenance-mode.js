import {
  activateMaintenanceMode,
  applyLaunchCountdown,
  deactivateMaintenanceMode,
  DEFAULT_COUNTDOWN_MESSAGE,
  DEFAULT_MAINTENANCE_MESSAGE,
  getMaintenanceModeState,
  setMaintenanceModeState,
} from '@/lib/maintenance-mode-store';

export { DEFAULT_COUNTDOWN_MESSAGE, DEFAULT_MAINTENANCE_MESSAGE };

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

function rewritePublicAssetUrl(url) {
  const value = String(url || '').trim();
  if (!value) return value;
  try {
    const parsed = new URL(value);
    if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') return value;
    const assetPath = `${parsed.pathname}${parsed.search}`.replace(/^\/api\/v1/, '');
    return `${API_BASE}${assetPath}`;
  } catch {
    return value;
  }
}

export async function fetchMaintenanceMode() {
  try {
    const response = await fetch(`${API_BASE}/public/maintenance-mode?_=${Date.now()}`, {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      throw new Error('Failed to load maintenance mode.');
    }
    const data = await response.json();
    const countdown = data.countdown || {};
    if (countdown.backgroundUrl) {
      countdown.backgroundUrl = rewritePublicAssetUrl(countdown.backgroundUrl);
    }
    const result = {
      enabled: Boolean(data.enabled),
      message: data.message || DEFAULT_MAINTENANCE_MESSAGE,
      serverNow: data.serverNow || new Date().toISOString(),
      countdown,
    };

    if (result.enabled) {
      activateMaintenanceMode(result.message);
    } else {
      deactivateMaintenanceMode();
    }

    applyLaunchCountdown(result.countdown, result.serverNow);

    return result;
  } catch {
    const current = getMaintenanceModeState();
    if (current.countdownActive && current.countdownReleasesAt) {
      setMaintenanceModeState({ loading: false });
      return {
        enabled: current.enabled,
        message: current.message,
        countdown: {
          enabled: current.countdownEnabled,
          active: current.countdownActive,
          releasesAt: current.countdownReleasesAt,
        },
      };
    }
    deactivateMaintenanceMode();
    applyLaunchCountdown({ enabled: false, active: false }, new Date().toISOString());
    return {
      enabled: false,
      message: DEFAULT_MAINTENANCE_MESSAGE,
      countdown: { enabled: false, active: false },
    };
  }
}

export function applyMaintenanceApiResponse(data) {
  if (!data?.maintenanceMode) return;

  activateMaintenanceMode(data.message || DEFAULT_MAINTENANCE_MESSAGE);
}

export function markMaintenanceModeLoaded() {
  setMaintenanceModeState({ loading: false });
}
