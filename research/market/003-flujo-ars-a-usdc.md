# Flujo de pago ARS a liquidación USDC

- **ID:** `market-003`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-15`
- **Área:** mercado, pagos y operaciones

## Pregunta

¿Cómo puede pagar un usuario en pesos argentinos mientras el comercio recibe USDC?

## Hallazgo principal

Arc no convierte ARS a USDC. El producto necesita separar tres capas:

```text
Usuario paga ARS
       -> PSP argentino confirma el pago
       -> PSAV/exchange/liquidity partner convierte ARS a USDC
       -> USDC se envía a una wallet del comercio por Arc
```

## Flujos posibles

### A. PSP y conversión posterior

El PSP acredita ARS al comercio y luego el comercio vende esos ARS por USDC mediante un proveedor.

**Ventajas:** menor exposición regulatoria y operativa para ArcPOS; arquitectura modular.

**Desventajas:** dos saldos, demora entre cobro y conversión, conciliación más compleja y posible necesidad de fondeo previo.

### B. Proveedor cripto como orquestador

El proveedor recibe o coordina el pago ARS, ejecuta la conversión y entrega USDC al comercio.

**Ventajas:** mejor experiencia integrada y una sola liquidación.

**Desventajas:** mayor dependencia del partner, KYC/AML, custodia, riesgo de contraparte y posible encuadre como PSAV para ArcPOS si éste intermedia la operación.

### C. Usuario paga directamente USDC

El usuario compra USDC por su cuenta y paga al comercio en Arc.

**Ventajas:** ArcPOS no convierte ARS ni custodia fondos.

**Desventajas:** fricción alta; el usuario necesita wallet, USDC en la red correcta y fondos para gas.

## Proveedores a investigar

| Proveedor | Evidencia pública | Rol potencial | Confirmar |
|---|---|---|---|
| Bitso Business | Pagos cross-border, pagos locales, tesorería, FX y stablecoins; muestra Argentina entre sus mercados | Partner B2B de liquidez y settlement | ARS específico, USDC, Arc, APIs, límites y onboarding argentino |
| Ripio | Presencia argentina, APIs para ofrecer cripto, OTC y productos para empresas | PSAV/liquidity partner regional | API empresarial, conversión ARS/USDC, redes soportadas y contrato |
| Mercado Pago y PSPs argentinos | QR y transferencias interoperables | Entrada local de ARS | White-label, webhooks, liquidación y posibilidad contractual de combinar con PSAV |
| Circle | USDC, Arc, wallets, CCTP, Gateway y StableFX | Infraestructura on-chain y potencial FX | Disponibilidad de productos, pares, jurisdicción y acceso comercial |

La existencia de una página comercial no confirma que un proveedor soporte el flujo completo para una sociedad argentina. Se requiere una cotización y revisión contractual.

## Producto recomendado

Mostrar al usuario únicamente:

```text
Total: ARS 100.000
El comercio recibe: USDC  -- cotización bloqueada por X minutos
```

El usuario no debería manejar crypto. El comercio debe elegir una política:

- recibir siempre ARS;
- recibir siempre USDC;
- recibir una proporción configurable;
- recibir USDC sólo sobre ventas internacionales.

## Riesgos económicos

- La cotización ARS/USDC puede cambiar entre autorización, acreditación y conversión.
- El proveedor debe bloquear una cotización y definir expiración.
- Fees, spread, IVA, impuestos y costo de red deben mostrarse antes del pago.
- Un pago ARS confirmado no garantiza que la conversión USDC se complete.
- Una transferencia on-chain confirmada normalmente no es reversible.
- El comercio debe recibir un comprobante que incluya ARS, tipo de cambio, USDC, comisiones y TXID.

## Conclusión

La versión más factible es **ARS checkout + conversión operada por partner + settlement USDC en Arc**. ArcPOS debe comenzar como orquestador y ledger, sin mantener un pool propio ni custodiar fondos. La conversión automática debe activarse sólo después de confirmar un PSAV/liquidity partner dispuesto a asumir ejecución, compliance y liquidación.

## Acciones

- [ ] Solicitar una reunión comercial con Bitso Business y Ripio Business.
- [ ] Pedir API docs, sandbox, fee schedule, límites, SLA y soporte de ARS/USDC/Arc.
- [ ] Consultar a tres PSPs argentinos por QR dinámico, webhooks y modelo de integración.
- [ ] Diseñar un quote service con expiración, fee explícito y estado de conversión.
- [ ] Probar primero el flujo con saldo prefundeado de testnet, no con dinero real.

## Fuentes

- [BCRA - Transferencias 3.0](https://www.bcra.gob.ar/medios-de-pago/transferencias-3-0/) - consultado: `2026-08-15`.
- [Mercado Pago - Checkout API](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/landing) - consultado: `2026-08-15`.
- [Bitso Business](https://www.bitso.com/business) - consultado: `2026-08-15`.
- [Ripio](https://www.ripio.com/ar/) - consultado: `2026-08-15`.
- [Arc Docs](https://docs.arc.network/llms.txt) - consultado: `2026-08-15`.
