import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { Currency } from "../../../types";
import { formatAmount } from "../../../utils/formatAmount";
import { colors } from "../../../../theme/colors";

interface ReviewStepProps {
  amount: string;
  currency: Currency;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewStep({
  amount,
  currency,
  onBack,
  onConfirm,
}: ReviewStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.reviewContent}>
        <Text style={styles.eyebrow}>REVISÁ ANTES DE COBRAR</Text>
        <Text style={styles.title}>Todo listo.</Text>
        <View style={styles.reviewAmount}>
          <Text style={styles.reviewLabel}>Vas a cobrar</Text>
          <Text style={styles.reviewValue}>
            {currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}
          </Text>
          <Text style={styles.reviewCurrency}>
            {currency === "ARS"
              ? "Pesos argentinos"
              : "Dólares digitales · Arc"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>QR</Text>
          <Text style={styles.infoText}>
            El cliente escanea y paga desde su billetera.
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>
            Vas a ver una confirmación cuando el pago se simule.
          </Text>
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onConfirm} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Generar cobro</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Editar importe</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  reviewContent: {
    flex: 1,
    gap: 12,
    paddingTop: 30,
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
  reviewAmount: {
    backgroundColor: colors.sky,
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    gap: 5,
  },
  reviewLabel: {
    color: colors.inkMuted,
    fontSize: 13,
  },
  reviewValue: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  reviewCurrency: {
    color: colors.turquoiseDark,
    fontSize: 13,
    fontWeight: "700",
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
