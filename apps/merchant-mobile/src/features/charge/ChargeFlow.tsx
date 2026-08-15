import React, { useState } from "react";
import { useChargeFlow } from "./hooks/useChargeFlow";
import { ChargeStep, ReviewStep, QrStep, SuccessStep } from "./components/index";
import { useUsdcQuote } from "./hooks/useUsdcQuote";
import { useSimulatedWallet } from "./hooks/useSimulatedWallet";

export function ChargeFlow() {
  const {
    screen,
    amount,
    currency,
    setCurrency,
    addKey,
    resetCharge,
    goToScreen,
  } = useChargeFlow();
  const usdcQuote = useUsdcQuote();
  const wallet = useSimulatedWallet();
  const [qrPayload, setQrPayload] = useState<string>();
  const [paymentId, setPaymentId] = useState<string>();
  const usdcAmount = usdcQuote.quote ? Number(amount.replace(",", ".")) / Number(usdcQuote.quote.rate) : 0;

  switch (screen) {
    case "charge":
      return (
        <ChargeStep
          amount={amount}
          currency={currency}
          onAddKey={addKey}
          onCurrency={setCurrency}
          quote={usdcQuote.quote}
          quoteError={usdcQuote.error}
          quoteLoading={usdcQuote.loading}
          onRefreshQuote={usdcQuote.refresh}
          onContinue={() => goToScreen("review")}
        />
      );
    case "review":
      return (
        <ReviewStep
          amount={amount}
          currency={currency}
          quote={usdcQuote.quote}
          onBack={() => goToScreen("charge")}
           onConfirm={async () => {
             const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/merchant/payments/qr`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ merchantId: "demo-merchant", merchantName: "Café del Parque", amount: amount.replace(",", "."), currency }) });
             const payment = await response.json();
             setQrPayload(payment.qrPayload);
             setPaymentId(payment.id);
             goToScreen("qr");
           }}
        />
      );
    case "qr":
      return (
        <QrStep
          amount={amount}
          currency={currency}
          qrPayload={qrPayload ?? "taptopay://pay/creating"}
          paymentId={paymentId}
          onCancel={() => goToScreen("charge")}
          onPaid={async () => {
            if (qrPayload) {
              const token = qrPayload.split("/").pop();
              if (token) await fetch(`${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/customer/payments/qr/${token}/confirm`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ customerId: "merchant-demo" }) });
            }
            void wallet.credit(usdcAmount);
            goToScreen("success");
          }}
        />
      );
    case "success":
      return (
        <SuccessStep
          amount={amount}
          currency={currency}
          onNewCharge={resetCharge}
          walletBalance={wallet.balance + usdcAmount}
        />
      );
    default:
      return null;
  }
}
