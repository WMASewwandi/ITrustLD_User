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

  // Both start and end dates are required — no schedule means hidden.
  if (!activeFrom || !activeTo) return false;
  if (activeFrom > today) return false;
  if (activeTo < today) return false;

  return true;
}

export function isPromotionVideoUrl(url) {
  return Boolean(url && /\.(mp4|webm|mov)(\?|$)/i.test(url));
}

function collectMedia(item = {}) {
  const urls =
    Array.isArray(item.mediaUrls) && item.mediaUrls.length
      ? item.mediaUrls.filter(Boolean)
      : item.mediaUrl
        ? [item.mediaUrl]
        : [];
  const names =
    Array.isArray(item.mediaNames) && item.mediaNames.length
      ? item.mediaNames
      : item.mediaName
        ? [item.mediaName]
        : [];
  return { urls, names };
}

function resolveBannerId(item = {}) {
  if (item.bannerId != null && item.bannerId !== '') return Number(item.bannerId) || item.bannerId;
  if (typeof item.id === 'string' && /^\d+-\d+$/.test(item.id)) {
    return Number(item.id.split('-')[0]);
  }
  return Number(item.id) || item.id;
}

function contentKey(item = {}) {
  return [
    String(item.title || '').trim().toLowerCase(),
    String(item.description || '').trim().toLowerCase(),
    String(item.audienceKey || item.audience || '').trim().toLowerCase(),
    String(item.activeFrom || item.active_from || '').slice(0, 10),
    String(item.activeTo || item.active_to || '').slice(0, 10),
    String(item.color || '').trim().toLowerCase(),
    String(item.ctaLink || item.cta_link || '').trim(),
    String(item.displayTypeKey || item.displayType || 'slider').trim().toLowerCase(),
  ].join('|');
}

function mergeMediaInto(target, item) {
  const { urls, names } = collectMedia(item);
  urls.forEach((url, index) => {
    if (!url || target.mediaUrls.includes(url)) return;
    target.mediaUrls.push(url);
    target.mediaNames.push(names[index] || '');
  });
}

/**
 * Build one promotion per admin banner.
 * - Groups expanded slide fragments by bannerId
 * - Merges legacy one-image-per-row duplicates (same title/copy/dates) into one slider
 */
export function consolidateSliderBanners(items = []) {
  const byId = new Map();

  for (const item of items || []) {
    if (!item) continue;
    const id = resolveBannerId(item);
    if (!byId.has(id)) {
      byId.set(id, {
        ...item,
        id,
        mediaUrls: [],
        mediaNames: [],
      });
    }
    mergeMediaInto(byId.get(id), item);
  }

  const byContent = new Map();
  for (const banner of byId.values()) {
    const key = contentKey(banner);
    if (!byContent.has(key)) {
      byContent.set(key, {
        ...banner,
        mediaUrls: [...banner.mediaUrls],
        mediaNames: [...banner.mediaNames],
      });
      continue;
    }
    mergeMediaInto(byContent.get(key), banner);
  }

  return Array.from(byContent.values()).map((banner) => ({
    ...banner,
    mediaUrl: banner.mediaUrls[0] || null,
    mediaName: banner.mediaNames[0] || '',
    mediaCount: banner.mediaUrls.length,
  }));
}

/** Media URLs used by one promotion's image slider. */
export function getBannerSlideUrls(banner = {}) {
  const { urls } = collectMedia(banner);
  return urls;
}
