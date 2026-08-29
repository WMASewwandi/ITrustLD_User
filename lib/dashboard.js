import { apiRequest } from '@/lib/api';
import { getUserToken, updateUserSession } from '@/lib/auth';

export const DASHBOARD_UPDATED_EVENT = 'itrustld-dashboard-updated';

const DASHBOARD_TTL_MS = 15_000;
let dashboardCache = { data: null, at: 0, promise: null, token: null };

export async function fetchDashboard({ force = false } = {}) {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }

  if (dashboardCache.token !== token) {
    dashboardCache = { data: null, at: 0, promise: null, token };
  }

  const now = Date.now();
  if (!force && dashboardCache.data && now - dashboardCache.at < DASHBOARD_TTL_MS) {
    return dashboardCache.data;
  }
  if (!force && dashboardCache.promise) {
    return dashboardCache.promise;
  }

  const request = apiRequest('/user/dashboard', { method: 'GET', token })
    .then((data) => {
      if (data?.user) {
        updateUserSession(data.user);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATED_EVENT, { detail: data }));
        }
      }
      dashboardCache = { data, at: Date.now(), promise: null, token };
      return data;
    })
    .catch((error) => {
      dashboardCache.promise = null;
      throw error;
    });

  dashboardCache.promise = request;
  return request;
}

export async function fetchPublishedBlogPosts() {
  const data = await apiRequest('/public/blogs', { method: 'GET' });
  return Array.isArray(data?.posts) ? data.posts : [];
}

export function deriveNotificationsFromUser(user) {
  if (!user) return [];
  const items = [];
  let id = 1;

  const pendingDepositIds = Array.isArray(user.pending_deposit_ids)
    ? user.pending_deposit_ids.map(String).filter(Boolean)
    : [];
  const pendingWithdrawalIds = Array.isArray(user.pending_withdrawal_ids)
    ? user.pending_withdrawal_ids.map(String).filter(Boolean)
    : [];
  const pendingDeposits = pendingDepositIds.length || Number(user.pending_deposits_count) || 0;
  const pendingWithdrawals =
    pendingWithdrawalIds.length || Number(user.pending_withdrawals_count) || 0;

  if (pendingDepositIds.length > 0) {
    for (const transactionId of pendingDepositIds) {
      items.push({
        id: id++,
        title: 'Top-up pending',
        body: `Your top-up request #${transactionId} is being reviewed.`,
        time: 'Recently',
        transaction_id: transactionId,
      });
    }
  } else if (pendingDeposits > 0) {
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

  if (pendingWithdrawalIds.length > 0) {
    for (const transactionId of pendingWithdrawalIds) {
      items.push({
        id: id++,
        title: 'Cash-out pending',
        body: `Your cash-out request #${transactionId} is being reviewed.`,
        time: 'Recently',
        transaction_id: transactionId,
      });
    }
  } else if (pendingWithdrawals > 0) {
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
