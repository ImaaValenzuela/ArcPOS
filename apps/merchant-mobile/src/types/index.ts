export type Currency = "ARS" | "USDC";

export type ChargeScreenStep = "charge" | "review" | "qr" | "success";

export type UsdcQuote = {
  rate: string;
  quotedAt: string;
  expiresInSeconds: number;
  source: string;
};

export type OnboardingScreenStep =
  | "welcome"
  | "signin"
  | "account"
  | "wallet"
  | "store"
  | "preference"
  | "summary"
  | "ready";

export interface MerchantProfile {
  storeName: string;
  category: string;
  preference: Currency;
  username: string;
}
