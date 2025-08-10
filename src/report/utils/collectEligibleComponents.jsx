// utils/collectEligibleComponents.js
export const collectEligibleComponents = (data, standard) => {
  if (!data || typeof data !== 'object') return new Set();

  // همه idهای موجود در pf*‌های دیتا
  const idsInData = new Set();
  for (const [key, arr] of Object.entries(data)) {

    if (key.startsWith('pf') && Array.isArray(arr)) {
      for (const item of arr) {
        const id = String(item?.id || '').trim();

        if (id) idsInData.add(id);
      }
    }
  }

  

  // فقط ISOهایی که idشان در دیتا هم وجود دارد
  // const eligible = new Set();
  for (const m of (standard?.mappings || [])) {
    const stdId = String(m?.id || '').trim();
    // const iso   = String(m?.iso_15408_component || '').trim().toUpperCase();
    if (stdId  && idsInData.has(stdId)) {
      return true 
    }
  }
return false 
  
};
