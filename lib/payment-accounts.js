import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

function authOptions(extra = {}) {
  const token = getUserToken();
  return { token, ...extra };
}

export async function fetchPaymentAccounts() {
  return apiRequest('/user/payment-accounts', authOptions());
}

export async function createPaymentAccount(payload) {
  return apiRequest('/user/payment-accounts', {
    ...authOptions(),
    method: 'POST',
    body: payload,
  });
}

export async function updatePaymentAccount(accountId, payload) {
  return apiRequest(`/user/payment-accounts/${accountId}`, {
    ...authOptions(),
    method: 'PUT',
    body: payload,
  });
}

export async function deletePaymentAccount(accountId, accountType) {
  const params = new URLSearchParams({ account_type: accountType });
  return apiRequest(`/user/payment-accounts/${accountId}?${params.toString()}`, {
    ...authOptions(),
    method: 'DELETE',
  });
}

export const ACCOUNT_TYPE_LABELS = {
  XM: 'XM Account',
  SKRILL: 'Skrill Account',
  NETELLER: 'Neteller Account',
  'PERFECT MONEY': 'Perfect Money',
  'BANK TRANSFER': 'Bank Transfer',
  'CARD PAYMENT': 'Bank Card',
  CRYPTO: 'Crypto Account',
};

export function paymentOptionNameToAccountType(paymentOptionName) {
  const normalized = String(paymentOptionName || '')
    .trim()
    .toUpperCase()
    .replace(/_/g, ' ');
  if (normalized === 'BANK TRANSFER') return 'BANK TRANSFER';
  if (normalized === 'CARD PAYMENT') return 'CARD PAYMENT';
  if (normalized === 'PERFECT MONEY') return 'PERFECT MONEY';
  return normalized;
}

export function accountTypeNeedsBankFields(accountType) {
  const type = paymentOptionNameToAccountType(accountType);
  return type === 'BANK TRANSFER' || type === 'CARD PAYMENT';
}

export function accountTypeFieldConfig(accountType) {
  const type = paymentOptionNameToAccountType(accountType);
  switch (type) {
    case 'XM':
      return {
        primaryLabel: 'XM Account ID',
        primaryName: 'xm_account_id',
        primaryPlaceholder: '12345678',
        primaryInputMode: 'numeric',
      };
    case 'SKRILL':
      return {
        primaryLabel: 'Skrill Email',
        primaryName: 'skrill_email',
        primaryPlaceholder: 'you@example.com',
        primaryType: 'email',
      };
    case 'NETELLER':
      return {
        primaryLabel: 'Neteller Email',
        primaryName: 'neteller_email',
        primaryPlaceholder: 'you@example.com',
        primaryType: 'email',
      };
    case 'PERFECT MONEY':
      return {
        primaryLabel: 'PM Account ID',
        primaryName: 'pm_account_id',
        primaryPlaceholder: 'U12345678',
      };
    case 'CRYPTO':
      return {
        primaryLabel: 'Crypto Wallet / Account ID',
        primaryName: 'crypto_account_id',
        primaryPlaceholder: 'Wallet address or account id',
      };
    case 'BANK TRANSFER':
    case 'CARD PAYMENT':
      return {
        bankFields: true,
      };
    default:
      return {};
  }
}

export function buildCreatePayload(accountType, formData) {
  const type = paymentOptionNameToAccountType(accountType);
  const payload = { account_type: type };

  if (type === 'XM') payload.xm_account_id = formData.xm_account_id;
  if (type === 'SKRILL') payload.skrill_email = formData.skrill_email;
  if (type === 'NETELLER') payload.neteller_email = formData.neteller_email;
  if (type === 'PERFECT MONEY') payload.pm_account_id = formData.pm_account_id;
  if (type === 'CRYPTO') payload.crypto_account_id = formData.crypto_account_id;
  if (type === 'BANK TRANSFER' || type === 'CARD PAYMENT') {
    payload.account_number = formData.account_number;
    payload.beneficiary_name = formData.beneficiary_name;
    payload.bank = formData.bank;
    payload.branch = formData.branch;
  }

  return payload;
}

export function buildUpdatePayload(account) {
  const type = account.accountType;
  const payload = { account_type: type, account_id: account.id };

  if (type === 'XM') payload.xm_account_id = account.xmAccountId;
  if (type === 'SKRILL') payload.skrill_email = account.skrillEmail;
  if (type === 'NETELLER') payload.neteller_email = account.netellerEmail;
  if (type === 'PERFECT MONEY') payload.pm_account_id = account.pmAccountId;
  if (type === 'CRYPTO') payload.crypto_account_id = account.cryptoAccountId;
  if (type === 'BANK TRANSFER' || type === 'CARD PAYMENT') {
    payload.account_number = account.accountNumber;
    payload.beneficiary_name = account.beneficiaryName;
    payload.bank = account.bank;
    payload.branch = account.branch;
  }

  return payload;
}

export function accountTypeHint(accountType) {
  const type = paymentOptionNameToAccountType(accountType);
  switch (type) {
    case 'XM':
      return 'Enter your XM trading account ID (digits only, 7–9 characters).';
    case 'SKRILL':
      return 'Enter the email address registered with your Skrill wallet.';
    case 'NETELLER':
      return 'Enter the email address registered with your Neteller wallet.';
    case 'PERFECT MONEY':
      return 'Enter your Perfect Money account ID (e.g. U12345678).';
    case 'CRYPTO':
      return 'Enter your crypto wallet address or account ID where you want to receive funds.';
    case 'BANK TRANSFER':
      return 'Enter your verified Sri Lankan bank account details for local transfers.';
    case 'CARD PAYMENT':
      return 'Enter the bank card / account details linked for card payouts.';
    default:
      return 'Fill in the account details below, then click Save account.';
  }
}

export function mapCreatedAccountToReceivingOption(paymentOption, accountType) {
  const account = paymentOption?.account;
  if (!account?.id) return null;

  const type = String(accountType || paymentOption?.payment_option || '').trim();
  if (type === 'BANK TRANSFER') {
    return {
      id: account.id,
      accountType: type,
      label: `${account.bank} — ${account.account_number}`,
      accountId: account.account_number,
    };
  }
  if (type === 'XM') {
    return {
      id: account.id,
      accountType: type,
      label: `XM — ${account.xm_account_id}`,
      accountId: account.xm_account_id,
    };
  }
  if (type === 'SKRILL') {
    return {
      id: account.id,
      accountType: type,
      label: `Skrill — ${account.skrill_email}`,
      accountId: account.skrill_email,
    };
  }
  if (type === 'NETELLER') {
    return {
      id: account.id,
      accountType: type,
      label: `Neteller — ${account.neteller_email}`,
      accountId: account.neteller_email,
    };
  }
  if (type === 'PERFECT MONEY') {
    return {
      id: account.id,
      accountType: type,
      label: `Perfect Money — ${account.pm_account_id}`,
      accountId: account.pm_account_id,
    };
  }
  if (type === 'CRYPTO') {
    return {
      id: account.id,
      accountType: type,
      label: `Crypto — ${account.crypto_account_id}`,
      accountId: account.crypto_account_id,
    };
  }
  return null;
}
