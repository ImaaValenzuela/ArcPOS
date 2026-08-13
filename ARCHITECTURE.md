# Arquitectura de ArcPOS

## Límites del sistema

```text
merchant-mobile / merchant-web
             |
          NestJS API
             |
  PaymentIntent + internal ledger
             |
       provider adapters
       /                 \
 sandbox QR          Circle / Arc
```

Las apps sólo consumen la API. El backend es responsable de autenticación, autorización, validación, idempotencia y consistencia del ledger.

## Capas

1. **Interfaces:** HTTP, webhooks y futuros eventos de proveedores.
2. **Aplicación:** casos de uso como crear, confirmar, reembolsar y liquidar pagos.
3. **Dominio:** estados, importes, moneda, comisiones y reglas de transición.
4. **Infraestructura:** PostgreSQL, Redis y adaptadores externos.

El scaffold actual contiene interfaces y tipos de dominio mínimos. Los casos de uso y persistencia se incorporarán en el siguiente incremento, manteniendo estos límites.

## Reglas financieras

- Los importes monetarios se transportan como strings decimales o unidades mínimas; nunca como `number` JavaScript.
- Cada operación externa tiene una clave idempotente.
- Una referencia externa sólo puede contabilizarse una vez.
- `confirmed` no implica `settled`.
- El sandbox no simula una confirmación bancaria ni una confirmación on-chain real.

## Fases

1. **Sandbox:** PaymentIntent, QR simulado, confirmaciones, ledger y webhooks repetibles.
2. **PSP argentino:** un adquirente, conciliación y liquidación ARS.
3. **Arc testnet:** USDC, confirmación on-chain y adaptación de Circle.
4. **Producción:** compliance, observabilidad, seguridad, soporte y Tap-to-Pay mediante proveedor elegible.

## Decisiones postergadas

Kafka, custodia de claves, USYC y microservicios independientes quedan fuera hasta que el volumen, la regulación o una integración concreta los justifique. PostgreSQL y Redis cubren el sandbox y el primer producto operativo.
