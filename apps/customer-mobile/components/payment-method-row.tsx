import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export type PaymentMethod = "local" | "usdc" | "wallet";

const methods = {
  local: { title: "Billetera local", detail: "Mercado Pago, MODO, Ualá o banco", mark: "$" },
  usdc: { title: "USDC", detail: "Dólares digitales sobre Arc", mark: "U" },
  wallet: { title: "Otra wallet", detail: "Elegí una wallet compatible", mark: "↗" },
} as const;

export function PaymentMethodRow({ method, selected, onPress }: { method: PaymentMethod; selected: boolean; onPress: () => void }) {
  const item = methods[method];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, selected && styles.selected, pressed && styles.pressed]}>
      <View style={[styles.mark, selected && styles.selectedMark]}><Text style={[styles.markText, selected && styles.selectedMarkText]}>{item.mark}</Text></View>
      <View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.detail}>{item.detail}</Text></View>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 72, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  selected: { borderColor: colors.turquoise, backgroundColor: colors.sky },
  pressed: { transform: [{ scale: 0.985 }] },
  mark: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  selectedMark: { backgroundColor: colors.turquoise },
  markText: { color: colors.turquoiseDark, fontSize: 17, fontWeight: "800" },
  selectedMarkText: { color: colors.white },
  copy: { flex: 1, gap: 3 },
  title: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  detail: { color: colors.inkMuted, fontSize: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.turquoise },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.turquoise },
});
