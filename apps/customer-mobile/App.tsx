import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PaymentMethod } from "./components/payment-method-row";
import { ErrorScreen, MethodScreen, ProcessingScreen, ReceiptScreen, RequestScreen, ReviewScreen, Screen, SuccessScreen } from "./screens/payment-screens";
import { colors, spacing } from "./theme/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function App() {
  const [screen, setScreen] = useState<Screen>("request");
  const [method, setMethod] = useState<PaymentMethod>("local");
  const [paymentToken, setPaymentToken] = useState<string>();

  const reset = () => setScreen("request");
  const scan = async (value: string) => {
    const token = value.match(/taptopay:\/\/pay\/([^/?#]+)/)?.[1] ?? value.trim();
    if (!token) return;
    const response = await fetch(`${API_URL}/customer/payments/qr/${token}`);
    if (!response.ok) return;
    setPaymentToken(token);
    setScreen("method");
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
       {screen === "request" && <RequestScreen onContinue={() => setScreen("method")} onScan={scan} />}
      {screen === "method" && <MethodScreen selected={method} onSelect={setMethod} onBack={reset} onContinue={() => setScreen("review")} />}
       {screen === "review" && <ReviewScreen method={method} onBack={() => setScreen("method")} onConfirm={async () => { if (paymentToken) await fetch(`${API_URL}/customer/payments/qr/${paymentToken}/confirm`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ customerId: "demo-customer" }) }); setScreen("processing"); }} />}
      {screen === "processing" && <ProcessingScreen onSuccess={() => setScreen("success")} onError={() => setScreen("error")} />}
      {screen === "success" && <SuccessScreen onDone={() => setScreen("receipt")} />}
      {screen === "error" && <ErrorScreen onRetry={() => setScreen("method")} onCancel={reset} />}
      {screen === "receipt" && <ReceiptScreen onNewPayment={reset} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.paper, padding: spacing.page, gap: spacing.section },
});
