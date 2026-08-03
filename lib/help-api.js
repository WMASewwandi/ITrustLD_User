import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

export async function submitHelpTicket(payload) {
  const token = getUserToken();
  return apiRequest('/public/help-tickets', {
    method: 'POST',
    body: payload,
    token: token || undefined,
  });
}
