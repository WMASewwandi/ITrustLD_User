export const DEFAULT_MAINTENANCE_MESSAGE =
  'We are currently performing scheduled maintenance. Please check back shortly.';

export const DEFAULT_COUNTDOWN_MESSAGE =
  'The new iTrustLD experience is almost here. We go live at the time shown below.';

export const DEFAULT_COUNTDOWN_EYEBROW = 'New system launch';
export const DEFAULT_COUNTDOWN_TITLE = 'Going live soon';
export const DEFAULT_COUNTDOWN_FOOTER = 'Please check back when the countdown ends.';

const DEFAULT_STATE = {
  enabled: false,
  message: DEFAULT_MAINTENANCE_MESSAGE,
  loading: true,
  serverNow: null,
  countdownEnabled: false,
  countdownActive: false,
  countdownReleasesAt: null,
  countdownEyebrow: DEFAULT_COUNTDOWN_EYEBROW,
  countdownTitle: DEFAULT_COUNTDOWN_TITLE,
  countdownMessage: DEFAULT_COUNTDOWN_MESSAGE,
  countdownFooter: DEFAULT_COUNTDOWN_FOOTER,
  countdownBackgroundUrl: null,
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

export function applyLaunchCountdown(countdown = {}, serverNow = null) {
  setMaintenanceModeState({
    serverNow: serverNow || new Date().toISOString(),
    countdownEnabled: Boolean(countdown.enabled),
    countdownActive: Boolean(countdown.active),
    countdownReleasesAt: countdown.releasesAt || null,
    countdownEyebrow: countdown.eyebrow || DEFAULT_COUNTDOWN_EYEBROW,
    countdownTitle: countdown.title || DEFAULT_COUNTDOWN_TITLE,
    countdownMessage: countdown.message || DEFAULT_COUNTDOWN_MESSAGE,
    countdownFooter: countdown.footer || DEFAULT_COUNTDOWN_FOOTER,
    countdownBackgroundUrl: countdown.backgroundUrl || null,
  });
}

export function clearLaunchCountdown() {
  setMaintenanceModeState({
    countdownEnabled: false,
    countdownActive: false,
  });
}
