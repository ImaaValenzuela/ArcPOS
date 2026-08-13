import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";

interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <View style={styles.onboardCenter}>
      <View style={styles.heroMark}>
        <Text style={styles.heroMarkText}>A</Text>
      </View>
      <Text style={styles.onboardEyebrow}>BIENVENIDO A ARCPOS</Text>
      <Text style={styles.onboardTitle}>Cobrá desde tu teléfono.</Text>
      <Text style={styles.onboardSubtitle}>
        Pesos, dólares digitales y un solo lugar para llevar tus cobros. Sin
        tarjeta de presentación, sin vueltas.
      </Text>
      <View style={styles.featureRow}>
        <View style={styles.featureIcon}>
          <Text style={styles.featureIconText}>QR</Text>
        </View>
        <Text style={styles.featureText}>
          Mostrá un código y el cliente paga desde su billetera.
        </Text>
      </View>
      <View style={styles.featureRow}>
        <View style={styles.featureIcon}>
          <Text style={styles.featureIconText}>$</Text>
        </View>
        <Text style={styles.featureText}>
          Cobrá en pesos o dólares digitales, como prefieras.
        </Text>
      </View>
      <View style={styles.onboardBottom}>
        <Pressable onPress={onStart} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Comenzar</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
        <Text style={styles.mockNote}>
          Prototipo visual · onboarding simulado
        </Text>
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
  heroMark: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroMarkText: {
    color: colors.sky,
    fontSize: 40,
    fontWeight: "800",
  },
  onboardEyebrow: {
    color: colors.turquoiseDark,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 4,
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
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.skyDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconText: {
    color: colors.turquoiseDark,
    fontSize: 13,
    fontWeight: "800",
  },
  featureText: {
    flex: 1,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
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
  mockNote: {
    color: colors.inkMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: -14,
  },
});
