import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { Currency } from "../../../types";
import { formatAmount } from "../../../utils/formatAmount";
import { colors } from "../../../../theme/colors";

interface QrStepProps {
  amount: string;
  currency: Currency;
  onCancel: () => void;
  onPaid: () => void;
}

export function QrStep({ amount, currency, onCancel, onPaid }: QrStepProps) {
  return (
    <>
      <Header onBack={onCancel} />
      <View style={styles.qrContent}>
        <Text style={styles.eyebrow}>COBRO ACTIVO · MOCK</Text>
        <Text style={styles.title}>Mostrale este código al cliente.</Text>
        <Text style={styles.qrAmount}>
          {currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}
        </Text>
        <View style={styles.qrFrame}>
          <View style={styles.qrGrid}>
            {Array.from({ length: 49 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.qrCell,
                  (index * 17 + index) % 5 < 2 && styles.qrCellFilled,
                ]}
              />
            ))}
          </View>
          <View style={styles.qrCenter}>
            <Text style={styles.qrCenterText}>A</Text>
          </View>
        </View>
        <Text style={styles.qrHint}>Esperando el pago · vence en 09:42</Text>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onPaid} style={styles.mockConfirm}>
          <Text style={styles.mockConfirmText}>Simular pago recibido</Text>
        </Pressable>
        <Pressable onPress={onCancel} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Cancelar cobro</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  qrContent: {
    alignItems: "center",
    gap: 12,
    paddingTop: 18,
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
  qrAmount: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
    fontVariant: ["tabular-nums"],
  },
  qrFrame: {
    width: 238,
    height: 238,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 10,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 16px rgba(16, 42, 67, 0.12)",
  },
  qrGrid: {
    width: 190,
    height: 190,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  qrCell: {
    width: "14.28%",
    height: "14.28%",
    backgroundColor: colors.white,
  },
  qrCellFilled: {
    backgroundColor: colors.ink,
  },
  qrCenter: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: colors.white,
  },
  qrCenterText: {
    color: colors.sky,
    fontSize: 19,
    fontWeight: "800",
  },
  qrHint: {
    color: colors.inkMuted,
    fontSize: 13,
  },
  bottomActions: {
    gap: 12,
    marginTop: "auto",
  },
  mockConfirm: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.skyDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  mockConfirmText: {
    color: colors.turquoiseDark,
    fontSize: 14,
    fontWeight: "800",
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
