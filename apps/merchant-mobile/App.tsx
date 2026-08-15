import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { OnboardingFlow } from "./src/features/onboarding";
import { ChargeFlow } from "./src/features/charge";
import { colors, spacing } from "./theme/colors";

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      {!isOnboardingCompleted ? (
        <OnboardingFlow
          onCompleteOnboarding={() => setIsOnboardingCompleted(true)}
        />
      ) : (
        <ChargeFlow />
      )}
    </ScrollView>
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
