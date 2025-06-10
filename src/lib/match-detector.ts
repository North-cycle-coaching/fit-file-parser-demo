// src/lib/match-detector.ts

export type Match = {
  type: 'Anaerobic' | 'Glycolytic' | 'VO2max' | 'Threshold';
  startIndex: number;
  endIndex: number;
  duration: number;
  avgPower: number;
};

const MATCH_TYPES = [
  { type: 'Anaerobic', threshold: 1.18, minDuration: 60 },
  { type: 'Glycolytic', threshold: 1.15, minDuration: 90 },
  { type: 'VO2max', threshold: 1.10, minDuration: 180 },
  { type: 'Threshold', threshold: 1.07, minDuration: 300 },
];

export function detectMatches(power: number[], cp: number): Match[] {
  const matches: Match[] = [];

  for (const matchType of MATCH_TYPES) {
    const { type, threshold, minDuration } = matchType;
    const zone = cp * threshold;

    let inMatch = false;
    let start = 0;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < power.length; i++) {
      if (power[i] >= zone) {
        if (!inMatch) {
          inMatch = true;
          start = i;
          sum = power[i];
          count = 1;
        } else {
          sum += power[i];
          count++;
        }
      } else {
        if (inMatch) {
          inMatch = false;
          const duration = count;
          const avgPower = sum / count;
          if (duration >= minDuration && avgPower >= zone) {
            matches.push({
              type,
              startIndex: start,
              endIndex: i - 1,
              duration,
              avgPower,
            });
          }
        }
      }
    }

    // Handle match that ends at the final index
    if (inMatch) {
      const duration = count;
      const avgPower = sum / count;
      if (duration >= minDuration && avgPower >= zone) {
        matches.push({
          type,
          startIndex: start,
          endIndex: power.length - 1,
          duration,
          avgPower,
        });
      }
    }
  }

  return matches;
}
