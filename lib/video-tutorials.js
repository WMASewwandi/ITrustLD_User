import { apiRequest } from '@/lib/api';

export async function fetchActiveVideoTutorials() {
  const data = await apiRequest('/public/video-tutorials', { method: 'GET' });
  return Array.isArray(data?.tutorials) ? data.tutorials : [];
}
