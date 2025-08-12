
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// src/api/bugs/getPocsArchive.js
function parseFilename(disposition) {
  if (!disposition) return null;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (star?.[1]) return decodeURIComponent(star[1]);
  const quoted = /filename="([^"]+)"/i.exec(disposition);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(disposition);
  if (plain?.[1]) return plain[1].trim();
  return null;
}

export async function getPocsArchive(projectId) {

    const params = new URLSearchParams({ projectId  });
    const basePath = "/api/projects/pocs-archive"

  const res = await fetch(`${BASE_URL}${basePath}?${params.toString()}`, {
    method: 'GET',
    credentials: 'include', // keep if you use cookie-based auth
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const fallback = (res.headers.get('x-archive-fallback') || '').toLowerCase();
  const suggested = parseFilename(res.headers.get('content-disposition'));
  const ext = fallback === 'zip' || contentType.includes('zip') ? 'zip' : 'rar';
  const filename = suggested || `verified-pocs.${ext}`;

  const blob = await res.blob();
  return { blob, filename };
}
