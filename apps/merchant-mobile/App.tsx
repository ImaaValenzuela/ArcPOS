import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "./theme/colors";

type Currency = "ARS" | "USDC";
type Screen = "charge" | "review" | "qr" | "success";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

function formatAmount(value: string) {
  if (!value) return "0";
  const [integer, decimal] = value.split(",");
  const formattedInteger = Number(integer || 0).toLocaleString("es-AR");
  return decimal === undefined ? formattedInteger : `${formattedInteger},${decimal.slice(0, 2)}`;
}

function Header({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityLabel="Volver" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.logoMark}><Text style={styles.logoText}>A</Text></View>
      )}
      <View style={styles.headerCopy}>
        <Text style={styles.brand}>ArcPOS</Text>
        <Text style={styles.store}>Café del Parque</Text>
      </View>
      <View style={styles.online}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Listo</Text></View>
    </View>
  );
}

function CurrencyPicker({ currency, onChange }: { currency: Currency; onChange: (currency: Currency) => void }) {
  return (
    <View style={styles.currencyPicker}>
      <Pressable onPress={() => onChange("ARS")} style={[styles.currencyOption, currency === "ARS" && styles.currencyActive]}>
        <Text style={[styles.currencyCode, currency === "ARS" && styles.currencyCodeActive]}>ARS</Text>
        <Text style={styles.currencyLabel}>Pesos</Text>
      </Pressable>
      <Pressable onPress={() => onChange("USDC")} style={[styles.currencyOption, currency === "USDC" && styles.currencyActive]}>
        <Text style={[styles.currencyCode, currency === "USDC" && styles.currencyCodeActive]}>USDC</Text>
        <Text style={styles.currencyLabel}>Dólares digitales</Text>
      </Pressable>
    </View>
  );
}

function ChargeScreen({ amount, currency, onAmount, onCurrency, onContinue }: {
  amount: string;
  currency: Currency;
  onAmount: (value: string) => void;
  onCurrency: (value: Currency) => void;
  onContinue: () => void;
}) {
  const addKey = (key: string) => {
    if (key === "⌫") return onAmount(amount.slice(0, -1));
    if (key === "," && amount.includes(",")) return;
    if (amount.includes(",") && amount.split(",")[1].length >= 2) return;
    if (amount === "0" && key !== ",") return onAmount(key);
    onAmount(`${amount}${key}`);
  };

  return (
    <>
      <Header />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>NUEVO COBRO</Text>
        <Text style={styles.title}>¿Cuánto vas a cobrar?</Text>
      </View>
      <View style={styles.amountPanel}>
        <Text style={styles.amount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <Text style={styles.amountHint}>Ingresá el importe</Text>
      </View>
      <CurrencyPicker currency={currency} onChange={onCurrency} />
      <View style={styles.keypad}>
        {keypad.map((key) => (
          <Pressable key={key} onPress={() => addKey(key)} style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}>
            <Text style={[styles.keyText, key === "⌫" && styles.deleteText]}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable disabled={!amount || amount === "0"} onPress={onContinue} style={[styles.primaryButton, (!amount || amount === "0") && styles.buttonDisabled]}>
        <Text style={styles.primaryButtonText}>Revisar cobro</Text><Text style={styles.buttonArrow}>→</Text>
      </Pressable>
      <Text style={styles.mockNote}>Prototipo visual · cobros simulados</Text>
    </>
  );
}

function ReviewScreen({ amount, currency, onBack, onConfirm }: { amount: string; currency: Currency; onBack: () => void; onConfirm: () => void }) {
  return (
    <>
      <Header onBack={onBack} />
      <View style={styles.reviewContent}>
        <Text style={styles.eyebrow}>REVISÁ ANTES DE COBRAR</Text>
        <Text style={styles.title}>Todo listo.</Text>
        <View style={styles.reviewAmount}>
          <Text style={styles.reviewLabel}>Vas a cobrar</Text>
          <Text style={styles.reviewValue}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
          <Text style={styles.reviewCurrency}>{currency === "ARS" ? "Pesos argentinos" : "Dólares digitales · Arc"}</Text>
        </View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>QR</Text><Text style={styles.infoText}>El cliente escanea y paga desde su billetera.</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoIcon}>✓</Text><Text style={styles.infoText}>Vas a ver una confirmación cuando el pago se simule.</Text></View>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onConfirm} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Generar cobro</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
        <Pressable onPress={onBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Editar importe</Text></Pressable>
      </View>
    </>
  );
}

function QrScreen({ amount, currency, onCancel, onPaid }: { amount: string; currency: Currency; onCancel: () => void; onPaid: () => void }) {
  return (
    <>
      <Header onBack={onCancel} />
      <View style={styles.qrContent}>
        <Text style={styles.eyebrow}>COBRO ACTIVO · MOCK</Text>
        <Text style={styles.title}>Mostrale este código al cliente.</Text>
        <Text style={styles.qrAmount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <View style={styles.qrFrame}><View style={styles.qrGrid}>{Array.from({ length: 49 }).map((_, index) => <View key={index} style={[styles.qrCell, (index * 17 + index) % 5 < 2 && styles.qrCellFilled]} />)}</View><View style={styles.qrCenter}><Text style={styles.qrCenterText}>A</Text></View></View>
        <Text style={styles.qrHint}>Esperando el pago · vence en 09:42</Text>
      </View>
      <View style={styles.bottomActions}>
        <Pressable onPress={onPaid} style={styles.mockConfirm}><Text style={styles.mockConfirmText}>Simular pago recibido</Text></Pressable>
        <Pressable onPress={onCancel} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Cancelar cobro</Text></Pressable>
      </View>
    </>
  );
}

function SuccessScreen({ amount, currency, onNewCharge }: { amount: string; currency: Currency; onNewCharge: () => void }) {
  return (
    <>
      <Header />
      <View style={styles.successContent}>
        <View style={styles.successMark}><Text style={styles.successCheck}>✓</Text></View>
        <Text style={styles.successEyebrow}>COBRO RECIBIDO</Text>
        <Text style={styles.successTitle}>Listo.</Text>
        <Text style={styles.successAmount}>{currency === "USDC" ? "US$" : "$"} {formatAmount(amount)}</Text>
        <Text style={styles.successTime}>Venta simulada · Ahora</Text>
      </View>
      <View style={styles.bottomActions}><Pressable onPress={onNewCharge} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Nuevo cobro</Text><Text style={styles.buttonArrow}>→</Text></Pressable></View>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("charge");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("ARS");
  const reset = () => { setAmount(""); setCurrency("ARS"); setScreen("charge"); };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {screen === "charge" && <ChargeScreen amount={amount} currency={currency} onAmount={setAmount} onCurrency={setCurrency} onContinue={() => setScreen("review")} />}
      {screen === "review" && <ReviewScreen amount={amount} currency={currency} onBack={() => setScreen("charge")} onConfirm={() => setScreen("qr")} />}
      {screen === "qr" && <QrScreen amount={amount} currency={currency} onCancel={() => setScreen("charge")} onPaid={() => setScreen("success")} />}
      {screen === "success" && <SuccessScreen amount={amount} currency={currency} onNewCharge={reset} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.paper, padding: spacing.page, gap: spacing.section },
  header: { flexDirection: "row", alignItems: "center", minHeight: 52, gap: 12 },
  logoMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  logoText: { color: colors.sky, fontSize: 20, fontWeight: "800" },
  headerCopy: { flex: 1, gap: 1 },
  brand: { color: colors.ink, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  store: { color: colors.inkMuted, fontSize: 12 },
  online: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: colors.sky },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { color: colors.turquoiseDark, fontSize: 12, fontWeight: "700" },
  backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.sky, alignItems: "center", justifyContent: "center" },
  backIcon: { color: colors.ink, fontSize: 30, lineHeight: 32, fontWeight: "300" },
  intro: { gap: 8, marginTop: 16 },
  eyebrow: { color: colors.turquoiseDark, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 30, lineHeight: 35, fontWeight: "800", letterSpacing: -1 },
  amountPanel: { alignItems: "center", paddingVertical: 18, gap: 5 },
  amount: { color: colors.ink, fontSize: 44, lineHeight: 52, fontWeight: "800", letterSpacing: -1.5, fontVariant: ["tabular-nums"] },
  amountHint: { color: colors.inkMuted, fontSize: 13 },
  currencyPicker: { flexDirection: "row", backgroundColor: colors.skyDeep, borderRadius: 16, padding: 4, gap: 4 },
  currencyOption: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 50, borderRadius: 12, gap: 2 },
  currencyActive: { backgroundColor: colors.white, boxShadow: "0 2px 6px rgba(16, 42, 67, 0.08)" },
  currencyCode: { color: colors.inkMuted, fontSize: 13, fontWeight: "800" },
  currencyCodeActive: { color: colors.ink },
  currencyLabel: { color: colors.inkMuted, fontSize: 11 },
  keypad: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  key: { width: "31.8%", minHeight: 58, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line },
  keyPressed: { backgroundColor: colors.skyDeep, transform: [{ scale: 0.97 }] },
  keyText: { color: colors.ink, fontSize: 23, fontWeight: "600", fontVariant: ["tabular-nums"] },
  deleteText: { color: colors.inkMuted, fontSize: 20 },
  primaryButton: { minHeight: 58, borderRadius: 16, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  buttonArrow: { color: colors.sky, fontSize: 22 },
  buttonDisabled: { backgroundColor: colors.line },
  mockNote: { color: colors.inkMuted, fontSize: 11, textAlign: "center", marginTop: -14 },
  reviewContent: { flex: 1, gap: 12, paddingTop: 30 },
  reviewAmount: { backgroundColor: colors.sky, borderRadius: 20, padding: 24, marginTop: 20, gap: 5 },
  reviewLabel: { color: colors.inkMuted, fontSize: 13 },
  reviewValue: { color: colors.ink, fontSize: 38, fontWeight: "800", fontVariant: ["tabular-nums"] },
  reviewCurrency: { color: colors.turquoiseDark, fontSize: 13, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12 },
  infoIcon: { color: colors.turquoiseDark, fontSize: 12, fontWeight: "800", width: 30, textAlign: "center" },
  infoText: { flex: 1, color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  bottomActions: { gap: 12, marginTop: "auto" },
  secondaryButton: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: colors.inkMuted, fontSize: 14, fontWeight: "700" },
  qrContent: { alignItems: "center", gap: 12, paddingTop: 18 },
  qrAmount: { color: colors.ink, fontSize: 27, fontWeight: "800", marginBottom: 8, fontVariant: ["tabular-nums"] },
  qrFrame: { width: 238, height: 238, borderRadius: 20, backgroundColor: colors.white, borderWidth: 10, borderColor: colors.white, alignItems: "center", justifyContent: "center", boxShadow: "0 5px 16px rgba(16, 42, 67, 0.12)" },
  qrGrid: { width: 190, height: 190, flexDirection: "row", flexWrap: "wrap" },
  qrCell: { width: "14.28%", height: "14.28%", backgroundColor: colors.white },
  qrCellFilled: { backgroundColor: colors.ink },
  qrCenter: { position: "absolute", width: 42, height: 42, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: colors.white },
  qrCenterText: { color: colors.sky, fontSize: 19, fontWeight: "800" },
  qrHint: { color: colors.inkMuted, fontSize: 13 },
  mockConfirm: { minHeight: 50, borderRadius: 14, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center" },
  mockConfirmText: { color: colors.turquoiseDark, fontSize: 14, fontWeight: "800" },
  successContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, minHeight: 420 },
  successMark: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  successCheck: { color: colors.white, fontSize: 42, fontWeight: "400" },
  successEyebrow: { color: colors.success, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  successTitle: { color: colors.ink, fontSize: 42, fontWeight: "800", letterSpacing: -1 },
  successAmount: { color: colors.ink, fontSize: 30, fontWeight: "800", fontVariant: ["tabular-nums"] },
  successTime: { color: colors.inkMuted, fontSize: 13, marginTop: 3 },
});
