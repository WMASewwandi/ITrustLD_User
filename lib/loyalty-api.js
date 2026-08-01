import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';
import { paymentOptionNameToAccountType } from '@/lib/payment-accounts';

function withToken(options = {}) {
  return { ...options, token: getUserToken() };
}

export async function fetchLoyaltySummary() {
  return apiRequest('/user/loyalty/summary', withToken());
}

export async function fetchPartnerClients(params = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('per_page', String(params.perPage));
  if (params.search) search.set('keyword', params.search);
  const qs = search.toString();
  return apiRequest(`/user/loyalty/clients${qs ? `?${qs}` : ''}`, withToken());
}

export async function fetchSubPartnerClients(params = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('per_page', String(params.perPage));
  if (params.search) search.set('keyword', params.search);
  const qs = search.toString();
  return apiRequest(`/user/loyalty/sub-partners${qs ? `?${qs}` : ''}`, withToken());
}

export function mapAffiliateClientRows(rows = []) {
  return rows.map((row) => ({
    id: row.id,
    accountId: row.accountId || row.account_id,
    isPartner: Boolean(row.isPartner ?? row.is_partner),
    firstTransaction: row.firstTransaction || row.first_transaction || '—',
    lastTransaction: row.lastTransaction || row.last_transaction || '—',
    points: row.points || '0.00',
    pointsRaw: Number(row.points_raw ?? row.points ?? 0),
  }));
}

export async function fetchLoyaltyWithdrawals(params = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('per_page', String(params.perPage));
  if (params.status && params.status !== 'All Statuses') search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  if (params.from) search.set('from_date', params.from);
  if (params.to) search.set('to_date', params.to);
  const qs = search.toString();
  return apiRequest(`/user/loyalty/withdrawals${qs ? `?${qs}` : ''}`, withToken());
}

export async function createLoyaltyWithdrawal({
  withdrawal_point_amount,
  selected_account_id,
  selected_account_type,
}) {
  return apiRequest(
    '/user/loyalty/withdrawals',
    withToken({
      method: 'POST',
      body: {
        withdrawal_point_amount,
        selected_account_id,
        selected_account_type,
      },
    }),
  );
}

export function encodeReceivingAccountOption(account, paymentOption) {
  const accountType = paymentOptionNameToAccountType(paymentOption || account.accountType);
  return `${accountType}:${account.id}`;
}

export function decodeReceivingAccountOption(value) {
  const [accountType, accountId] = String(value || '').split(':');
  return { accountType, accountId };
}

export function flattenAccountGroups(accountGroups = []) {
  const options = [];
  for (const group of accountGroups) {
    const paymentOption = group.payment_option;
    for (const account of group.accounts || []) {
      options.push({
        value: encodeReceivingAccountOption(account, paymentOption),
        label: account.display || `${paymentOption} — ${account.id}`,
        accountId: account.id,
        accountType: paymentOptionNameToAccountType(paymentOption || account.accountType),
      });
    }
  }
  return options;
}

export function mapWithdrawalRows(rows = []) {
  return rows.map((row) => ({
    id: row.id,
    points: row.points_display || Number(row.points || 0).toLocaleString(),
    amount: row.amount || `USD ${Number(row.cashout_amount || 0).toFixed(2)}`,
    date: row.date || row.datetime?.slice(0, 10) || '',
    status: row.status || 'Pending',
  }));
}
