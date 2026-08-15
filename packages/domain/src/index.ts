export type Currency = "ARS" | "USDC";
export type PaymentRail = "sandbox-qr" | "arc-usdc";
export type PaymentStatus = "created" | "pending" | "confirmed" | "failed" | "expired" | "refunded";

export type PaymentIntent = {
  id: string;
  merchantId: string;
  amount: string;
  currency: Currency;
  rail: PaymentRail;
  destination?: string;
  network?: "arc-testnet";
  externalReference?: string;
  status: PaymentStatus;
  createdAt: string;
};
