import { apiRequest, apiFormRequest } from '@/lib/api';

const TOKEN_KEY = 'itrustld_user_token';
const USER_KEY = 'itrustld_user';

export function getUserToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUserSession() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** @deprecated Use getUserSession — kept for existing dashboard imports */
export function getStoredUser() {
  return getUserSession();
}

export function setUserSession({ token, user }) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateUserSession(user) {
  const token = getUserToken();
  if (!token) return;
  setUserSession({ token, user });
}

export function clearUserSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function hasUserSession() {
  return Boolean(getUserToken());
}

export function userNeedsVerification(user) {
  const ah = user?.account_holder;
  if (!ah) return true;
  return (
    ah.email_verification !== 'VERIFIED' ||
    ah.mobile_number_verification !== 'VERIFIED' ||
    ah.identity_verification !== 'VERIFIED' ||
    ah.address_verification !== 'VERIFIED'
  );
}

export function isUserBanned(user) {
  return user?.account_holder?.account_status === 'BANNED';
}

export function isPartnerUser(user) {
  return user?.account_holder?.is_patner === 'YES';
}

export function getUserAffiliateCode(user) {
  return user?.account_holder?.affiliate_code || user?.affiliate_code || null;
}

export function patchUserSessionAccountHolder(patch = {}) {
  const session = getUserSession();
  const token = getUserToken();
  if (!session || !token) return;
  session.account_holder = { ...(session.account_holder || {}), ...patch };
  setUserSession({ token, user: session });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
}

export async function loginUser(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function checkEmailAvailable(email) {
  return apiRequest('/auth/check-email', {
    method: 'POST',
    body: { email },
  });
}

export async function checkMobileAvailable(mobile_number) {
  return apiRequest('/auth/check-mobile', {
    method: 'POST',
    body: { mobile_number },
  });
}

export async function fetchAuthConfig() {
  return apiRequest('/auth/config', { method: 'GET' });
}

export async function requestPasswordReset(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword(payload) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchUserMe() {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }
  return apiRequest('/auth/me', { method: 'GET', token });
}

export async function logoutUser() {
  const token = getUserToken();
  if (token) {
    try {
      await apiRequest('/auth/logout', { method: 'POST', token });
    } catch {
      // Clear local session even if API call fails.
    }
  }
  clearUserSession();
}

export async function fetchVerificationStatus() {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }
  return apiRequest('/auth/verification/status', { method: 'GET', token });
}

export async function sendVerificationEmail(email) {
  const token = getUserToken();
  return apiRequest('/auth/verification/send-email', {
    method: 'POST',
    token,
    body: { email },
  });
}

export async function verifyEmailCode(email, verification_code) {
  const token = getUserToken();
  const result = await apiRequest('/auth/verification/verify-email', {
    method: 'POST',
    token,
    body: { email, verification_code },
  });
  if (result.user) updateUserSession(result.user);
  return result;
}

export async function sendVerificationSms(mobile_number) {
  const token = getUserToken();
  return apiRequest('/auth/verification/send-sms', {
    method: 'POST',
    token,
    body: { mobile_number },
  });
}

export async function verifyMobileCode(mobile_number, verification_code) {
  const token = getUserToken();
  const result = await apiRequest('/auth/verification/verify-mobile', {
    method: 'POST',
    token,
    body: { mobile_number, verification_code },
  });
  if (result.user) updateUserSession(result.user);
  return result;
}

export async function uploadVerificationDocuments({
  identity_document_type,
  address_document_type,
  identity_document,
  identity_document_back,
  address_document,
}) {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }

  const formData = new FormData();
  if (identity_document_type) {
    formData.append('identity_document_type', identity_document_type);
  }
  if (address_document_type) {
    formData.append('address_document_type', address_document_type);
  }
  if (identity_document) {
    formData.append('identity_document', identity_document);
  }
  if (identity_document_back) {
    formData.append('identity_document_back', identity_document_back);
  }
  if (address_document) {
    formData.append('address_document', address_document);
  }

  const result = await apiFormRequest('/auth/verification/documents', {
    method: 'POST',
    token,
    formData,
  });
  if (result.user) updateUserSession(result.user);
  return result;
}
