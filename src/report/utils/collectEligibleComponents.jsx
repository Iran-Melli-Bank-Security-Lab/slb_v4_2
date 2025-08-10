// utils/collectEligibleComponents.js
import { getStandardByIsoFast } from "./getStandardByIsoFast";

export const matchItemById = (item, idsInData) => {
  if (!item) return false;
  return idsInData.has(String(item.id));
};

export const getAllIdsOfData = (data) => {
  const idsInData = new Set();
  for (const [key, arr] of Object.entries(data || {})) {
    if (key.startsWith('pf') && Array.isArray(arr)) {
      for (const it of arr) {
        const id = String(it?.id ?? '').trim();
        if (id) idsInData.add(id);
      }
    }
  }
  return idsInData;
};

export const collectEligibleComponents = (data, _standard, label) => {
  const idsInData = getAllIdsOfData(data);
  const item = getStandardByIsoFast(label); // object for that ISO
  return matchItemById(item, idsInData);    // true only if item.id is present
};
