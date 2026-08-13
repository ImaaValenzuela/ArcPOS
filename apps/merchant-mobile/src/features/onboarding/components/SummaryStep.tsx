import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header, StepIndicator } from "../../../components";
import { Currency } from "../../../types";
import { colors } from "../../../../theme/colors";

interface SummaryStepProps {
  storeName: string;
  category: string;
  preference: Currency;
  onBack: () => void;
  onConfirm: () => void;
}

export function SummaryStep({
  storeName,
  category,
  preference,
  onBack,
  onConfirm,
}: SummaryStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={2} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>REVISÁ TUS DATOS</Text>
        <Text style={styles.title}>Todo listo.</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Comercio</Text>
            <Text style={styles.summaryValue}>{storeName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Rubro</Text>
            <Text style={styles.summaryValue}>{category}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Preferencia</Text>
            <Text style={styles.summaryValue}>
              {preference === "ARS"
                ? "Pesos (ARS)"
                : "Dólares digitales (USDC)"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>
            Vas a poder cobrar con QR y elegir la moneda en cada operación.
          </Text>
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onConfirm} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Crear mi comercio</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  onboardContent: {
    flex: 1,
    gap: 12,
    paddingTop: 24,
  },
  eyebrow: {
    color: colors.turquoiseDark,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -1,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryKey: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
    paddingLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  infoIcon: {
    color: colors.turquoiseDark,
    fontSize: 12,
    fontWeight: "800",
    width: 30,
    textAlign: "center",
  },
  infoText: {
    flex: 1,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    gap: 12,
    marginTop: "auto",
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
  secondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: "700",
  },
});
