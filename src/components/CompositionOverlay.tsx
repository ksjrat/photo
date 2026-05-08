import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  horizonTiltDeg: number;
}

export const CompositionOverlay = ({ horizonTiltDeg }: Props) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.gridContainer}>
        <View style={styles.verticalThird} />
        <View style={styles.verticalThird} />
      </View>
      <View style={styles.gridRowContainer}>
        <View style={styles.horizontalThird} />
        <View style={styles.horizontalThird} />
      </View>
      <View
        style={[
          styles.horizonLine,
          {
            transform: [{ rotate: `${-horizonTiltDeg}deg` }]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  gridRowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-evenly"
  },
  verticalThird: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.32)"
  },
  horizontalThird: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.32)"
  },
  horizonLine: {
    position: "absolute",
    top: "50%",
    left: "12%",
    right: "12%",
    height: 2,
    backgroundColor: "rgba(34,197,94,0.85)"
  }
});
