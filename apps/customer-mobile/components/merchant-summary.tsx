import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function MerchantSummary() {
  return (
    <View style={styles.card}>
      <View style={styles.mark}><Text style={styles.markText}>C</Text></View>
      <View style={styles.copy}><Text style={styles.label}>Estás pagando en</Text><Text style={styles.name}>Café del Parque</Text><Text style={styles.location}>Palermo · Buenos Aires</Text></View>
      <Text style={styles.verified}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 16 },
  mark: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  markText: { color: colors.turquoiseDark, fontSize: 21, fontWeight: "800" },
  copy: { flex: 1, gap: 2 },
  label: { color: colors.inkMuted, fontSize: 11 },
  name: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  location: { color: colors.inkMuted, fontSize: 12 },
  verified: { color: colors.success, fontSize: 20, fontWeight: "700" },
});
