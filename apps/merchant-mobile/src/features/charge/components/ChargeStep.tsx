import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header, CurrencyPicker } from "../../../components";
import { KEYPAD_KEYS } from "../../../constants/appConstants";
import { Currency } from "../../../types";
import { formatAmount } from "../../../utils/formatAmount";
import { colors } from "../../../../theme/colors";

interface ChargeStepProps {
  amount: string;
  currency: Currency;
  onAddKey: (key: string) => void;
  onCurrency: (value: Currency) => void;
  onContinue: () => void;
}

export function ChargeStep({
  amount,
  currency,
  onAddKey,
  onCurrency,
  onContinue,
}: ChargeStepProps) {
  const isButtonDisabled = !amount || amount === "0";

  return (
    <>
      <Header />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>NUEVO COBRO</Text>
        <Text style={styles.title}>¿Cuánto vas a cobrar?</Text>
      </View>
      <View style={styles.amountPanel}>
        <Text style={styles.amount}>
          {currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}
        </Text>
        <Text style={styles.amountHint}>Ingresá el importe</Text>
      </View>
      <CurrencyPicker currency={currency} onChange={onCurrency} />
      <View style={styles.keypad}>
        {KEYPAD_KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => onAddKey(key)}
            style={({ pressed }) => [
              styles.key,
              pressed && styles.keyPressed,
            ]}
          >
            <Text style={[styles.keyText, key === "⌫" && styles.deleteText]}>
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        disabled={isButtonDisabled}
        onPress={onContinue}
        style={[styles.primaryButton, isButtonDisabled && styles.buttonDisabled]}
      >
        <Text style={styles.primaryButtonText}>Revisar cobro</Text>
        <Text style={styles.buttonArrow}>→</Text>
      </Pressable>
      <Text style={styles.mockNote}>Prototipo visual · cobros simulados</Text>
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 8,
    marginTop: 16,
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
  amountPanel: {
    alignItems: "center",
    paddingVertical: 18,
    gap: 5,
  },
  amount: {
    color: colors.ink,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: "800",
    letterSpacing: -1.5,
    fontVariant: ["tabular-nums"],
  },
  amountHint: {
    color: colors.inkMuted,
    fontSize: 13,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  key: {
    width: "31.8%",
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  keyPressed: {
    backgroundColor: colors.skyDeep,
    transform: [{ scale: 0.97 }],
  },
  keyText: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  deleteText: {
    color: colors.inkMuted,
    fontSize: 20,
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
  buttonDisabled: {
    backgroundColor: colors.line,
  },
  mockNote: {
    color: colors.inkMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: -14,
  },
});
