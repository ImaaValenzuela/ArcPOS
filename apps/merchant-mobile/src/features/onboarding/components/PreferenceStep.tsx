import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header, StepIndicator } from "../../../components";
import { PREFERENCE_OPTIONS } from "../../../constants/appConstants";
import { Currency } from "../../../types";
import { colors } from "../../../../theme/colors";

interface PreferenceStepProps {
  preference: Currency;
  onPreference: (value: Currency) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PreferenceStep({
  preference,
  onPreference,
  onBack,
  onContinue,
}: PreferenceStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={1} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>PREFERENCIA DE COBRO</Text>
        <Text style={styles.title}>¿Cómo preferís recibir?</Text>
        <Text style={styles.onboardSubtitle}>
          Siempre podés cambiarlo después de cada cobro.
        </Text>
        <View style={styles.optionList}>
          {PREFERENCE_OPTIONS.map((option) => {
            const active = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onPreference(option.value)}
                style={({ pressed }) => [
                  styles.optionRow,
                  active && styles.optionRowActive,
                  pressed && styles.optionPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionMark,
                    active && styles.optionMarkActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionMarkText,
                      active && styles.optionMarkTextActive,
                    ]}
                  >
                    {option.mark}
                  </Text>
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDetail}>{option.detail}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onContinue} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <Text style={styles.buttonArrow}>→</Text>
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
  onboardSubtitle: {
    color: colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  optionList: {
    gap: 12,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 76,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  optionRowActive: {
    borderColor: colors.turquoise,
    backgroundColor: colors.sky,
  },
  optionPressed: {
    transform: [{ scale: 0.985 }],
  },
  optionMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.skyDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  optionMarkActive: {
    backgroundColor: colors.turquoise,
  },
  optionMarkText: {
    color: colors.turquoiseDark,
    fontSize: 17,
    fontWeight: "800",
  },
  optionMarkTextActive: {
    color: colors.white,
  },
  optionCopy: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  optionDetail: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: colors.turquoise,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.turquoise,
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
