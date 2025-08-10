// utils/summaryCollectEligibleComponents.js

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getAllIdsFromData(data) {
  const ids = [];
  for (const [k, arr] of Object.entries(data || {})) {
    if (k.startsWith('pf') && Array.isArray(arr)) {
      for (const item of arr) {
        const id = String(item?.id ?? '').trim();
        if (id) ids.push(id);
      }
    }
  }
  return ids;
}

/**
 * If `groupOrExactId` is like "4.1" → match any id that starts with "4.1."
 * If it's full like "4.1.1" → match exact id.
 * Returns true if a match is found (meaning: should auto-Fail).
 */
export function summaryCollectEligibleComponents(data, _unused, groupOrExactId) {
  if (!groupOrExactId) return false;

  const allIds = getAllIdsFromData(data);
  const needle = String(groupOrExactId).trim();

  // full id (has a dot after the minor -> e.g., 4.1.1)
  const isFull = /^\d+\.\d+\.\d+$/.test(needle);

  if (isFull) {
    return allIds.some(id => id === needle);
  }

  // group id like "4.1", "4.11", etc. → match "4.1." prefix with dot boundary
  const re = new RegExp(`^${escapeRe(needle)}\\.`);
  return allIds.some(id => re.test(String(id)));
}
