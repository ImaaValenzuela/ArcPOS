import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { Currency } from "../types";

interface CurrencyPickerProps {
  currency: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencyPicker({ currency, onChange }: CurrencyPickerProps) {
  return (
    <View style={styles.currencyPicker}>
      <Pressable
        onPress={() => onChange("ARS")}
        style={[
          styles.currencyOption,
          currency === "ARS" && styles.currencyActive,
        ]}
      >
        <Text
          style={[
            styles.currencyCode,
            currency === "ARS" && styles.currencyCodeActive,
          ]}
        >
          ARS
        </Text>
        <Text style={styles.currencyLabel}>Pesos</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("USDC")}
        style={[
          styles.currencyOption,
          currency === "USDC" && styles.currencyActive,
        ]}
      >
        <Text
          style={[
            styles.currencyCode,
            currency === "USDC" && styles.currencyCodeActive,
          ]}
        >
          USDC
        </Text>
        <Text style={styles.currencyLabel}>Dólares digitales</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  currencyPicker: {
    flexDirection: "row",
    backgroundColor: colors.skyDeep,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  currencyOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 12,
    gap: 2,
  },
  currencyActive: {
    backgroundColor: colors.white,
    boxShadow: "0 2px 6px rgba(16, 42, 67, 0.08)",
  },
  currencyCode: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: "800",
  },
  currencyCodeActive: {
    color: colors.ink,
  },
  currencyLabel: {
    color: colors.inkMuted,
    fontSize: 11,
  },
});
