import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ChargeFlow } from "./src/features/charge";
import { colors, spacing } from "./theme/colors";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <>
      <StatusBar hidden />
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <ChargeFlow />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.paper,
    padding: spacing.page,
    gap: spacing.section,
  },
});
