import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { arcTestnet } from "@arcpos/config";
import { ArcService } from "./arc.service.js";

const addressPattern = /^0x[0-9a-fA-F]{40}$/;
const amountPattern = /^(0|[1-9]\d*)(\.\d{1,6})?$/;
const payments = new Map<string, { id: string; merchantId: string; amount: string; amountUnits: string; destination: string; status: string; createdAt: string }>();

@Controller("merchant/payments")
export class PaymentsController {
  constructor(private readonly arc: ArcService) {}

  @Get("arc/network")
  network() {
    return this.arc.getNetwork();
  }

  @Post("arc")
  createArcPayment(@Body() body: { merchantId?: string; amount?: string; destination?: string }) {
    if (!body.merchantId || !body.amount || !amountPattern.test(body.amount) || !body.destination || !addressPattern.test(body.destination)) {
      throw new BadRequestException("merchantId, amount with up to 6 decimals and a valid Arc EVM destination are required");
    }
    const [whole, fraction = ""] = body.amount.split(".");
    const amountUnits = `${whole}${fraction.padEnd(6, "0")}`.replace(/^0+(?=\d)/, "");
    const id = crypto.randomUUID();
    const payment = { id, merchantId: body.merchantId, amount: body.amount, amountUnits, destination: body.destination, status: "pending", createdAt: new Date().toISOString() };
    payments.set(id, payment);
    return { ...payment, rail: "arc-usdc", network: "arc-testnet", token: "USDC", decimals: arcTestnet.usdcDecimals, explorerUrl: arcTestnet.explorerUrl };
  }

  @Get(":id")
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
