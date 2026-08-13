import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { colors } from "../../../../theme/colors";

interface SignInStepProps {
  onBack: () => void;
  onGoogle: () => void;
}

export function SignInStep({ onBack, onGoogle }: SignInStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>TU CUENTA</Text>
        <Text style={styles.title}>Creá tu cuenta para empezar a cobrar.</Text>
        <Text style={styles.onboardSubtitle}>
          Entrá con Google y nosotros creamos tu cuenta de cobros. No necesitás
          recordar claves de wallet ni frases de respaldo.
        </Text>
        <View style={styles.googleCard}>
          <View style={styles.googleMark}>
            <Text style={styles.googleMarkText}>G</Text>
          </View>
          <View style={styles.optionCopy}>
            <Text style={styles.optionTitle}>Continuar con Google</Text>
            <Text style={styles.optionDetail}>
              Recuperás tu cuenta con tu correo de Google
            </Text>
          </View>
          <Text style={styles.googleArrow}>→</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>
            No guardamos tu contraseña ni te pedimos frases de respaldo. Tu
            cuenta se protege con tu acceso de Google.
          </Text>
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onGoogle} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continuar con Google</Text>
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
  googleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 68,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    marginTop: 14,
  },
  googleMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.skyDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  googleMarkText: {
    color: colors.turquoiseDark,
    fontSize: 19,
    fontWeight: "800",
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
  googleArrow: {
    color: colors.inkMuted,
    fontSize: 20,
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
});
