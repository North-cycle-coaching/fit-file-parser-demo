// fallback.ts
// Utility to recursively scan parsed .fit JSON data and return best-matching record array

export type FitRecordCandidate = {
  path: string;
  records: any[];
};

export function findBestRecordArray(obj: any, minLength: number = 100): FitRecordCandidate | null {
  const seen = new Set();
  const candidates: FitRecordCandidate[] = [];

  function recurse(current: any, path: string = '') {
    if (!current || typeof current !== 'object' || seen.has(current)) return;
    seen.add(current);

    for (const key in current) {
      const value = current[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (first && typeof first === 'object') {
          const hasTimestamp = 'timestamp' in first;
          const hasCoreField = ['power', 'heart_rate', 'cadence', 'altitude', 'position_lat'].some(k => k in first);

          if (hasTimestamp && hasCoreField) {
            candidates.push({ path: currentPath, records: value });
          }
        }
      }

      if (typeof value === 'object') {
        recurse(value, currentPath);
      }
    }
  }

  recurse(obj);

  if (candidates.length === 0) return null;

  // Return the longest valid candidate
  return candidates.reduce((best, current) => {
    return current.records.length > best.records.length ? current : best;
  }, candidates[0]);
}
