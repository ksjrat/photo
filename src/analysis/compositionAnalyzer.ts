import { THRESHOLDS } from "../constants/scoring";
import { CompositionResult, ShotMode } from "../types/feedback";

export interface CompositionInput {
  rollDeg: number;
  subjectCenterX: number;
  subjectCenterY: number;
  subjectTopY?: number;
  subjectBottomY?: number;
  shotMode?: ShotMode;
}

const clampScore = (score: number): number => Math.max(0, Math.min(100, score));

export const analyzeComposition = (input: CompositionInput): CompositionResult => {
  const feedbackCodes: CompositionResult["feedbackCodes"] = [];
  const tilt = input.rollDeg;
  const offsetX = input.subjectCenterX - 0.5;
  const targetY = input.shotMode === "half_body" ? 0.36 : 0.45;
  const offsetY = input.subjectCenterY - targetY;

  let score = 100;

  if (Math.abs(tilt) > THRESHOLDS.horizonTiltWarnDeg) {
    score -= 15;
    feedbackCodes.push(tilt > 0 ? "TILT_RIGHT" : "TILT_LEFT");
  } else {
    feedbackCodes.push("LEVEL_OK");
  }

  if (Math.abs(offsetX) > THRESHOLDS.framingWarnOffset) {
    score -= 12;
    feedbackCodes.push(offsetX > 0 ? "SUBJECT_TOO_RIGHT" : "SUBJECT_TOO_LEFT");
  }

  if (Math.abs(offsetY) > THRESHOLDS.framingWarnOffset) {
    score -= 10;
    feedbackCodes.push(offsetY > 0 ? "SUBJECT_TOO_LOW" : "SUBJECT_TOO_HIGH");
  }

  // 타인 촬영에서는 모드에 따라 잘림 기준을 다르게 적용한다.
  if (typeof input.subjectTopY === "number" && input.subjectTopY < 0.06) {
    score -= 20;
    feedbackCodes.push("HEAD_CROPPED");
  }

  if (input.shotMode !== "half_body" && typeof input.subjectBottomY === "number" && input.subjectBottomY > 0.94) {
    score -= 22;
    feedbackCodes.push("FEET_CROPPED");
  }

  return {
    score: clampScore(score),
    horizonTiltDeg: tilt,
    subjectOffsetX: offsetX,
    subjectOffsetY: offsetY,
    feedbackCodes
  };
};
