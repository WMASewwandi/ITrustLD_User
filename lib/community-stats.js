import { apiRequest } from '@/lib/api';

const FALLBACK_MEMBER_COUNT = 82875;

export function formatCompactCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value < 0) {
    return '82K+';
  }

  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded =
      millions >= 10 ? Math.round(millions) : Number(millions.toFixed(1).replace(/\.0$/, ''));
    return `${rounded}M+`;
  }

  if (value >= 10_000) {
    return `${Math.floor(value / 1000)}K+`;
  }

  return value.toLocaleString('en-US');
}

export async function fetchCommunityStats() {
  try {
    const data = await apiRequest('/public/community-stats', { method: 'GET' });
    return {
      baseCount: Number(data?.members?.baseCount) || 0,
      liveCount: Number(data?.members?.liveCount) || 0,
      displayedCount: Number(data?.members?.displayedCount) || FALLBACK_MEMBER_COUNT,
    };
  } catch {
    return {
      baseCount: 82000,
      liveCount: 875,
      displayedCount: FALLBACK_MEMBER_COUNT,
    };
  }
}
