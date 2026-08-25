import { apiRequest } from '@/lib/api';
import { MEMBERSHIP_TIER_LADDER } from '@/lib/membership-tiers';

export async function fetchMembershipTiers({ audience } = {}) {
  const params = new URLSearchParams();
  if (audience) params.set('audience', audience);
  const qs = params.toString();
  const data = await apiRequest(`/public/loyalty/membership-tiers${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
  const tiers = Array.isArray(data?.tiers) ? data.tiers : [];
  if (!tiers.length) {
    // Ladder only — no default benefits when API has nothing.
    return MEMBERSHIP_TIER_LADDER.map((tier) => ({ ...tier, benefits: [] }));
  }
  return tiers.map(mapApiTierToMembershipTier);
}

export function mapApiTierToMembershipTier(tier) {
  return {
    id: tier.id || tier.slug,
    slug: tier.slug || tier.id,
    levelId: tier.levelId ?? tier.level_id,
    name: tier.name,
    points: Number(tier.points) || 0,
    icon: tier.icon || 'star',
    color: tier.color || '#64969A',
    ring: tier.ring || '#64969A',
    filled: Boolean(tier.filled),
    active: tier.active !== false && tier.isActive !== false,
    // Only what the API/DB returned — never invent benefits.
    benefits: Array.isArray(tier.benefits)
      ? tier.benefits
          .map((item) =>
            typeof item === 'object' && item
              ? String(item.text || '').trim()
              : String(item || '').trim(),
          )
          .filter(Boolean)
      : [],
  };
}
