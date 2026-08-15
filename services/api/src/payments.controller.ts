import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { arcTestnet } from "@arcpos/config";
import { ArcService } from "./arc.service.js";

const addressPattern = /^0x[0-9a-fA-F]{40}$/;
const amountPattern = /^(0|[1-9]\d*)(\.\d{1,6})?$/;
type Payment = { id: string; merchantId: string; merchantName: string; amount: string; currency: string; amountUnits: string; destination: string; token: string; status: "pending" | "paid" | "cancelled"; createdAt: string; paidAt?: string; customerId?: string };
const payments = new Map<string, Payment>();

@Controller()
export class PaymentsController {
  constructor(private readonly arc: ArcService) {}

  @Get("merchant/payments/arc/network")
  network() {
    return this.arc.getNetwork();
  }

  @Get("merchant/payments/arc/balance/:address")
  balance(@Param("address") address: string) {
    if (!addressPattern.test(address)) throw new BadRequestException("valid Arc EVM address required");
    return this.arc.getUsdcBalance(address);
  }

  @Post("merchant/payments/arc")
  createArcPayment(@Body() body: { merchantId?: string; amount?: string; destination?: string }) {
    if (!body.merchantId || !body.amount || !amountPattern.test(body.amount) || !body.destination || !addressPattern.test(body.destination)) {
      throw new BadRequestException("merchantId, amount with up to 6 decimals and a valid Arc EVM destination are required");
    }
    const [whole, fraction = ""] = body.amount.split(".");
    const amountUnits = `${whole}${fraction.padEnd(6, "0")}`.replace(/^0+(?=\d)/, "");
    const id = crypto.randomUUID();
    const payment: Payment = { id, merchantId: body.merchantId, merchantName: "Arc merchant", amount: body.amount, currency: "USDC", amountUnits, destination: body.destination, token: id, status: "pending", createdAt: new Date().toISOString() };
    payments.set(id, payment);
    return { ...payment, rail: "arc-usdc", network: "arc-testnet", token: "USDC", decimals: arcTestnet.usdcDecimals, explorerUrl: arcTestnet.explorerUrl };
  }

  @Post("merchant/payments/qr")
  createQrPayment(@Body() body: { merchantId?: string; merchantName?: string; amount?: string; currency?: string; destination?: string }) {
    if (!body.merchantId || !body.amount || !amountPattern.test(body.amount) || !body.currency || !["ARS", "USDC"].includes(body.currency)) {
      throw new BadRequestException("merchantId, amount and currency (ARS or USDC) are required");
    }
    const [whole, fraction = ""] = body.amount.split(".");
    const amountUnits = `${whole}${fraction.padEnd(6, "0")}`.replace(/^0+(?=\d)/, "");
    const id = crypto.randomUUID();
    const token = `ttpay_${crypto.randomUUID().replaceAll("-", "")}`;
    const payment: Payment = { id, merchantId: body.merchantId, merchantName: body.merchantName ?? "Café del Parque", amount: body.amount, currency: body.currency, amountUnits, destination: body.destination ?? "0x0000000000000000000000000000000000000001", token, status: "pending", createdAt: new Date().toISOString() };
    payments.set(token, payment);
    return { ...payment, qrPayload: `taptopay://pay/${token}`, rail: "sandbox-usdc", network: "arc-testnet" };
  }

  @Get("customer/payments/qr/:token")
  resolveQr(@Param("token") token: string) {
    const payment = payments.get(token);
    if (!payment || payment.status === "cancelled") throw new BadRequestException("payment QR not found or expired");
    return payment;
  }

  @Post("customer/payments/qr/:token/confirm")
  confirmQr(@Param("token") token: string, @Body() body: { customerId?: string }) {
    const payment = payments.get(token);
    if (!payment || payment.status === "cancelled") throw new BadRequestException("payment QR not found or expired");
    if (payment.status === "pending") Object.assign(payment, { status: "paid", customerId: body.customerId ?? "demo-customer", paidAt: new Date().toISOString() });
    return payment;
  }

  @Get("merchant/payments/:id")
  async status(@Param("id") id: string) {
    const payment = payments.get(id);
    if (!payment) throw new BadRequestException("payment not found");
    if (payment.status === "pending") {
      const result = await this.arc.findPayment({ destination: payment.destination, amount: payment.amountUnits });
      if (result.status === "confirmed") Object.assign(payment, result);
    }
    return payment;
  }
}
