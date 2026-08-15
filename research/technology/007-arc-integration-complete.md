# Integración completa con Arc

- **ID:** `technology-007`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-15`
- **Área:** tecnología, pagos y settlement
- **Producto:** ArcPOS Argentina

## Propósito

Este documento describe exactamente qué utiliza ArcPOS de Arc hoy, qué componentes de Circle/Arc están previstos y cómo debería evolucionar el flujo hasta un settlement real de USDC. La distinción entre implementado, simulado y futuro es obligatoria: el sandbox no debe presentarse como dinero real ni como una conversión ARS/USDC productiva.

## Resumen ejecutivo

ArcPOS utiliza Arc como **red EVM de settlement de USDC**. Arc no cobra ARS, no convierte pesos, no realiza KYC y no crea automáticamente la wallet del comercio.

El producto objetivo es:

```text
Cliente paga ARS
       |
       v
PSP argentino confirma el pago
       |
       v
PSAV/liquidity partner convierte ARS -> USDC
       |
       v
USDC se envía a una wallet del comercio en Arc
       |
       v
ArcPOS detecta y concilia la transferencia
```

## Estado actual

### Implementado

#### Configuración de Arc Testnet

Está centralizada en `packages/config/src/index.ts`:

```ts
{
  chainId: 5042002,
  rpcUrl: "https://rpc.testnet.arc.network",
  explorerUrl: "https://testnet.arcscan.app",
  usdcAddress: "0x3600000000000000000000000000000000000000",
  usdcDecimals: 6
}
```

El backend también admite `ARC_TESTNET_RPC_URL` para reemplazar el RPC por configuración de entorno.

#### Adaptador RPC

`services/api/src/arc.service.ts` usa `fetch` y JSON-RPC, sin SDK blockchain.

Métodos actuales:

- `eth_chainId`: verifica la red conectada.
- `eth_blockNumber`: obtiene el bloque más reciente.
- `eth_getLogs`: busca transferencias de USDC.

El adaptador también consulta el balance ERC-20 real mediante `eth_call` usando
`balanceOf(address)` contra el contrato USDC de Arc Testnet. El endpoint expuesto
es `GET /merchant/payments/arc/balance/:address`. El balance se devuelve en
unidades mínimas y en formato USDC; no se suma con el balance nativo de gas.

El adaptador no firma, no envía transacciones y no administra claves.

#### Detección de transferencias

El servicio filtra el evento ERC-20 estándar:

```text
Transfer(address,address,uint256)
```

La detección filtra por:

- contrato USDC de Arc Testnet;
- dirección destino del comercio;
- ventana de los últimos 1.000 bloques;
- cantidad esperada en unidades mínimas.

Las cantidades USDC se comparan como `bigint`, no como `number`.

#### PaymentIntent Arc

El dominio reconoce:

```ts
type PaymentRail = "sandbox-qr" | "arc-usdc";
```

Los PaymentIntent Arc incluyen:

- `merchantId`;
- monto decimal;
- monto en unidades mínimas;
- dirección destino;
- `arc-testnet`;
- estado;
- fecha de creación;
- referencia externa opcional.

#### Endpoints existentes

Crear PaymentIntent:

```text
POST /merchant/payments/arc
```

Ejemplo:

```json
{
  "merchantId": "merchant-demo",
  "amount": "10.00",
  "destination": "0x0000000000000000000000000000000000000000"
}
```

Consultar red:

```text
GET /merchant/payments/arc/network
```

Consultar estado:

```text
GET /merchant/payments/:id
```

#### Mobile sandbox

El mobile calcula localmente:

```text
1 USDC = 1.484,66 ARS
```

La cotización está en:

```text
apps/merchant-mobile/src/features/charge/hooks/useUsdcQuote.ts
```

No representa una cotización de mercado ni ejecuta una conversión.

#### Wallet simulada

Los cobros simulados se acumulan en AsyncStorage:

```text
arcpos:demo-wallet-usdc
```

Esta wallet es sólo un balance local. No tiene clave, dirección, saldo on-chain ni capacidad de firmar.

## Estado no implementado

Actualmente ArcPOS no realiza:

- transferencias reales de USDC;
- conversión ARS/USDC;
- creación de wallets blockchain;
- custodia de claves;
- firma de transacciones;
- despliegue de contratos;
- lectura de saldo ERC-20 del merchant;
- generación de payment links on-chain;
- uso de App Kit;
- uso de Gateway;
- uso de CCTP o Bridge Kit;
- uso de Swap Kit o StableFX;
- webhooks de Circle;
- indexación persistente de logs;
- persistencia PostgreSQL de PaymentIntent;
- protección contra doble contabilización en base de datos;
- reconciliación productiva.

## Modelo conceptual de Arc

### Arc como red EVM

Arc es compatible con herramientas EVM y contratos Solidity. En ArcPOS esto permite utilizar posteriormente:

- JSON-RPC estándar;
- viem o ethers;
- contratos ERC-20;
- eventos EVM;
- exploradores y herramientas EVM.

No se necesita un smart contract propio para enviar USDC directamente a una wallet del comercio.

### USDC como gas nativo

Arc utiliza USDC como activo de gas. Esto requiere distinguir dos representaciones del mismo pool:

- vista nativa para gas, con unidades de 18 decimales;
- vista ERC-20 para balances y transferencias, con 6 decimales.

Reglas obligatorias:

- mostrar al usuario un único saldo USDC;
- usar 6 decimales en importes de negocio;
- usar 18 decimales sólo para cálculos crudos de gas o `msg.value`;
- no sumar saldo nativo y saldo ERC-20;
- no tratar native USDC y ERC-20 USDC como dos activos;
- no invocar `decimals()` sobre una dirección sentinel nativa;
- verificar el chain ID antes de enviar una transacción.

### Finalidad

Arc está diseñado para finalización determinística rápida. ArcPOS no debe marcar un pago como liquidado sólo porque una transacción fue enviada: debe esperar una evidencia verificable de inclusión y finalización según la política de la red y del proveedor RPC.

## Arquitectura actual

```text
merchant-mobile / merchant-web
              |
              v
        NestJS API
              |
              +--> PaymentIntent en memoria
              |
              +--> ArcService
                       |
                       v
                 Arc JSON-RPC
                       |
                       v
                 eth_getLogs
```

La arquitectura actual es observadora: espera una transferencia que otro actor debería enviar.

## Arquitectura objetivo

```text
                           +------------------+
                           | PSP argentino    |
Cliente -- ARS ---------->| cobro y webhook   |
                           +--------+---------+
                                    |
                                    v
                           +------------------+
                           | ArcPOS API       |
                           | PaymentIntent    |
                           | quote/ledger     |
                           +---+----------+---+
                               |          |
                conversión     |          | observación
                ARS -> USDC     |          v
                               |   +--------------+
                               +-->| Arc RPC      |
                                   | USDC events  |
                                   +------+-------+
                                          |
                                          v
                                   Wallet merchant
```

El PSAV o liquidity partner debe realizar la conversión ARS/USDC y enviar el USDC a la dirección del comercio. ArcPOS registra y concilia, pero no debería custodiar fondos en el primer corte.

## Wallet del merchant

### Opción MVP recomendada

El comercio proporciona una dirección EVM de settlement. ArcPOS guarda sólo:

- dirección pública;
- red permitida;
- activo permitido;
- fecha de validación;
- estado de whitelist.

ArcPOS no guarda la clave privada.

### Developer-Controlled Wallets

Debe evaluarse sólo si el producto necesita:

- crear wallets automáticamente;
- custodiar fondos;
- enviar payouts;
- firmar transacciones desde backend;
- automatizar tesorería.

Esto agrega entity secret, API keys, políticas de acceso, recuperación, compliance y riesgo de custodia. No debe activarse sólo porque simplifica el prototipo.

### User-Controlled o Modular Wallets

Son alternativas si el comercio debe controlar sus propias claves o usar passkeys. No son necesarias para el primer flujo ARS checkout -> USDC settlement.

## Conversión ARS a USDC

Arc no convierte monedas fiduciarias. ArcPOS necesita un servicio externo para:

1. obtener una cotización;
2. bloquear la cotización durante una ventana;
3. confirmar el pago ARS;
4. ejecutar la compra de USDC;
5. enviar USDC a la wallet del comercio;
6. devolver el TXID y el estado final.

La cotización hardcodeada del mobile sólo sirve para UX de sandbox. En producción debe venir del proveedor que ejecuta la conversión, no de una fuente genérica de precios.

## Componentes Circle evaluados

### Circle Wallets

Sirve para wallets programables developer-controlled, user-controlled o modular. No está integrado actualmente.

### Gateway

Sirve para una balance USDC unificada entre varias cadenas y transferencias cross-chain rápidas. No hace falta si el flujo inicial sólo usa Arc.

Se evaluará cuando:

- los usuarios lleguen desde varias cadenas;
- el merchant necesite recibir USDC desde diferentes redes;
- se necesite capital unificado.

### CCTP / Bridge Kit

Sirve para mover USDC entre cadenas mediante burn-and-mint. No convierte ARS a USDC y no es necesario para un pago que ya termina en Arc.

### App Kit

Agrupa operaciones de bridge, swap, send y unified balance. No reemplaza el PSP argentino ni el cumplimiento fiscal/regulatorio local.

### Smart Contract Platform

No se necesita un contrato para un simple `transfer` de USDC a la wallet del merchant. Se justificaría para:

- escrow;
- split payments;
- comisiones programables;
- suscripciones;
- pagos condicionados;
- settlement multi-party.

### StableFX

Puede evaluarse para FX on-chain cuando el corredor y las monedas estén disponibles para el caso comercial. No debe asumirse que resuelve ARS local ni que reemplaza al PSAV argentino.

## Estados del pago

El flujo debe distinguir al menos:

```text
created
  -> awaiting_ars
  -> ars_confirmed
  -> conversion_pending
  -> conversion_confirmed
  -> arc_transfer_pending
  -> arc_confirmed
  -> settled
```

Estados de error:

```text
expired
conversion_failed
arc_transfer_failed
underpaid
overpaid
wrong_token
wrong_network
wrong_destination
reconciliation_required
```

`ars_confirmed` no significa `settled`.

`arc_transfer_submitted` no significa `arc_confirmed`.

`arc_confirmed` no significa que el comercio recibió ARS: son rieles separados.

## Validación de pagos on-chain

La validación productiva debe comprobar:

- chain ID;
- contrato USDC exacto;
- `from` permitido si el flujo lo requiere;
- `to` igual a la wallet whitelistada;
- monto exacto o regla de tolerancia explícita;
- TXID no utilizado previamente;
- bloque y finalización;
- timestamp dentro de la ventana del PaymentIntent;
- referencia de pago si se incorpora memo o contrato;
- ausencia de duplicación en el ledger.

Filtrar sólo por monto y destino no es suficiente si dos pagos pueden tener el mismo importe.

## Seguridad

### Claves y secretos

- Nunca guardar private keys en mobile.
- Nunca guardar private keys en el repositorio.
- Nunca imprimir entity secrets, API keys o seeds en logs.
- Separar testnet y mainnet.
- No usar una wallet de prueba como wallet productiva.

### Direcciones

- Validar formato EVM.
- Mostrar dirección abreviada y checksum cuando sea posible.
- Usar allowlist para payouts.
- Requerir confirmación al cambiar la wallet del merchant.
- No permitir que el cliente envíe a una dirección elegida libremente para cerrar un pago.

### Idempotencia

Cada operación externa debe tener:

- idempotency key;
- provider reference;
- TXID;
- unique constraint en el ledger.

Un webhook o una consulta repetida no puede sumar dos veces el mismo settlement.

### RPC

- Configurar timeout.
- Reintentar sólo requests de lectura idempotentes.
- Limitar rangos de `eth_getLogs`.
- Manejar rate limits.
- Usar un proveedor RPC confiable en producción.
- Registrar latencia, errores y bloque consultado.

## Observabilidad

Métricas futuras:

- `arc_rpc_request_total`;
- `arc_rpc_error_total`;
- `arc_rpc_latency_ms`;
- `arc_payment_detection_latency_ms`;
- `arc_payment_pending_total`;
- `arc_payment_confirmed_total`;
- `arc_payment_wrong_token_total`;
- `arc_payment_wrong_destination_total`;
- `arc_payment_reconciliation_total`.

Logs mínimos:

- PaymentIntent ID;
- merchant ID;
- red;
- contrato token;
- monto en unidades mínimas;
- dirección destino truncada;
- TXID;
- bloque;
- estado anterior y nuevo.

Nunca deben aparecer claves privadas, seeds o entity secrets.

## Persistencia pendiente

La implementación actual usa `Map` en memoria para PaymentIntent. Eso se pierde al reiniciar la API. Antes de cualquier prueba con dinero real se necesita PostgreSQL con:

- `payment_intents`;
- `payment_attempts`;
- `external_events`;
- `ledger_entries`;
- `merchant_wallets`;
- `quotes`;
- `settlements`.

Restricciones importantes:

- `tx_hash` único;
- referencia externa única por proveedor;
- un settlement por PaymentIntent;
- estado controlado por transición;
- importes como strings/unidades mínimas, no `number`.

## Testing

### Unit tests

- conversión decimal ARS/USDC;
- padding de topics;
- matching de amount units;
- rechazo de dirección inválida;
- rechazo de token incorrecto;
- rechazo de red incorrecta;
- PaymentIntent duplicado;
- TXID repetido;
- underpayment y overpayment.

### Integration tests

- mock JSON-RPC para `eth_chainId`;
- mock `eth_blockNumber`;
- mock `eth_getLogs` con Transfer válido;
- RPC error;
- logs vacíos;
- bloque fuera de ventana.

### Testnet

Antes de ejecutar un pago real de prueba:

1. usar una wallet de testnet;
2. obtener USDC de faucet oficial;
3. confirmar que el gas se paga con USDC;
4. enviar una cantidad pequeña;
5. verificar el TXID en el explorer;
6. comprobar que el observer detecta una sola vez;
7. reiniciar API y comprobar persistencia cuando exista DB.

## Configuración

Variables previstas:

```env
ARC_NETWORK=testnet
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=5042002
ARC_USDC_ADDRESS=0x3600000000000000000000000000000000000000
ARC_CONFIRMATION_POLICY=finalized
```

La tasa actual de sandbox no es una variable Arc:

```env
USDC_ARS_RATE=1484.66
```

En producción debe ser reemplazada por un quote provider real.

## Roadmap recomendado

### Fase 1: sandbox actual

- monto ARS local;
- tasa fija;
- wallet simulada local;
- PaymentIntent in-memory;
- Arc RPC de lectura preparado.

### Fase 2: Arc Testnet real

- merchant wallet de testnet;
- transferencia real de USDC;
- lectura de saldo ERC-20;
- PaymentIntent persistente;
- observer con TXID único;
- prueba end-to-end.

### Fase 3: integración ARS

- PSP argentino;
- webhook verificable;
- quote provider/PSAV;
- conversión ARS/USDC;
- settlement a wallet merchant;
- conciliación y reportes.

### Fase 4: producción

- revisión legal y PSAV;
- KYB/KYC;
- seguridad de wallets;
- monitoreo de riesgo;
- límites y allowlists;
- PostgreSQL altamente disponible;
- RPC redundante;
- soporte, reembolsos y auditoría.

## Criterios de no-go

No pasar a producción si:

- la tasa es hardcodeada;
- el PaymentIntent vive sólo en memoria;
- no existe partner para ARS/USDC;
- ArcPOS custodia claves sin modelo legal aprobado;
- no hay idempotencia por TXID;
- no se distingue `confirmed` de `settled`;
- no se valida token, red y destino;
- no existe política para pagos incorrectos;
- no se puede exportar un reporte fiscal/contable.

## Fuentes

- [Arc Docs - documentación LLM](https://docs.arc.network/llms.txt) - red, EVM, USDC como gas, finality y testnet; consultado: `2026-08-15`.
- [Circle Developer Docs - documentación LLM](https://developers.circle.com/llms.txt) - USDC, wallets, CCTP, Gateway, App Kit y contratos; consultado: `2026-08-15`.
- [Arc Testnet Explorer](https://testnet.arcscan.app) - exploración de transacciones; consultado: `2026-08-15`.
- [Circle Faucet](https://faucet.circle.com) - fondos de testnet; consultado: `2026-08-15`.
- [ArcPOS architecture](../../ARCHITECTURE.md) - límites internos del sistema.
- [Payment lifecycle](../../docs/architecture/payment-lifecycle.md) - estados y reglas de idempotencia.
- [Arc MVP stack](./005-rol-de-arc-y-stack-mvp.md) - decisión de producto inicial.
- [Assets and wallets](./006-activos-y-wallets-para-el-mvp.md) - política de activos y custodia.
