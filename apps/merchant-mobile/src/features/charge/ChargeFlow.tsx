import React from "react";
import { useChargeFlow } from "./hooks/useChargeFlow";
import { ChargeStep, ReviewStep, QrStep, SuccessStep } from "./components/index";

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

  switch (screen) {
    case "charge":
      return (
        <ChargeStep
          amount={amount}
          currency={currency}
          onAddKey={addKey}
          onCurrency={setCurrency}
          onContinue={() => goToScreen("review")}
        />
      );
    case "review":
      return (
        <ReviewStep
          amount={amount}
          currency={currency}
          onBack={() => goToScreen("charge")}
          onConfirm={() => goToScreen("qr")}
        />
      );
    case "qr":
      return (
        <QrStep
          amount={amount}
          currency={currency}
          onCancel={() => goToScreen("charge")}
          onPaid={() => goToScreen("success")}
        />
      );
    case "success":
      return (
        <SuccessStep
          amount={amount}
          currency={currency}
          onNewCharge={resetCharge}
        />
      );
    default:
      return null;
  }
}
