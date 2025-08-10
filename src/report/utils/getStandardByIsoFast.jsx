import { standard } from "../components/tables/standars";
const byIso = standard.mappings.reduce((acc, m) => {
  acc[m.iso_15408_component.toUpperCase()] = m;
  return acc;
}, {});

export const getStandardByIsoFast = (iso) =>
  byIso[String(iso).trim().toUpperCase()] ?? null;

// usage:
// const item = getStandardByIsoFast('FCS-TLSS_EXT');
