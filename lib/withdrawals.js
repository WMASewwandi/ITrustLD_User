import { apiFormRequest, apiRequest, getApiBaseUrl } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

export const MAX_PENDING_PER_METHOD = 5;

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

export function isPendingMethodLimitError(error) {
  return error?.data?.code === 'PENDING_METHOD_LIMIT';
}

export function getMethodPendingCount(methods, methodId) {
  const match = (Array.isArray(methods) ? methods : []).find(
    (method) => Number(method.id) === Number(methodId),
  );
  return Number(match?.pendingCount) || 0;
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

export async function downloadWithdrawalTransactionsExport(params = {}) {
  const token = getUserToken();
  const query = buildWithdrawalTransactionsQuery(params);
  const response = await fetch(
    `${getApiBaseUrl()}/user/withdrawals/export${query ? `?${query}` : ''}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    },
  );
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

export function cashoutAccountFormatHint(methodName) {
  const name = String(methodName || '').trim().toLowerCase();
  if (name === 'xm') return 'Account ID must be between 7 and 9 characters long.';
  if (name === 'skrill' || name === 'neteller' || name === 'binance' || name === 'crypto') {
    return 'Please enter a valid email address.';
  }
  if (name === 'perfect money') return 'Account ID must start with "U" followed by 8 digits.';
  return 'Enter your platform account ID.';
}

export function parseMoneyInput(value) {
  const normalized = String(value ?? "").replace(/[,\s]/g, "").trim();
  if (!normalized) return 0;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function toPositiveRate(rate) {
  const n = Number(rate);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function multiplyAndRound(a, b) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return 0;
  return Math.round((x * y + Number.EPSILON) * 100) / 100;
}

export function divideAndRound(a, b) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y) || y === 0) return 0;
  return Math.round((x / y + Number.EPSILON) * 100) / 100;
}

export function defaultAllowedPaymentOptionId(paymentOptions, priorityPaymentOptionId) {
  const options = Array.isArray(paymentOptions) ? paymentOptions : [];
  const priorityId = Number(priorityPaymentOptionId);
  if (Number.isInteger(priorityId) && priorityId > 0) {
    const allowed = options.find((option) => Number(option.id) === priorityId);
    if (allowed) return Number(allowed.id);
  }
  const first = options[0];
  return first?.id != null ? Number(first.id) : null;
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
