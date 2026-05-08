export type CompositionFeedbackCode =
  | "LEVEL_OK"
  | "TILT_LEFT"
  | "TILT_RIGHT"
  | "SUBJECT_TOO_LEFT"
  | "SUBJECT_TOO_RIGHT"
  | "SUBJECT_TOO_HIGH"
  | "SUBJECT_TOO_LOW"
  | "HEAD_CROPPED"
  | "FEET_CROPPED";

export type PoseFeedbackCode =
  | "POSE_OK"
  | "SHOULDER_TILT_LEFT"
  | "SHOULDER_TILT_RIGHT"
  | "LEAN_FORWARD"
  | "LEAN_BACKWARD"
  | "MOVE_CLOSER"
  | "MOVE_FARTHER";

export type FeedbackSeverity = "info" | "warn" | "critical";
export type ShotMode = "full_body" | "half_body";

export interface CompositionResult {
  score: number;
  horizonTiltDeg: number;
  subjectOffsetX: number;
  subjectOffsetY: number;
  feedbackCodes: CompositionFeedbackCode[];
}

export interface PoseLandmarks {
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftHip: { x: number; y: number };
  rightHip: { x: number; y: number };
  nose: { x: number; y: number };
}

export interface PoseResult {
  score: number;
  feedbackCodes: PoseFeedbackCode[];
}

export interface RealtimeFeedback {
  totalScore: number;
  composition: CompositionResult;
  pose: PoseResult;
  messages: string[];
  modeLabel: string;
}
