import { apiFormRequest, apiRequest, getApiBaseUrl } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

export const MAX_PENDING_PER_METHOD = 5;

function authOptions(extra = {}) {
  const token = getUserToken();
  return { token, ...extra };
}

export async function fetchDepositBootstrap() {
  return apiRequest('/user/deposits/bootstrap', authOptions());
}

export async function fetchDepositMethodDetails({
  topupMethodId,
  depositAmount,
  depositAmountCurrency = 'USD',
}) {
  const params = new URLSearchParams({
    topupMethodId: String(topupMethodId),
    depositAmount: String(depositAmount ?? ''),
    depositAmountCurrency,
  });
  return apiRequest(`/user/deposits/method-details?${params.toString()}`, authOptions());
}

export async function createDeposit(payload) {
  return apiRequest('/user/deposits', {
    ...authOptions(),
    method: 'POST',
    body: payload,
  });
}

export const GIFT_VOUCHER_PLATFORM_REUSE_CODE = 'GIFT_VOUCHER_PLATFORM_REUSE';
export const GIFT_VOUCHER_PLATFORM_REUSE_MESSAGE =
  'This Platform ID was already used for a gift voucher deposit in the last 30 days. Please use a different Platform ID.';
export const GIFT_VOUCHER_COOLDOWN_CODE = 'GIFT_VOUCHER_COOLDOWN';

export function giftVoucherCooldownMessage(remainingDays = 30) {
  const days = Math.max(1, Number(remainingDays) || 30);
  const label = days === 1 ? '1 day' : `${days} days`;
  return `You already claimed a gift voucher. Please wait ${label} before using this option.`;
}

export const GIFT_VOUCHER_COOLDOWN_MESSAGE = giftVoucherCooldownMessage(30);

export function isGiftVoucherPaymentOption(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '') === 'giftvoucher';
}

export function isGiftVoucherPlatformReuseError(error) {
  return error?.data?.code === GIFT_VOUCHER_PLATFORM_REUSE_CODE;
}

export function isGiftVoucherCooldownError(error) {
  return error?.data?.code === GIFT_VOUCHER_COOLDOWN_CODE;
}

export async function checkGiftVoucherPlatformReuse({ paymentOptionId, topupAccountId }) {
  const params = new URLSearchParams({
    payment_option_id: String(paymentOptionId ?? ''),
    topup_account_id: String(topupAccountId ?? ''),
  });
  return apiRequest(`/user/deposits/platform-check?${params.toString()}`, authOptions());
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

export async function fetchDepositPaymentProofContext(depositId) {
  return apiRequest(`/user/deposits/${depositId}/payment-proof`, authOptions());
}

export async function uploadDepositProof(depositId, file) {
  const formData = new FormData();
  formData.append('payment_proof', file);
  return apiFormRequest(`/user/deposits/${depositId}/proof`, {
    ...authOptions(),
    formData,
  });
}

function buildDepositTransactionsQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && String(value).trim() !== '') {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

export async function fetchDepositTransactions(params = {}) {
  const query = buildDepositTransactionsQuery(params);
  return apiRequest(`/user/deposits/transactions${query ? `?${query}` : ''}`, authOptions());
}

export async function fetchDepositTransaction(transactionId) {
  return apiRequest(`/user/deposits/transactions/${encodeURIComponent(transactionId)}`, authOptions());
}

export async function fetchDepositTransactionsForPrint(params = {}) {
  const query = buildDepositTransactionsQuery(params);
  return apiRequest(`/user/deposits/transactions/print${query ? `?${query}` : ''}`, authOptions());
}

export async function downloadDepositTransactionsExport(params = {}) {
  const token = getUserToken();
  const query = buildDepositTransactionsQuery(params);
  const response = await fetch(
    `${getApiBaseUrl()}/user/deposits/export${query ? `?${query}` : ''}`,
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
  const filename = match?.[1] || 'deposit-transactions.csv';
  return { blob, filename };
}

export function criteriaToFilterTemplate(criteria) {
  switch (criteria) {
    case 'Weekly':
      return 'LAST_7_DAYS';
    case 'Monthly':
      return 'LAST_MONTH';
    case 'Custom':
      return 'CUSTOM';
    default:
      return '';
  }
}

export function topupMethodIconKey(name) {
  const value = String(name || '').trim().toLowerCase();
  if (value.includes('xm')) return 'xm';
  if (value.includes('skrill')) return 'skrill';
  if (value.includes('neteller')) return 'neteller';
  if (value.includes('perfect')) return 'pm';
  if (value.includes('binance') || value.includes('crypto') || value.includes('usdt')) return 'usdt';
  if (value.includes('bank')) return 'bank';
  return 'bank';
}

export function topupAccountPlaceholder(methodName) {
  const value = String(methodName || '').trim().toLowerCase();
  if (value === 'xm') return 'Your XM Account';
  if (value === 'skrill') return 'Your Skrill Email';
  if (value === 'neteller') return 'Your Neteller Email';
  if (value === 'binance') return 'Your Binance Email';
  if (value === 'perfect money') return 'U12345678';
  return 'Your Account ID';
}

export function topupAccountFormatHint(methodName) {
  const name = String(methodName || '').trim().toLowerCase();
  if (name === 'xm') return 'Account ID must be between 7 and 9 characters long.';
  if (name === 'skrill' || name === 'neteller' || name === 'binance') {
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

export function findDepositRate(depositRates, topupMethodId, paymentOptionId) {
  return (
    depositRates?.find(
      (rate) =>
        Number(rate.topupMethodId) === Number(topupMethodId) &&
        Number(rate.paymentOptionId) === Number(paymentOptionId),
    ) || null
  );
}

export function validateTopupAccountId(methodName, accountId) {
  const value = String(accountId || '').trim();
  const name = String(methodName || '').trim().toLowerCase();

  if (!value) return 'Top-up account ID is required.';

  if (name === 'xm') {
    if (value.length < 7 || value.length > 9) {
      return 'Account ID must be between 7 and 9 characters long.';
    }
    return null;
  }

  if (name === 'skrill' || name === 'neteller' || name === 'binance') {
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
