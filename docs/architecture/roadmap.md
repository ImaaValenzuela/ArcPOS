# Roadmap técnico

## Fase 0: base

- [x] Monorepo pnpm/Turborepo.
- [x] Apps Expo y Next.js.
- [x] API NestJS.
- [x] PostgreSQL y Redis locales.
- [x] Documentación y Circle Skills.

## Fase 1: sandbox de pagos

- [ ] Persistencia Prisma.
- [ ] Alta de comercio y usuario.
- [ ] Crear `PaymentIntent`.
- [ ] QR sandbox dinámico.
- [ ] Confirmar aprobado, rechazado y expirado.
- [ ] Ledger con idempotencia.
- [ ] Webhook sandbox repetible.
- [ ] Dashboard de ventas.

## Fase 2: primer proveedor fiat

- [ ] Seleccionar PSP/adquirente habilitado.
- [ ] Implementar adaptador y verificación de firma.
- [ ] Conciliación diaria.
- [ ] Liquidación ARS.
- [ ] Reembolsos y disputas.

## Fase 3: cripto

- [ ] Validar Arc testnet.
- [ ] Confirmar capacidades actuales de Circle.
- [ ] Adaptador USDC.
- [ ] Confirmación on-chain.
- [ ] Liquidación USDC.

## Fase 4: producción

- [ ] KYC/KYB, AML y modelo contractual.
- [ ] Seguridad y threat model.
- [ ] Observabilidad y alertas.
- [ ] Tap-to-Pay con adquirente elegible.
- [ ] Pruebas de carga y recuperación.
