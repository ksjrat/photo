import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RealtimeFeedback } from "../types/feedback";

interface Props {
  feedback: RealtimeFeedback;
}

const scoreColor = (score: number): string => {
  if (score >= 85) {
    return "#22c55e";
  }
  if (score >= 70) {
    return "#f59e0b";
  }
  return "#ef4444";
};

export const FeedbackPanel = ({ feedback }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>촬영 점수</Text>
        <Text style={[styles.scoreValue, { color: scoreColor(feedback.totalScore) }]}>
          {feedback.totalScore}
        </Text>
      </View>
      <Text style={styles.mode}>{feedback.modeLabel}</Text>
      <Text style={styles.meta}>
        구도 {feedback.composition.score} / 자세 {feedback.pose.score}
      </Text>
      {feedback.messages.map((message) => (
        <Text key={message} style={styles.message}>
          - {message}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 14,
    backgroundColor: "rgba(3,7,18,0.76)",
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  scoreLabel: {
    fontSize: 15,
    color: "#cbd5e1",
    fontWeight: "600"
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: "700"
  },
  meta: {
    marginTop: 2,
    color: "#94a3b8",
    fontSize: 13
  },
  mode: {
    marginTop: 2,
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: "600"
  },
  message: {
    marginTop: 6,
    color: "#e2e8f0",
    fontSize: 13
  }
});
