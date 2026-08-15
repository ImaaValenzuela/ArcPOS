import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const walletKey = "arcpos:demo-wallet-usdc";

export function useSimulatedWallet() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    void AsyncStorage.getItem(walletKey).then((stored) => {
      if (stored) setBalance(Number(stored));
    });
  }, []);

  async function credit(amount: number) {
    const nextBalance = balance + amount;
    setBalance(nextBalance);
    await AsyncStorage.setItem(walletKey, String(nextBalance));
  }

  return { balance, credit };
}
