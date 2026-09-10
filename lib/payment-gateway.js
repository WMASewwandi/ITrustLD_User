import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

export async function claimPaymentGateway(token) {
  return apiRequest('/user/partner-pay/claim', {
    method: 'POST',
    token: getUserToken(),
    body: { token },
  });
}

export async function previewPaymentGateway(token) {
  const params = new URLSearchParams({ token: String(token || '') });
  return apiRequest(`/partner-pay/checkout-preview?${params.toString()}`, { method: 'GET' });
}

export async function fetchPendingPartnerReturn() {
  return apiRequest('/user/partner-pay/pending-return', {
    method: 'GET',
    token: getUserToken(),
  });
}

export function buildPartnerReturnUrl(returnUrl, { type, referenceId, status, amount, currency }) {
  if (!returnUrl) return '';
  try {
    const next = new URL(returnUrl);
    if (type) next.searchParams.set('type', type);
    if (referenceId) next.searchParams.set('reference_id', referenceId);
    if (status) next.searchParams.set('status', status);
    if (amount != null) next.searchParams.set('amount', String(amount));
    if (currency) next.searchParams.set('currency', currency);
    return next.toString();
  } catch {
    return returnUrl;
  }
}
