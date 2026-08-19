/** Same public site key as Laravel register/support forms. Not a secret. */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABgpWO1byq2Cgv3v';

export function hasTurnstileSiteKey() {
  return Boolean(TURNSTILE_SITE_KEY);
}
