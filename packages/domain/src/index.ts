export type Currency = "ARS" | "USDC";
export type PaymentStatus = "created" | "pending" | "confirmed" | "failed" | "expired" | "refunded";

export type PaymentIntent = {
  id: string;
  merchantId: string;
  amount: string;
  currency: Currency;
  status: PaymentStatus;
  createdAt: string;
};
