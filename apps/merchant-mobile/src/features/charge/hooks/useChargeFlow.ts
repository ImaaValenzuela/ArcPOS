import { useState } from "react";
import { ChargeScreenStep, Currency } from "../../../types";

export function useChargeFlow() {
  const [screen, setScreen] = useState<ChargeScreenStep>("charge");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("ARS");

  const addKey = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "," && amount.includes(",")) return;
    if (amount.includes(",") && amount.split(",")[1].length >= 2) return;
    if (amount === "0" && key !== ",") {
      setAmount(key);
      return;
    }
    setAmount((prev) => `${prev}${key}`);
  };

  const resetCharge = () => {
    setAmount("");
    setCurrency("ARS");
    setScreen("charge");
  };

  const goToScreen = (targetScreen: ChargeScreenStep) => {
    setScreen(targetScreen);
  };

  return {
    screen,
    amount,
    currency,
    setAmount,
    setCurrency,
    addKey,
    resetCharge,
    goToScreen,
  };
}
