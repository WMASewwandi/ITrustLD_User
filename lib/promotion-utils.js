function toDateKey(value) {
  if (!value) return null;
  const text = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isPromotionInActivePeriod(banner) {
  if (!banner || banner.isActive === false) return false;

  const today = todayKey();
  const activeFrom = toDateKey(banner.activeFrom || banner.active_from);
  const activeTo = toDateKey(banner.activeTo || banner.active_to);

  if (activeFrom && activeFrom > today) return false;
  if (activeTo && activeTo < today) return false;

  return true;
}

export function isPromotionVideoUrl(url) {
  return Boolean(url && /\.(mp4|webm|mov)(\?|$)/i.test(url));
}
