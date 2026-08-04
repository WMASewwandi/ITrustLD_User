import { fetchPublishedBlogPosts } from '@/lib/dashboard';

export const LANDING_PREVIEW_COUNT = 5;

export const FALLBACK_UPDATE_IMAGE =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80';

const SLOT_LAYOUT = [
  { slot: 'left-top', featured: false, parallax: 0.18, icon: 'doc' },
  { slot: 'left-bottom', featured: false, parallax: 0.28, icon: 'chart' },
  { slot: 'center', featured: true, parallax: 0.22, icon: 'calendar' },
  { slot: 'right-top', featured: false, parallax: 0.2, icon: 'bars' },
  { slot: 'right-bottom', featured: false, parallax: 0.26, icon: 'heart' },
];

function parseTimestamp(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function mapBannerToUpdateItem(banner, layout = null) {
  const color = banner.color || '#0D9F1B';
  const mediaUrl = banner.mediaUrl || null;

  return {
    id: `promo-${banner.id}`,
    kind: 'promotion',
    slot: layout?.slot || null,
    featured: layout?.featured || false,
    title: banner.title,
    category: 'Promotion',
    time: banner.activeFromLabel || banner.createdAt || '',
    description: banner.description || '',
    excerpt: banner.description || '',
    image: mediaUrl,
    mediaUrl,
    ctaLink: banner.ctaLink || '',
    ctaLabel: banner.ctaLabel || 'Learn More',
    color,
    parallax: layout?.parallax ?? 0.2,
    icon: layout?.icon ?? 'doc',
    sortOrder: Number(banner.sortOrder) || 0,
    createdAt: banner.createdAt || banner.activeFrom || null,
    activeFrom: banner.activeFrom || null,
    activeTo: banner.activeTo || null,
    author: 'iTrustLD',
    initial: (banner.title || 'i').charAt(0).toUpperCase(),
  };
}

export function mapBlogToUpdateItem(post, layout = null) {
  return {
    id: `blog-${post.id}`,
    kind: 'news',
    slot: layout?.slot || null,
    featured: layout?.featured || false,
    title: post.title,
    category: 'News',
    time: post.date || '',
    description: post.excerpt || '',
    excerpt: post.excerpt || '',
    image: post.image || FALLBACK_UPDATE_IMAGE,
    ctaLink: '',
    ctaLabel: 'Read More',
    color: '#0D9F1B',
    parallax: layout?.parallax ?? 0.2,
    icon: layout?.icon ?? 'doc',
    sortOrder: null,
    createdAt: post.createdAt || post.date || null,
    author: post.author || 'iTrustLD',
    initial: post.initial || (post.title || 'i').charAt(0).toUpperCase(),
  };
}

export function sortLatestUpdateItems(items) {
  return [...items].sort((a, b) => {
    const aPromo = a.kind === 'promotion';
    const bPromo = b.kind === 'promotion';

    if (aPromo && bPromo) {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
    }

    if (aPromo !== bPromo) {
      return aPromo ? -1 : 1;
    }

    return parseTimestamp(b.createdAt || b.time) - parseTimestamp(a.createdAt || a.time);
  });
}

export function assignLandingSlots(items) {
  return SLOT_LAYOUT.map((layout, index) => {
    const source = items[index];
    if (!source) return null;
    return {
      ...source,
      slot: layout.slot,
      featured: layout.featured,
      parallax: layout.parallax,
      icon: layout.icon,
    };
  }).filter(Boolean);
}

export async function fetchLatestUpdates({ userType = 'normal', promotionalBanners: _ignored } = {}) {
  const blogPosts = await fetchPublishedBlogPosts().catch(() => []);

  return sortLatestUpdateItems(blogPosts.map((post) => mapBlogToUpdateItem(post)));
}

export function mapToDashboardNewsItem(item) {
  return {
    id: item.id,
    kind: item.kind || 'news',
    title: item.title,
    excerpt: item.description || item.excerpt || '',
    author: item.author || 'iTrustLD',
    initial: item.initial || (item.title || 'i').charAt(0).toUpperCase(),
    date: item.time || item.date || '',
    image: item.mediaUrl || item.image || null,
    color: item.color || '#0D9F1B',
    ctaLink: item.ctaLink || '',
    ctaLabel: item.ctaLabel || 'Learn More',
    category: item.category || 'News',
    createdAt: item.createdAt || null,
  };
}

export function resolvePromotionUserType(user) {
  if (user?.user_type === 'partner' || user?.is_affiliate) return 'partner';
  return 'normal';
}

/** @deprecated Use resolvePromotionUserType */
export function resolvePromotionAudience(user) {
  return resolvePromotionUserType(user) === 'partner' ? 'affiliate' : 'normal';
}
