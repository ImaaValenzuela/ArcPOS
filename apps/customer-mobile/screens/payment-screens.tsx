import { Pressable, StyleSheet, Text, View } from "react-native";
import { BrandHeader } from "../components/brand-header";
import { MerchantSummary } from "../components/merchant-summary";
import { PaymentMethod, PaymentMethodRow } from "../components/payment-method-row";
import { colors, spacing } from "../theme/colors";

export type Screen = "request" | "method" | "review" | "processing" | "success" | "error" | "receipt";

const amount = "$ 12.500 ARS";

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}><Text style={styles.primaryText}>{label}</Text><Text style={styles.arrow}>→</Text></Pressable>;
}

export function RequestScreen({ onContinue }: { onContinue: () => void }) {
  return <><BrandHeader /><View style={styles.content}><Text style={styles.eyebrow}>SOLICITUD DE PAGO</Text><Text style={styles.title}>Te están cobrando.</Text><MerchantSummary /><View style={styles.amountCard}><Text style={styles.amountLabel}>Total</Text><Text style={styles.amount}>{amount}</Text><Text style={styles.expires}>Este cobro vence en 09:42</Text></View><Text style={styles.safeCopy}>Verificá el comercio y el importe antes de continuar.</Text></View><View style={styles.bottom}><PrimaryButton label="Continuar" onPress={onContinue} /></View></>;
}

export function MethodScreen({ selected, onSelect, onBack, onContinue }: { selected: PaymentMethod; onSelect: (method: PaymentMethod) => void; onBack: () => void; onContinue: () => void }) {
  return <><BrandHeader onBack={onBack} /><View style={styles.content}><Text style={styles.eyebrow}>MÉTODO DE PAGO</Text><Text style={styles.title}>¿Cómo querés pagar?</Text><View style={styles.methodList}><PaymentMethodRow method="local" selected={selected === "local"} onPress={() => onSelect("local")} /><PaymentMethodRow method="usdc" selected={selected === "usdc"} onPress={() => onSelect("usdc")} /><PaymentMethodRow method="wallet" selected={selected === "wallet"} onPress={() => onSelect("wallet")} /></View></View><View style={styles.bottom}><PrimaryButton label="Revisar pago" onPress={onContinue} /></View></>;
}

export function ReviewScreen({ method, onBack, onConfirm }: { method: PaymentMethod; onBack: () => void; onConfirm: () => void }) {
  const isUsdc = method === "usdc";
  return <><BrandHeader onBack={onBack} /><View style={styles.content}><Text style={styles.eyebrow}>REVISÁ TU PAGO</Text><Text style={styles.title}>Casi terminamos.</Text><MerchantSummary /><View style={styles.summary}><Text style={styles.summaryLabel}>Total</Text><Text style={styles.summaryAmount}>{isUsdc ? "12,50 USDC" : amount}</Text>{isUsdc ? <><Text style={styles.summaryDetail}>El comercio recibe $ 12.500 ARS</Text><View style={styles.divider} /><Text style={styles.summaryMeta}>Conversión mock · comisión incluida</Text></> : <Text style={styles.summaryDetail}>Billetera local</Text>}</View></View><View style={styles.bottom}><PrimaryButton label="Confirmar pago" onPress={onConfirm} /><Text style={styles.disclaimer}>Al confirmar, simularemos el pago sin mover dinero real.</Text></View></>;
}

export function ProcessingScreen({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
  return <><BrandHeader /><View style={styles.centerContent}><View style={styles.processingMark}><View style={styles.processingDot} /></View><Text style={styles.centerTitle}>Confirmando tu pago</Text><Text style={styles.centerCopy}>{amount}{"\n"}Estamos simulando la autorización.</Text><Pressable onPress={onSuccess} style={styles.mockButton}><Text style={styles.mockButtonText}>Simular pago aprobado</Text></Pressable><Pressable onPress={onError} style={styles.textButton}><Text style={styles.textButtonText}>Simular rechazo</Text></Pressable></View></>;
}

export function SuccessScreen({ onDone }: { onDone: () => void }) {
  return <><BrandHeader /><View style={styles.centerContent}><View style={styles.successMark}><Text style={styles.successIcon}>✓</Text></View><Text style={styles.successEyebrow}>PAGO CONFIRMADO</Text><Text style={styles.centerTitle}>Listo.</Text><Text style={styles.successAmount}>{amount}</Text><Text style={styles.centerCopy}>Café del Parque{"\n"}Pago simulado · Ahora</Text></View><View style={styles.bottom}><PrimaryButton label="Ver comprobante" onPress={onDone} /></View></>;
}

export function ErrorScreen({ onRetry, onCancel }: { onRetry: () => void; onCancel: () => void }) {
  return <><BrandHeader onBack={onCancel} /><View style={styles.centerContent}><View style={styles.errorMark}><Text style={styles.errorIcon}>!</Text></View><Text style={styles.centerTitle}>El pago no fue aprobado.</Text><Text style={styles.centerCopy}>No se realizó ningún cobro.{"\n"}Podés intentar con otro método.</Text></View><View style={styles.bottom}><PrimaryButton label="Intentar nuevamente" onPress={onRetry} /><Pressable onPress={onCancel} style={styles.textButton}><Text style={styles.textButtonText}>Cancelar</Text></Pressable></View></>;
}

export function ReceiptScreen({ onNewPayment }: { onNewPayment: () => void }) {
  return <><BrandHeader /><View style={styles.content}><Text style={styles.eyebrow}>COMPROBANTE</Text><Text style={styles.title}>Pago realizado.</Text><View style={styles.receipt}><Text style={styles.receiptStatus}>✓ Confirmado</Text><Text style={styles.receiptMerchant}>Café del Parque</Text><Text style={styles.receiptAmount}>{amount}</Text><View style={styles.divider} /><Text style={styles.receiptMeta}>13 de agosto de 2026 · 14:32</Text><Text style={styles.receiptMeta}>Código AP-MOCK-0001</Text></View></View><View style={styles.bottom}><PrimaryButton label="Listo" onPress={onNewPayment} /></View></>;
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.section, paddingTop: 28 },
  eyebrow: { color: colors.turquoiseDark, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 31, lineHeight: 36, fontWeight: "800", letterSpacing: -1 },
  amountCard: { backgroundColor: colors.sky, borderRadius: 22, padding: 24, gap: 6 },
  amountLabel: { color: colors.inkMuted, fontSize: 13 },
  amount: { color: colors.ink, fontSize: 38, fontWeight: "800", fontVariant: ["tabular-nums"] },
  expires: { color: colors.turquoiseDark, fontSize: 12, fontWeight: "700" },
  safeCopy: { color: colors.inkMuted, fontSize: 14, lineHeight: 20, paddingHorizontal: 4 },
  bottom: { gap: 12, marginTop: "auto" },
  primary: { minHeight: 58, borderRadius: 16, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 12 },
  pressed: { transform: [{ scale: 0.98 }] },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  arrow: { color: colors.sky, fontSize: 22 },
  methodList: { gap: 12 },
  summary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 22, gap: 6 },
  summaryLabel: { color: colors.inkMuted, fontSize: 13 },
  summaryAmount: { color: colors.ink, fontSize: 30, fontWeight: "800", fontVariant: ["tabular-nums"] },
  summaryDetail: { color: colors.turquoiseDark, fontSize: 13, fontWeight: "700" },
  summaryMeta: { color: colors.inkMuted, fontSize: 12 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 12 },
  disclaimer: { color: colors.inkMuted, textAlign: "center", fontSize: 11, lineHeight: 16, paddingHorizontal: 16 },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 16 },
  processingMark: { width: 78, height: 78, borderRadius: 26, backgroundColor: colors.skyDeep, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  processingDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.turquoise },
  centerTitle: { color: colors.ink, fontSize: 29, lineHeight: 34, fontWeight: "800", letterSpacing: -0.8, textAlign: "center" },
  centerCopy: { color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  mockButton: { marginTop: 24, borderRadius: 14, backgroundColor: colors.skyDeep, paddingHorizontal: 18, paddingVertical: 13 },
  mockButtonText: { color: colors.turquoiseDark, fontSize: 13, fontWeight: "800" },
  textButton: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  textButtonText: { color: colors.inkMuted, fontSize: 14, fontWeight: "700" },
  successMark: { width: 78, height: 78, borderRadius: 26, backgroundColor: colors.success, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  successIcon: { color: colors.white, fontSize: 43, fontWeight: "400" },
  successEyebrow: { color: colors.success, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  successAmount: { color: colors.ink, fontSize: 30, fontWeight: "800", marginTop: 5, fontVariant: ["tabular-nums"] },
  errorMark: { width: 78, height: 78, borderRadius: 26, backgroundColor: "#FCEFEF", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  errorIcon: { color: colors.error, fontSize: 39, fontWeight: "800" },
  receipt: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 22, gap: 8 },
  receiptStatus: { color: colors.success, fontSize: 13, fontWeight: "800" },
  receiptMerchant: { color: colors.ink, fontSize: 18, fontWeight: "800", marginTop: 14 },
  receiptAmount: { color: colors.ink, fontSize: 31, fontWeight: "800", fontVariant: ["tabular-nums"] },
  receiptMeta: { color: colors.inkMuted, fontSize: 12 },
});
