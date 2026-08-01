import { apiFormRequest, apiRequest, getApiBaseUrl } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

function authOptions(extra = {}) {
  const token = getUserToken();
  return { token, ...extra };
}

export async function fetchWithdrawalBootstrap() {
  return apiRequest('/user/withdrawals/bootstrap', authOptions());
}

export async function fetchWithdrawalMethodDetails({
  cashoutMethodId,
  cashoutAmount,
  cashoutAmountCurrency = 'USD',
}) {
  const params = new URLSearchParams({
    cashoutMethodId: String(cashoutMethodId),
    cashoutAmount: String(cashoutAmount ?? ''),
    cashoutAmountCurrency,
  });
  return apiRequest(`/user/withdrawals/method-details?${params.toString()}`, authOptions());
}

export async function createWithdrawal(payload) {
  return apiRequest('/user/withdrawals', {
    ...authOptions(),
    method: 'POST',
    body: payload,
  });
}

export async function fetchWithdrawalPaymentProofContext(withdrawalId) {
  return apiRequest(`/user/withdrawals/${withdrawalId}/payment-proof`, authOptions());
}

export async function uploadWithdrawalProof(withdrawalId, file, { selectedAccountType, selectedAccountId }) {
  const formData = new FormData();
  formData.append('payment_proof', file);
  formData.append('selected_account_type', selectedAccountType);
  formData.append('selected_account_id', String(selectedAccountId));
  return apiFormRequest(`/user/withdrawals/${withdrawalId}/proof`, {
    ...authOptions(),
    formData,
  });
}

function buildWithdrawalTransactionsQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && String(value).trim() !== '') {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

export async function fetchWithdrawalTransactions(params = {}) {
  const query = buildWithdrawalTransactionsQuery(params);
  return apiRequest(`/user/withdrawals/transactions${query ? `?${query}` : ''}`, authOptions());
}

export async function fetchWithdrawalTransaction(transactionId) {
  return apiRequest(
    `/user/withdrawals/transactions/${encodeURIComponent(transactionId)}`,
    authOptions(),
  );
}

export async function fetchWithdrawalTransactionsForPrint(params = {}) {
  const query = buildWithdrawalTransactionsQuery(params);
  return apiRequest(`/user/withdrawals/transactions/print${query ? `?${query}` : ''}`, authOptions());
}

export async function downloadWithdrawalTransactionsExport() {
  const token = getUserToken();
  const response = await fetch(`${getApiBaseUrl()}/user/withdrawals/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!response.ok) {
    let message = `Export failed (${response.status})`;
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || 'withdrawal-transactions.csv';
  return { blob, filename };
}

export { criteriaToFilterTemplate } from '@/lib/deposits';

export function cashoutMethodIconKey(name) {
  const value = String(name || '').trim().toLowerCase();
  if (value.includes('xm')) return 'xm';
  if (value.includes('re top') || value.includes('redeposit') || value.includes('re top-up')) {
    return 'redeposit';
  }
  if (value.includes('skrill')) return 'skrill';
  if (value.includes('neteller')) return 'neteller';
  if (value.includes('perfect')) return 'pm';
  if (value.includes('binance') || value.includes('crypto') || value.includes('usdt')) return 'usdt';
  if (value.includes('bank')) return 'bank';
  return 'bank';
}

export function cashoutAccountPlaceholder(methodName) {
  const value = String(methodName || '').trim().toLowerCase();
  if (value === 'xm') return 'Your XM Account';
  if (value === 'skrill') return 'Your Skrill Email';
  if (value === 'neteller') return 'Your Neteller Email';
  if (value === 'binance' || value === 'crypto') return 'Your Binance Email';
  if (value === 'perfect money') return 'U12345678';
  return 'Your Account ID';
}

export function multiplyAndRound(a, b) {
  return Math.round((a * b + Number.EPSILON) * 100) / 100;
}

export function divideAndRound(a, b) {
  if (!b) return 0;
  return Math.round((a / b + Number.EPSILON) * 100) / 100;
}

export function findWithdrawalRate(withdrawalRates, cashoutMethodId, paymentOptionId) {
  return (
    withdrawalRates?.find(
      (rate) =>
        Number(rate.cashoutMethodId) === Number(cashoutMethodId) &&
        Number(rate.paymentOptionId) === Number(paymentOptionId),
    ) || null
  );
}

export function validateCashoutAccountId(methodName, accountId) {
  const value = String(accountId || '').trim();
  const name = String(methodName || '').trim().toLowerCase();

  if (!value) return 'Cash-out account ID is required.';

  if (name === 'xm') {
    if (value.length < 7 || value.length > 9) {
      return 'Account ID must be between 7 and 9 characters long.';
    }
    return null;
  }

  if (name === 'skrill' || name === 'neteller' || name === 'binance' || name === 'crypto') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address.';
    }
    return null;
  }

  if (name === 'perfect money') {
    if (!/^U\d{8}$/.test(value)) {
      return 'Account ID must start with "U" followed by 8 digits.';
    }
    return null;
  }

  return null;
}
