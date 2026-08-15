import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { KEYPAD_KEYS } from "../../../constants/appConstants";
import { Currency, UsdcQuote } from "../../../types";
import { formatAmount } from "../../../utils/formatAmount";
import { colors } from "../../../../theme/colors";

interface ChargeStepProps {
  amount: string;
  currency: Currency;
  onAddKey: (key: string) => void;
  onCurrency: (value: Currency) => void;
  onContinue: () => void;
  quote: UsdcQuote | null;
  quoteError: string;
  quoteLoading: boolean;
  onRefreshQuote: () => void;
}

export function ChargeStep({
  amount,
  currency,
  onAddKey,
  onCurrency,
  onContinue,
  quote,
  quoteError,
  quoteLoading,
  onRefreshQuote,
}: ChargeStepProps) {
  const isButtonDisabled = !amount || amount === "0" || !quote;
  const usdcAmount = quote ? Number(amount.replace(",", ".")) / Number(quote.rate) : 0;

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
      <View style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Text style={styles.quoteEyebrow}>RECIBÍS EN USDC</Text>
          <Pressable onPress={onRefreshQuote} accessibilityLabel="Actualizar cotización">
            <Text style={styles.refresh}>↻</Text>
          </Pressable>
        </View>
        {quote ? (
          <>
            <Text style={styles.quoteValue}>{usdcAmount.toFixed(2)} <Text style={styles.quoteUnit}>USDC</Text></Text>
            <View style={styles.quoteMeta}><Text style={styles.quoteRate}>1 USDC = {Number(quote.rate).toLocaleString("es-AR", { minimumFractionDigits: 2 })} ARS</Text><Text style={styles.quoteLive}>Fija</Text></View>
          </>
        ) : <Text style={styles.quoteError}>{quoteError || "Cargando cotización..."}</Text>}
      </View>
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
      <Text style={styles.mockNote}>Arc Testnet · cotización de sandbox</Text>
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 8,
    marginTop: 4,
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
    paddingVertical: 8,
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
    gap: 7,
  },
  key: {
    width: "31.8%",
    minHeight: 48,
    borderRadius: 13,
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
    minHeight: 52,
    borderRadius: 14,
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
    marginTop: -8,
  },
  quoteCard: {
    backgroundColor: colors.sky,
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quoteEyebrow: {
    color: colors.turquoiseDark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  refresh: {
    color: colors.turquoiseDark,
    fontSize: 22,
  },
  quoteValue: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  quoteUnit: {
    color: colors.turquoiseDark,
    fontSize: 13,
    fontWeight: "800",
  },
  quoteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quoteRate: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  quoteLive: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
  },
  quoteError: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
  },
});
