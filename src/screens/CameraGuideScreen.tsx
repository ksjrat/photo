import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CompositionOverlay } from "../components/CompositionOverlay";
import { FeedbackPanel } from "../components/FeedbackPanel";
import { TARGET_FPS } from "../constants/scoring";
import { useRealtimeFeedback } from "../hooks/useRealtimeFeedback";
import { ShotMode } from "../types/feedback";

const FRAME_INTERVAL_MS = Math.round(1000 / TARGET_FPS);

const randomInput = () => ({
  rollDeg: (Math.random() - 0.5) * 10,
  subjectCenterX: 0.5 + (Math.random() - 0.5) * 0.24,
  subjectCenterY: 0.45 + (Math.random() - 0.5) * 0.18,
  subjectTopY: 0.08 + (Math.random() - 0.5) * 0.1,
  subjectBottomY: 0.92 + (Math.random() - 0.5) * 0.1
});

export const CameraGuideScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(true);
  const [shotMode, setShotMode] = useState<ShotMode>("full_body");
  const lastProcessAtRef = useRef(0);
  const { feedback, processFrame } = useRealtimeFeedback();

  const canUseCamera = useMemo(() => permission?.granted === true, [permission?.granted]);

  useEffect(() => {
    if (!permission) {
      return;
    }
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const tickFeedback = useCallback(async () => {
    const now = Date.now();
    if (now - lastProcessAtRef.current < FRAME_INTERVAL_MS) {
      return;
    }
    lastProcessAtRef.current = now;
    await processFrame(randomInput(), null, shotMode);
  }, [processFrame, shotMode]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = setInterval(() => {
      void tickFeedback();
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isActive, tickFeedback]);

  if (!permission) {
    return <CenteredText text="카메라 권한 상태를 확인하는 중..." />;
  }

  if (!canUseCamera) {
    return <CenteredText text="카메라 권한이 필요합니다. 권한 허용 후 다시 시도해 주세요." />;
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" onCameraReady={() => setIsActive(true)} />
      <View style={styles.modeToggleWrap}>
        <ModeButton
          label="전신"
          active={shotMode === "full_body"}
          onPress={() => setShotMode("full_body")}
        />
        <ModeButton
          label="반신"
          active={shotMode === "half_body"}
          onPress={() => setShotMode("half_body")}
        />
      </View>
      <CompositionOverlay horizonTiltDeg={feedback.composition.horizonTiltDeg} />
      <FeedbackPanel feedback={feedback} />
    </View>
  );
};

const ModeButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeButtonActive]}>
    <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
  </Pressable>
);

const CenteredText = ({ text }: { text: string }) => (
  <View style={styles.centered}>
    <Text style={styles.centerText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617"
  },
  modeToggleWrap: {
    position: "absolute",
    top: 52,
    left: 16,
    flexDirection: "row",
    gap: 8,
    zIndex: 3
  },
  modeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.74)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.45)"
  },
  modeButtonActive: {
    borderColor: "rgba(56,189,248,0.95)",
    backgroundColor: "rgba(12,74,110,0.8)"
  },
  modeButtonText: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 13
  },
  modeButtonTextActive: {
    color: "#e0f2fe"
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 24
  },
  centerText: {
    color: "#e2e8f0",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22
  }
});
