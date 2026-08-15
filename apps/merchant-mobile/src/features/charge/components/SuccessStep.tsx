import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { Currency } from "../../../types";
import { formatAmount } from "../../../utils/formatAmount";
import { colors } from "../../../../theme/colors";

interface SuccessStepProps {
  amount: string;
  currency: Currency;
  onNewCharge: () => void;
  walletBalance: number;
}

export function SuccessStep({
  amount,
  currency,
  onNewCharge,
  walletBalance,
}: SuccessStepProps) {
  return (
    <>
      <Header />
      <View style={styles.successContent}>
        <View style={styles.successMark}>
          <Text style={styles.successCheck}>✓</Text>
        </View>
        <Text style={styles.successEyebrow}>COBRO RECIBIDO</Text>
        <Text style={styles.successTitle}>Listo.</Text>
        <Text style={styles.successAmount}>
          {currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}
        </Text>
        <Text style={styles.successTime}>Venta simulada · Ahora</Text>
        <View style={styles.walletCard}><Text style={styles.walletLabel}>Wallet simulada · Arc</Text><Text style={styles.walletBalance}>{walletBalance.toFixed(2)} USDC</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onNewCharge} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Nuevo cobro</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 420,
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
  successTitle: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  successAmount: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  successTime: {
    color: colors.inkMuted,
    fontSize: 13,
    marginTop: 3,
  },
  walletCard: {
    width: "100%",
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.sky,
    gap: 5,
  },
  walletLabel: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  walletBalance: {
    color: colors.success,
    fontSize: 24,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
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
});
