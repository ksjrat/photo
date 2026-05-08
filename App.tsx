import React from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { CameraGuideScreen } from "./src/screens/CameraGuideScreen";

export default function App() {
  if (Platform.OS !== "ios") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unsupportedWrap}>
          <Text style={styles.unsupportedTitle}>iPhone 전용 앱</Text>
          <Text style={styles.unsupportedText}>
            이 프로젝트는 iOS 실기기/시뮬레이터 기준으로 개발되었습니다. macOS에서 Xcode로 실행해 주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraGuideScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617"
  },
  unsupportedWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  unsupportedTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 10
  },
  unsupportedText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#cbd5e1",
    textAlign: "center"
  }
});
