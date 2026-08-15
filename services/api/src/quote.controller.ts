import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";

@Controller("merchant/quotes")
export class QuoteController {
  @Get("usdc-ars")
  quote() {
    const rate = process.env.USDC_ARS_RATE ?? (process.env.NODE_ENV === "production" ? undefined : "1200");
    if (!rate || !/^\d+(\.\d+)?$/.test(rate)) {
      throw new ServiceUnavailableException("USDC_ARS_RATE is not configured for production");
    }
    return { pair: "USDC/ARS", rate, source: process.env.USDC_ARS_RATE ? "configured" : "sandbox-default", quotedAt: new Date().toISOString(), expiresInSeconds: 30 };
  }
}
