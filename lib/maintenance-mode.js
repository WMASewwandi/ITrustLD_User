import {
  activateMaintenanceMode,
  deactivateMaintenanceMode,
  DEFAULT_MAINTENANCE_MESSAGE,
  setMaintenanceModeState,
} from '@/lib/maintenance-mode-store';

export { DEFAULT_MAINTENANCE_MESSAGE };

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export async function fetchMaintenanceMode() {
  try {
    const response = await fetch(`${API_BASE}/public/maintenance-mode?_=${Date.now()}`, {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to load maintenance mode.');
    }
    const data = await response.json();
    const result = {
      enabled: Boolean(data.enabled),
      message: data.message || DEFAULT_MAINTENANCE_MESSAGE,
    };

    if (result.enabled) {
      activateMaintenanceMode(result.message);
    } else {
      deactivateMaintenanceMode();
    }

    return result;
  } catch {
    return {
      enabled: false,
      message: DEFAULT_MAINTENANCE_MESSAGE,
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
