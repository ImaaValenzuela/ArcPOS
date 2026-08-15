import { Controller, Get, Module } from "@nestjs/common";
import { ArcService } from "./arc.service.js";
import { PaymentsController } from "./payments.controller.js";

@Controller("health")
class HealthController {
  @Get()
  status() {
    return { status: "ok", service: "arcpos-api", environment: process.env.NODE_ENV ?? "development" };
  }
}

@Module({ controllers: [HealthController, PaymentsController], providers: [ArcService] })
export class AppModule {}
