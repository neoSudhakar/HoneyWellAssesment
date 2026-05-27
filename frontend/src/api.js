const API_BASE = '/api';

export async function fetchMovements({ from, to, type, warehouse }) {
  const search = new URLSearchParams({ from, to });
  if (type && type !== 'ALL') {
    search.set('type', type);
  }
  if (warehouse) {
    search.set('warehouse', warehouse);
  }

  const response = await fetch(`${API_BASE}/movements?${search}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Failed to load movements');
  }
  return response.json();
}

export async function verifyFile(file, sha256) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sha256', sha256);

  const response = await fetch(`${API_BASE}/verify-file`, {
    method: 'POST',
    body: formData,
  });

  const body = await response.json();
  if (!response.ok) {
    return { valid: false, message: body.message ?? 'Verification failed', movements: null };
  }
  return body;
}
