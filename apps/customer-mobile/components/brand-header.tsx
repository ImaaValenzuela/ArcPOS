import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function BrandHeader({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityLabel="Volver" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.logo}><Text style={styles.logoText}>A</Text></View>
      )}
      <Text style={styles.brand}>Arc Pay</Text>
      <View style={styles.mockPill}><Text style={styles.mockText}>MOCK</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", minHeight: 44, gap: 12 },
  logo: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  logoText: { color: colors.sky, fontSize: 19, fontWeight: "800" },
  brand: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  mockPill: { backgroundColor: colors.skyDeep, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 },
  mockText: { color: colors.turquoiseDark, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  backButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.sky, alignItems: "center", justifyContent: "center" },
  backIcon: { color: colors.ink, fontSize: 29, lineHeight: 31, fontWeight: "300" },
});
