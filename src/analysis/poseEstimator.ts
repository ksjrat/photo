import { PoseLandmarks } from "../types/feedback";

export interface PoseEstimator {
  estimateFromFrame(frame: unknown): Promise<PoseLandmarks | null>;
}

class MockPoseEstimator implements PoseEstimator {
  async estimateFromFrame(_frame: unknown): Promise<PoseLandmarks | null> {
    const jitter = (Math.random() - 0.5) * 0.04;
    return {
      leftShoulder: { x: 0.44 + jitter, y: 0.32 },
      rightShoulder: { x: 0.56 + jitter, y: 0.33 },
      leftHip: { x: 0.46, y: 0.56 },
      rightHip: { x: 0.54, y: 0.56 },
      nose: { x: 0.5 + jitter, y: 0.21 }
    };
  }
}

class MediaPipePoseEstimator implements PoseEstimator {
  private detectorPromise: Promise<any> | null = null;

  private async getDetector(): Promise<any | null> {
    if (!this.detectorPromise) {
      this.detectorPromise = (async () => {
        try {
          const vision = await import("@mediapipe/tasks-vision");
          const filesetResolver = await vision.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          return vision.PoseLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
            },
            runningMode: "IMAGE",
            numPoses: 1
          });
        } catch (_error) {
          return null;
        }
      })();
    }

    return this.detectorPromise;
  }

  async estimateFromFrame(_frame: unknown): Promise<PoseLandmarks | null> {
    const detector = await this.getDetector();
    if (!detector) {
      return null;
    }

    return null;
  }
}

interface NativeLandmark {
  x: number;
  y: number;
}

interface NativePosePayload {
  leftShoulder?: NativeLandmark;
  rightShoulder?: NativeLandmark;
  leftHip?: NativeLandmark;
  rightHip?: NativeLandmark;
  nose?: NativeLandmark;
}

class NativePoseEstimator implements PoseEstimator {
  async estimateFromFrame(frame: unknown): Promise<PoseLandmarks | null> {
    const payload = frame as NativePosePayload | null;
    if (!payload) {
      return null;
    }

    const { leftShoulder, rightShoulder, leftHip, rightHip, nose } = payload;
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !nose) {
      return null;
    }

    return {
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      nose
    };
  }
}

export const createPoseEstimator = (): PoseEstimator => {
  const native = new NativePoseEstimator();
  const mediaPipe = new MediaPipePoseEstimator();
  const mock = new MockPoseEstimator();

  // iOS 프레임 프로세서의 랜드마크 payload를 우선 사용한다.
  return {
    async estimateFromFrame(frame: unknown) {
      const nativeEstimated = await native.estimateFromFrame(frame);
      if (nativeEstimated) {
        return nativeEstimated;
      }

      const estimated = await mediaPipe.estimateFromFrame(frame);
      if (estimated) {
        return estimated;
      }

      // 개발 중 카메라/모델 미연결 상황을 위해 mock을 남겨둔다.
      return mock.estimateFromFrame(frame);
    }
  };
};
