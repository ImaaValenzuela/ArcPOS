import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

interface HeaderProps {
  onBack?: () => void;
  brandName?: string;
  storeName?: string;
}

export function Header({
  onBack,
  brandName = "ArcPOS",
  storeName = "Café del Parque",
}: HeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Volver"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>A</Text>
        </View>
      )}
      <View style={styles.headerCopy}>
        <Text style={styles.brand}>{brandName}</Text>
        <Text style={styles.store}>{storeName}</Text>
      </View>
      <View style={styles.online}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>Listo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    gap: 12,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: colors.sky,
    fontSize: 20,
    fontWeight: "800",
  },
  headerCopy: {
    flex: 1,
    gap: 1,
  },
  brand: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  store: {
    color: colors.inkMuted,
    fontSize: 12,
  },
  online: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.sky,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  onlineText: {
    color: colors.turquoiseDark,
    fontSize: 12,
    fontWeight: "700",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "300",
  },
});
