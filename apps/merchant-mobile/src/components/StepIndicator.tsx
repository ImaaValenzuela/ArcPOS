import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { ONBOARDING_STEPS } from "../constants/appConstants";

interface StepIndicatorProps {
  current: number;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <View style={styles.steps}>
      {ONBOARDING_STEPS.map((label, index) => {
        const active = index <= current;
        const isNow = index === current;
        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                active && styles.stepDotActive,
                isNow && styles.stepDotNow,
              ]}
            >
              {isNow ? (
                <View style={styles.stepDotInner} />
              ) : active ? (
                <Text style={styles.stepDotCheck}>✓</Text>
              ) : null}
            </View>
            <Text style={[styles.stepLabel, isNow && styles.stepLabelNow]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 8,
  },
  stepItem: {
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.skyDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: colors.success,
  },
  stepDotNow: {
    backgroundColor: colors.skyDeep,
  },
  stepDotCheck: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
  stepDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.turquoise,
  },
  stepLabel: {
    color: colors.inkMuted,
    fontSize: 11,
  },
  stepLabelNow: {
    color: colors.ink,
    fontWeight: "800",
  },
});
