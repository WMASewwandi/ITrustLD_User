export const DEFAULT_WIDE_LOGO_URL = '/assets/img/logos/logo-itrustld-wide.png';
export const DEFAULT_ICON_LOGO_URL = '/assets/img/logos/logo-itrustld.svg';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

let cachedLogo = null;
let cacheExpiresAt = 0;

function buildLogoState(data) {
  if (data?.isDefault) {
    return {
      wideLogoUrl: DEFAULT_WIDE_LOGO_URL,
      iconLogoUrl: DEFAULT_ICON_LOGO_URL,
      campaign: data.campaign || 'Default Brand',
      isDefault: true,
    };
  }

  return {
    wideLogoUrl: data.wideLogoUrl || DEFAULT_WIDE_LOGO_URL,
    iconLogoUrl: data.iconLogoUrl || DEFAULT_ICON_LOGO_URL,
    campaign: data.campaign || 'Default Brand',
    isDefault: Boolean(data.isDefault),
  };
}

export async function fetchWebsiteLogo() {
  const now = Date.now();
  if (cachedLogo && cacheExpiresAt > now) {
    return cachedLogo;
  }

  try {
    const response = await fetch(`${API_BASE}/public/website-logos`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to load website logo.');
    }
    const data = await response.json();
    cachedLogo = buildLogoState(data);
  } catch {
    cachedLogo = buildLogoState({ isDefault: true });
  }

  cacheExpiresAt = now + 60_000;
  return cachedLogo;
}
