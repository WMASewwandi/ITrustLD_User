import { apiRequest } from '@/lib/api';

export async function fetchActivePromotionalBanners({
  audience = 'normal',
  displayType = 'all',
} = {}) {
  const params = new URLSearchParams();
  if (audience) params.set('audience', audience);
  if (displayType) params.set('display_type', displayType);

  const query = params.toString();
  const data = await apiRequest(`/public/promotional-banners${query ? `?${query}` : ''}`, {
    method: 'GET',
  });

  return Array.isArray(data?.banners) ? data.banners : [];
}
