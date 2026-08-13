import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../../../components";
import { colors } from "../../../../theme/colors";

interface WalletReadyStepProps {
  username: string;
  onBack: () => void;
  onContinue: () => void;
}

export function WalletReadyStep({
  username,
  onBack,
  onContinue,
}: WalletReadyStepProps) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <View style={styles.walletShield}>
          <Text style={styles.walletShieldText}>✓</Text>
        </View>
        <Text style={styles.eyebrow}>CUENTA DE COBROS CREADA</Text>
        <Text style={styles.title}>Tu cuenta está lista.</Text>
        <View style={styles.recoveryCard}>
          <Text style={styles.recoveryTitle}>Cómo recuperás tu cuenta</Text>
          <Text style={styles.recoveryText}>
            Iniciá sesión con el mismo Google y vas a volver a ver tu cuenta y tus
            cobros.
          </Text>
          <View style={styles.recoveryDivider} />
          <View style={styles.recoveryRow}>
            <Text style={styles.recoveryIcon}>🔒</Text>
            <Text style={styles.recoveryRowText}>
              No necesitás frases ni claves de wallet.
            </Text>
          </View>
          <View style={styles.recoveryRow}>
            <Text style={styles.recoveryIcon}>☁️</Text>
            <Text style={styles.recoveryRowText}>
              Tus fondos están protegidos y respaldados por el proveedor de tu
              wallet.
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Este es un prototipo visual. La creación real de la wallet se hará
            con Circle en testnet.
          </Text>
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
  walletShield: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  walletShieldText: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "400",
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
  recoveryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    gap: 8,
  },
  recoveryTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
  },
  recoveryText: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  recoveryDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 6,
  },
  recoveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recoveryIcon: {
    fontSize: 15,
  },
  recoveryRowText: {
    flex: 1,
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
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
