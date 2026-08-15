import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PaymentMethod } from "./components/payment-method-row";
import { ErrorScreen, MethodScreen, ProcessingScreen, ReceiptScreen, RequestScreen, ReviewScreen, Screen, SuccessScreen } from "./screens/payment-screens";
import { colors, spacing } from "./theme/colors";

export default function App() {
  const [screen, setScreen] = useState<Screen>("request");
  const [method, setMethod] = useState<PaymentMethod>("local");

  const reset = () => setScreen("request");

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      {screen === "request" && <RequestScreen onContinue={() => setScreen("method")} />}
      {screen === "method" && <MethodScreen selected={method} onSelect={setMethod} onBack={reset} onContinue={() => setScreen("review")} />}
      {screen === "review" && <ReviewScreen method={method} onBack={() => setScreen("method")} onConfirm={() => setScreen("processing")} />}
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
