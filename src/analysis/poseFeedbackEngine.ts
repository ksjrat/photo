import { THRESHOLDS } from "../constants/scoring";
import { PoseLandmarks, PoseResult } from "../types/feedback";

const clampScore = (score: number): number => Math.max(0, Math.min(100, score));

const radToDeg = (radian: number): number => (radian * 180) / Math.PI;

export const analyzePose = (landmarks: PoseLandmarks): PoseResult => {
  const feedbackCodes: PoseResult["feedbackCodes"] = [];
  let score = 100;

  const shoulderDx = landmarks.rightShoulder.x - landmarks.leftShoulder.x;
  const shoulderDy = landmarks.rightShoulder.y - landmarks.leftShoulder.y;
  const shoulderTiltDeg = radToDeg(Math.atan2(shoulderDy, shoulderDx));

  if (Math.abs(shoulderTiltDeg) > THRESHOLDS.shoulderTiltWarnDeg) {
    score -= 18;
    feedbackCodes.push(shoulderTiltDeg > 0 ? "SHOULDER_TILT_RIGHT" : "SHOULDER_TILT_LEFT");
  }

  const shoulderMidX = (landmarks.leftShoulder.x + landmarks.rightShoulder.x) / 2;
  const shoulderMidY = (landmarks.leftShoulder.y + landmarks.rightShoulder.y) / 2;
  const hipMidX = (landmarks.leftHip.x + landmarks.rightHip.x) / 2;
  const hipMidY = (landmarks.leftHip.y + landmarks.rightHip.y) / 2;

  const torsoDx = shoulderMidX - hipMidX;
  const torsoDy = hipMidY - shoulderMidY;
  const torsoLeanDeg = radToDeg(Math.atan2(torsoDx, torsoDy));

  if (Math.abs(torsoLeanDeg) > THRESHOLDS.torsoLeanWarnDeg) {
    score -= 14;
    feedbackCodes.push(torsoLeanDeg > 0 ? "LEAN_FORWARD" : "LEAN_BACKWARD");
  }

  const shoulderWidth = Math.abs(shoulderDx);
  if (shoulderWidth < THRESHOLDS.distanceFar) {
    score -= 10;
    feedbackCodes.push("MOVE_CLOSER");
  } else if (shoulderWidth > THRESHOLDS.distanceNear) {
    score -= 10;
    feedbackCodes.push("MOVE_FARTHER");
  }

  if (feedbackCodes.length === 0) {
    feedbackCodes.push("POSE_OK");
  }

  return {
    score: clampScore(score),
    feedbackCodes
  };
};
