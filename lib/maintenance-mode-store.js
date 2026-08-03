export const DEFAULT_MAINTENANCE_MESSAGE =
  'We are currently performing scheduled maintenance. Please check back shortly.';

const DEFAULT_STATE = {
  enabled: false,
  message: DEFAULT_MAINTENANCE_MESSAGE,
  loading: true,
};

let state = { ...DEFAULT_STATE };
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(state));
}

export function getMaintenanceModeState() {
  return state;
}

export function subscribeMaintenanceMode(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function setMaintenanceModeState(patch) {
  state = {
    ...state,
    ...patch,
    loading: false,
  };
  emit();
}

export function activateMaintenanceMode(message) {
  setMaintenanceModeState({
    enabled: true,
    message: message || DEFAULT_MAINTENANCE_MESSAGE,
  });
}

export function deactivateMaintenanceMode() {
  setMaintenanceModeState({
    enabled: false,
    message: DEFAULT_MAINTENANCE_MESSAGE,
  });
}
