import { apiRequest } from '@/lib/api';
import { MEMBERSHIP_TIERS } from '@/lib/membership-tiers';

export async function fetchMembershipTiers() {
  const data = await apiRequest('/public/loyalty/membership-tiers', { method: 'GET' });
  const tiers = Array.isArray(data?.tiers) ? data.tiers : [];
  return tiers.length ? tiers.map(mapApiTierToMembershipTier) : MEMBERSHIP_TIERS;
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
    benefits: Array.isArray(tier.benefits) ? tier.benefits : [],
  };
}
