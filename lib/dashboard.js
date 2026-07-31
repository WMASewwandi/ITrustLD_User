import { apiRequest } from '@/lib/api';
import { getUserToken, updateUserSession } from '@/lib/auth';

export const DASHBOARD_UPDATED_EVENT = 'itrustld-dashboard-updated';

export async function fetchDashboard() {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }

  const data = await apiRequest('/user/dashboard', { method: 'GET', token });
  if (data?.user) {
    updateUserSession(data.user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATED_EVENT, { detail: data }));
    }
  }
  return data;
}

export async function fetchPublishedBlogPosts() {
  const data = await apiRequest('/public/blogs', { method: 'GET' });
  return Array.isArray(data?.posts) ? data.posts : [];
}

export function deriveNotificationsFromUser(user) {
  if (!user) return [];
  const items = [];
  let id = 1;

  const pendingDeposits = Number(user.pending_deposits_count) || 0;
  const pendingWithdrawals = Number(user.pending_withdrawals_count) || 0;

  if (pendingDeposits > 0) {
    items.push({
      id: id++,
      title: 'Top-up pending',
      body:
        pendingDeposits === 1
          ? 'Your top-up request is being reviewed.'
          : `${pendingDeposits} top-up requests are being reviewed.`,
      time: 'Recently',
    });
  }

  if (pendingWithdrawals > 0) {
    items.push({
      id: id++,
      title: 'Cash-out pending',
      body:
        pendingWithdrawals === 1
          ? 'Your cash-out request is being reviewed.'
          : `${pendingWithdrawals} cash-out requests are being reviewed.`,
      time: 'Recently',
    });
  }

  return items;
}
