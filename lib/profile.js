import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

function authOptions(method, body) {
  const token = getUserToken();
  if (!token) {
    const error = new Error('Not signed in.');
    error.status = 401;
    throw error;
  }
  return {
    method,
    token,
    ...(body !== undefined ? { body } : {}),
  };
}

export async function fetchUserProfile() {
  return apiRequest('/user/profile', authOptions('GET'));
}

export async function updateUserProfile(payload) {
  return apiRequest('/user/profile', authOptions('PUT', payload));
}

export function isProfileFullyVerified(profile) {
  return Boolean(profile?.is_fully_verified);
}

export function formatProfileLanguage(language) {
  const value = String(language || '').trim();
  if (!value) return '—';
  if (value.toLowerCase() === 'english') return 'English';
  if (value.toLowerCase() === 'sinhala') return 'Sinhala';
  if (value.toLowerCase() === 'tamil') return 'Tamil';
  return value;
}

export {
  ALL_COUNTRIES,
  buildInternationalNumber,
  findCountryByIso,
  findCountryByName,
  isValidEmail,
  isValidInternationalPhone,
  parseStoredMobileNumber as parseProfileMobileNumber,
} from '@/lib/countries';
