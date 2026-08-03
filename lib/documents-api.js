import { apiRequest } from '@/lib/api';
import { getUserToken } from '@/lib/auth';

function withToken(options = {}) {
  return { ...options, token: getUserToken() };
}

export async function fetchVerificationDocuments() {
  return apiRequest('/user/documents', withToken());
}

export function mapDocumentRows(rows = []) {
  return rows.map((row) => ({
    id: row.id || row.key,
    key: row.key || row.id,
    name: row.name,
    type: row.type,
    documentType: row.document_type || row.documentType || '—',
    status: row.status || 'Pending',
    updated: row.updated || '—',
    reason: row.reason || null,
  }));
}
