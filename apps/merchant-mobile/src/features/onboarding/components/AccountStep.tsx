import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Header } from "../../../components";
import { colors } from "../../../../theme/colors";

interface AccountStepProps {
  username: string;
  password: string;
  onUsername: (value: string) => void;
  onPassword: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function AccountStep({
  username,
  password,
  onUsername,
  onPassword,
  onBack,
  onContinue,
}: AccountStepProps) {
  const valid = username.trim().length >= 3 && password.length >= 6;

  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.onboardContent}>
        <Text style={styles.eyebrow}>ÚLTIMOS DATOS</Text>
        <Text style={styles.title}>Casi listo. Elegí cómo te llamás.</Text>
        <Text style={styles.onboardSubtitle}>
          Este nombre lo van a ver tus clientes cuando te paguen.
        </Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nombre público</Text>
          <TextInput
            value={username}
            onChangeText={onUsername}
            placeholder="Ej. Café del Parque"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Contraseña de acceso</Text>
          <TextInput
            value={password}
            onChangeText={onPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            style={styles.input}
          />
          <Text style={styles.fieldHint}>
            La usás para entrar a la app. Tu wallet se recupera con Google, no
            con esta contraseña.
          </Text>
        </View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable
          disabled={!valid}
          onPress={onContinue}
          style={[styles.primaryButton, !valid && styles.buttonDisabled]}
        >
          <Text style={styles.primaryButtonText}>Crear mi cuenta</Text>
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
  fieldHint: {
    color: colors.inkMuted,
    fontSize: 12,
    lineHeight: 17,
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
