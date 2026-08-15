import { UsdcQuote } from "../../../types";

export const SANDBOX_USDC_ARS_RATE = "1484.66";

export function useUsdcQuote() {
  const quote: UsdcQuote = {
    rate: SANDBOX_USDC_ARS_RATE,
    quotedAt: new Date().toISOString(),
    expiresInSeconds: 30,
    source: "hardcoded-sandbox",
  };

  return { quote, error: "", loading: false, refresh: () => undefined };
}
