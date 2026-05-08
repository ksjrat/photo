export const SCORE_WEIGHTS = {
  horizon: 0.3,
  framingX: 0.2,
  framingY: 0.1,
  poseShoulder: 0.2,
  poseTorso: 0.2
} as const;

export const THRESHOLDS = {
  horizonTiltWarnDeg: 4,
  horizonTiltCriticalDeg: 8,
  framingWarnOffset: 0.12,
  framingCriticalOffset: 0.22,
  shoulderTiltWarnDeg: 5,
  shoulderTiltCriticalDeg: 10,
  torsoLeanWarnDeg: 8,
  torsoLeanCriticalDeg: 14,
  distanceNear: 0.34,
  distanceFar: 0.18
} as const;

export const TARGET_FPS = 12;
