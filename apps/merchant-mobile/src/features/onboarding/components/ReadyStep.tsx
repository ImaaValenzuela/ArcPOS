import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";

interface ReadyStepProps {
  storeName: string;
  onGoToCharge: () => void;
}

export function ReadyStep({ storeName, onGoToCharge }: ReadyStepProps) {
  return (
    <View style={styles.onboardCenter}>
      <View style={styles.successMark}>
        <Text style={styles.successCheck}>✓</Text>
      </View>
      <Text style={styles.successEyebrow}>COMERCIO CREADO</Text>
      <Text style={styles.onboardTitle}>{storeName} está listo.</Text>
      <Text style={styles.onboardSubtitle}>
        Ya podés generar tu primer cobro. Es simulado, así que no te preocupes por
        errores.
      </Text>
      <View style={styles.onboardBottom}>
        <Pressable onPress={onGoToCharge} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Hacer mi primer cobro</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    minHeight: 520,
    paddingTop: 30,
  },
  successMark: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  successCheck: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "400",
  },
  successEyebrow: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  onboardTitle: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  onboardSubtitle: {
    color: colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  onboardBottom: {
    gap: 12,
    marginTop: 34,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.ink,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  buttonArrow: {
    color: colors.sky,
    fontSize: 22,
  },
});
