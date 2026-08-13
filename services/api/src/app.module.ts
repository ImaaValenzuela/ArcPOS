import { Controller, Get, Module } from "@nestjs/common";

@Controller("health")
class HealthController {
  @Get()
  status() {
    return { status: "ok", service: "arcpos-api", environment: process.env.NODE_ENV ?? "development" };
  }
}

@Module({ controllers: [HealthController] })
export class AppModule {}
