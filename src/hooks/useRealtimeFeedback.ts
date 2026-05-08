import { useCallback, useMemo, useRef, useState } from "react";
import { analyzeComposition, CompositionInput } from "../analysis/compositionAnalyzer";
import { analyzePose } from "../analysis/poseFeedbackEngine";
import { createPoseEstimator } from "../analysis/poseEstimator";
import { RealtimeFeedback, ShotMode } from "../types/feedback";
import { smoothScore } from "../utils/smoothing";

const compositionMessageMap: Record<string, string> = {
  LEVEL_OK: "수평이 안정적입니다.",
  TILT_LEFT: "폰을 오른쪽으로 조금만 기울여 수평을 맞추세요.",
  TILT_RIGHT: "폰을 왼쪽으로 조금만 기울여 수평을 맞추세요.",
  SUBJECT_TOO_LEFT: "피사체를 조금 오른쪽으로 이동해 주세요.",
  SUBJECT_TOO_RIGHT: "피사체를 조금 왼쪽으로 이동해 주세요.",
  SUBJECT_TOO_HIGH: "화면을 조금 아래로 내려 머리 여백을 맞춰주세요.",
  SUBJECT_TOO_LOW: "화면을 조금 위로 올려 발끝 공간을 확보해 주세요.",
  HEAD_CROPPED: "머리가 잘렸어요. 폰을 조금 위로 올리거나 한 걸음 뒤로 가세요.",
  FEET_CROPPED: "발끝이 잘렸어요. 폰을 조금 아래로 내리거나 한 걸음 뒤로 가세요."
};

const poseMessageMap: Record<string, string> = {
  POSE_OK: "자세가 안정적입니다.",
  SHOULDER_TILT_LEFT: "왼쪽 어깨가 내려가 있습니다. 어깨를 평행하게 맞춰보세요.",
  SHOULDER_TILT_RIGHT: "오른쪽 어깨가 내려가 있습니다. 어깨를 평행하게 맞춰보세요.",
  LEAN_FORWARD: "상체가 앞으로 기울어졌습니다. 허리를 곧게 펴보세요.",
  LEAN_BACKWARD: "상체가 뒤로 기울어졌습니다. 중심을 정면으로 맞춰보세요.",
  MOVE_CLOSER: "카메라에 조금 더 가까이 와 주세요.",
  MOVE_FARTHER: "카메라에서 조금 더 멀어져 주세요."
};

const initialFeedback: RealtimeFeedback = {
  totalScore: 0,
  composition: {
    score: 0,
    horizonTiltDeg: 0,
    subjectOffsetX: 0,
    subjectOffsetY: 0,
    feedbackCodes: []
  },
  pose: {
    score: 0,
    feedbackCodes: []
  },
  messages: ["전신이 모두 보이게 인물을 프레임 안에 맞춰주세요."],
  modeLabel: "타인 인물 촬영 · 전신 우선"
};

const priorityOrder = [
  "FEET_CROPPED",
  "HEAD_CROPPED",
  "TILT_LEFT",
  "TILT_RIGHT",
  "SUBJECT_TOO_LOW",
  "SUBJECT_TOO_HIGH",
  "SUBJECT_TOO_LEFT",
  "SUBJECT_TOO_RIGHT",
  "MOVE_FARTHER",
  "MOVE_CLOSER",
  "SHOULDER_TILT_LEFT",
  "SHOULDER_TILT_RIGHT",
  "LEAN_FORWARD",
  "LEAN_BACKWARD",
  "LEVEL_OK",
  "POSE_OK"
] as const;

const pickPrimaryMessage = (compositionCodes: string[], poseCodes: string[]): string => {
  const allCodes = [...compositionCodes, ...poseCodes];
  const selected = priorityOrder.find((priorityCode) => allCodes.includes(priorityCode));
  if (!selected) {
    return "좋아요. 그대로 2~3장 연속 촬영해 보세요.";
  }
  return compositionMessageMap[selected] ?? poseMessageMap[selected] ?? selected;
};

export const useRealtimeFeedback = () => {
  const [feedback, setFeedback] = useState<RealtimeFeedback>(initialFeedback);
  const scoreHistoryRef = useRef<number[]>([]);
  const poseEstimator = useMemo(() => createPoseEstimator(), []);

  const processFrame = useCallback(
    async (compositionInput: CompositionInput, rawFrame: unknown, shotMode: ShotMode) => {
      const composition = analyzeComposition({ ...compositionInput, shotMode });
      const landmarks = await poseEstimator.estimateFromFrame(rawFrame);
      if (!landmarks) {
        return;
      }

      const pose = analyzePose(landmarks);
      const total = Math.round((composition.score + pose.score) / 2);
      scoreHistoryRef.current = [...scoreHistoryRef.current, total].slice(-20);

      const messages = [pickPrimaryMessage(composition.feedbackCodes, pose.feedbackCodes)];

      setFeedback({
        totalScore: smoothScore(scoreHistoryRef.current),
        composition,
        pose,
        messages,
        modeLabel: shotMode === "full_body" ? "타인 인물 촬영 · 전신 우선" : "타인 인물 촬영 · 반신 우선"
      });
    },
    [poseEstimator]
  );

  return {
    feedback,
    processFrame
  };
};
