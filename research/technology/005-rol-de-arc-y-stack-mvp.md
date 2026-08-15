# Rol de Arc y stack recomendado para el MVP

- **ID:** `technology-005`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-15`
- **Área:** tecnología y producto

## Pregunta

¿Qué parte del producto debe usar Arc y qué componentes de Circle conviene incorporar primero?

## Decisión provisional

Arc debe funcionar como **riel de settlement en USDC para el comercio**, no como reemplazo del PSP argentino, del QR interoperable ni del sistema bancario local.

```text
Comercio -> ArcPOS -> PSP argentino -> cobro ARS -> ledger
Cliente  -> wallet compatible -> USDC en Arc -> wallet del comercio -> ledger
```

El primer MVP debe probar la operación y la demanda, no custodiar fondos ni crear infraestructura financiera propia.

## Qué usar

### 1. Arc Testnet

- Para simular cobros y settlement en USDC.
- Arc es EVM-compatible y usa USDC como gas nativo.
- Los importes de negocio deben tratarse como USDC ERC-20 con 6 decimales; no se deben sumar ni mostrar por separado las vistas nativa y ERC-20 del mismo saldo.
- Verificar siempre el chain ID de Arc Testnet (`5042002`) antes de enviar transacciones.

### 2. Wallet del comercio

Para el prototipo, usar una wallet controlada por el comercio o una wallet de prueba explícitamente asignada al comercio. ArcPOS sólo debe registrar la dirección, generar una solicitud de pago y observar la confirmación.

No custodiar claves privadas de comercios reales en el MVP. Si más adelante el producto necesita custodiar fondos o automatizar payouts, evaluar Circle Developer-Controlled Wallets con revisión legal, controles de acceso, idempotencia, webhooks y manejo seguro del entity secret.

### 3. PSP argentino

Mantener `SandboxQrProvider` y luego integrar un PSP/adquirente/aceptador habilitado para ARS, QR dinámico, webhooks y liquidación local. Arc no resuelve este componente.

### 4. Ledger interno

El activo diferencial inicial es el ledger: `PaymentIntent`, confirmación, comisión, tipo de cambio aplicado, settlement, reembolsos y conciliación. El ledger no debe asumir que una confirmación on-chain equivale automáticamente a liquidación bancaria.

## Qué no usar todavía

- **Gateway:** no hace falta mientras sólo se cobre en Arc. Tiene sentido cuando los pagadores llegan desde varias cadenas y necesitamos una balance unificada o transferencias cross-chain rápidas.
- **CCTP/Bridge Kit:** no hace falta para el primer flujo. Sirve para mover USDC entre cadenas, no para resolver la aceptación ARS ni la conciliación.
- **Smart contract propio:** no hace falta para pagos simples a una dirección. Agregarlo sólo si necesitamos escrow, reparto, fees programables, suscripciones u otra lógica que no pueda resolverse off-chain.
- **Wallet de cliente propia:** no construirla inicialmente. El pagador debería usar wallets existentes o un payment link compatible.
- **Developer-Controlled Wallets para usuarios:** evitarlo al principio porque introduce custodia, seguridad operacional y obligaciones regulatorias.

## Arquitectura MVP recomendada

```text
merchant-mobile/web
        |
        v
PaymentIntent API
   |            |
   v            v
PSP ARS     Arc USDC observer
   |            |
   +------> Internal ledger <------+
                     |
                     v
          reconciliation/reporting
```

El observer debe validar red, token, destinatario, monto, identificador de pago y confirmaciones suficientes. Los webhooks de PSP y los eventos on-chain deben ser idempotentes y auditables.

## Investigación priorizada

### P0: validar demanda y operación

- Entrevistar 10-15 comercios de turismo, hotelería, gastronomía premium, servicios y freelancers.
- Medir cuántos cobros internacionales reciben, qué monedas usan hoy y qué problema tienen con conversión, liquidación o conciliación.
- Probar un concierge MVP con payment links y conciliación manual.
- Definir disposición a pagar y volumen mínimo mensual.

### P0: validar viabilidad local

- Identificar PSPs argentinos que ofrezcan QR dinámico, webhooks, liquidación a CBU/CVU y modelo white-label.
- Confirmar quién asume KYC/AML, fraude, reclamos, reversos y obligaciones de reporte.
- Obtener asesoramiento legal sobre aceptar, convertir o liquidar USDC para comercios argentinos.

### P1: validar la cadena y la UX

- Confirmar wallets que pueden pagar USDC en Arc Testnet y Mainnet cuando exista disponibilidad productiva.
- Medir tiempo desde pago hasta detección y confirmación.
- Testear payment links, QR de pago y fallback cuando el usuario no tiene USDC en Arc.
- Comparar costo total contra usar una plataforma existente.

### P1: validar el settlement

- Definir si el comercio quiere conservar USDC, recibir ARS o elegir por operación.
- Investigar proveedores de conversión/off-ramp y sus límites para Argentina.
- Modelar comisiones, spread, impuestos, tipo de cambio, fees y conciliación.

### P2: investigar escalabilidad

- Evaluar Gateway sólo si aparecen pagos desde múltiples cadenas.
- Evaluar CCTP sólo si el flujo requiere mover USDC entre cadenas de forma recurrente.
- Evaluar wallets developer-controlled sólo si la custodia o automatización es una necesidad demostrada.
- Evaluar contrato propio sólo después de identificar una regla de negocio que lo justifique.

## Criterio de éxito

La idea avanza si al menos 5 de 10 comercios entrevistados reportan un problema recurrente de cobros internacionales o settlement y 3 aceptarían probar el concierge MVP. La integración con Arc se justifica si los comercios valoran recibir USDC o si reduce fricción/costo frente a la alternativa actual.

## Fuentes

- [Arc Docs](https://docs.arc.network/llms.txt) - conceptos de red, consultado: `2026-08-15`.
- [Circle Developer Docs](https://developers.circle.com/llms.txt) - wallets y productos, consultado: `2026-08-15`.
- [Arc Testnet Explorer](https://testnet.arcscan.app) - consultado: `2026-08-15`.
- [Circle Faucet](https://faucet.circle.com) - consultado: `2026-08-15`.
- [Gateway](https://developers.circle.com/gateway/quickstarts/unified-balance-evm.md) - evaluado como etapa posterior, consultado: `2026-08-15`.
