import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Header, StepIndicator } from "../../../components";
import { STORE_CATEGORIES } from "../../../constants/appConstants";
import { colors } from "../../../../theme/colors";

interface StoreStepProps {
  storeName: string;
  category: string;
  onStoreName: (value: string) => void;
  onCategory: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StoreStep({
  storeName,
  category,
  onStoreName,
  onCategory,
  onBack,
  onContinue,
}: StoreStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <StepIndicator current={0} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>PRIMERO LO BÁSICO</Text>
        <Text style={styles.title}>¿Cómo se llama tu comercio?</Text>
        <Text style={styles.onboardSubtitle}>
          Lo van a ver tus clientes cuando te paguen.
        </Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nombre del comercio</Text>
          <TextInput
            value={storeName}
            onChangeText={onStoreName}
            placeholder="Ej. Café del Parque"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
          />
        </View>
        <Text style={styles.fieldLabel}>Rubro</Text>
        <View style={styles.chipRow}>
          {STORE_CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => onCategory(item)}
              style={[styles.chip, category === item && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable
          disabled={!storeName.trim()}
          onPress={onContinue}
          style={[styles.primaryButton, !storeName.trim() && styles.buttonDisabled]}
        >
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
  fieldGroup: {
    gap: 8,
    marginTop: 8,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  input: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    minHeight: 40,
    borderRadius: 99,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.white,
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
  buttonDisabled: {
    backgroundColor: colors.line,
  },
});
