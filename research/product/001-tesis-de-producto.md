# Tesis inicial del producto

- **ID:** `product-001`
- **Estado:** `decision`
- **Fecha:** `2026-08-13`
- **Área:** producto

## Pregunta

¿Por qué elegirían ArcPOS los comercios y qué lugar debe ocupar la app del pagador?

## Hechos

- Los comercios argentinos ya cuentan con QR interoperable y múltiples opciones de aceptación.
- Las billeteras existentes tienen distribución, saldo, crédito, promociones y herramientas de negocio.
- Una app de pagador nueva no tiene un motivo fuerte para ser instalada si sólo permite pagar una operación local.
- Los pagos en USDC, clientes internacionales y liquidación flexible pueden resolver necesidades menos cubiertas por las billeteras locales.

## Supuestos

- Gastronomía, turismo, freelancers y servicios orientados a clientes internacionales tienen mayor necesidad de aceptar USDC.
- Algunos comercios preferirán recibir USDC para protegerse de la inflación, mientras otros necesitarán ARS.
- Un solo ledger para ARS, USDC, comisiones y liquidaciones puede ser más valioso que un QR con una comisión marginalmente menor.

## Comparación

| Alternativa | Qué resuelve | Límite para ArcPOS |
|---|---|---|
| Mercado Pago | QR, tarjetas, saldo, crédito y distribución | No es una capa neutral de liquidación cripto internacional |
| MODO/bancos | Pagos locales y cuentas bancarias | No cubren por sí solos USDC y liquidación global |
| Apple Pay | Pago con tarjetas tokenizadas | No es adquirente, QR interoperable ni riel USDC |
| Posnet | Aceptación de tarjetas | Requiere hardware y no resuelve multi-rail cripto |
| ArcPOS | Aceptación y liquidación multi-rail | Depende de PSP, compliance y proveedores de liquidez |

## Conclusiones

1. ArcPOS debe ser **merchant-first**, no una nueva billetera generalista.
2. La propuesta no debe basarse solamente en "QR más barato".
3. El diferencial debe ser aceptación local más liquidación ARS/USDC y conciliación unificada.
4. `customer-mobile` es un companion para pagos USDC e internacionales, no el centro del producto.
5. Apple Pay y otras wallets deben ser métodos compatibles futuros, no productos que ArcPOS intente reemplazar.

## Decisiones

- Mantener dos experiencias separadas: `merchant-mobile` y `customer-mobile`.
- Priorizar un sandbox multi-rail antes de integrar tarjetas o custodiar fondos.
- Investigar primero un PSP/adquirente argentino y el modelo regulatorio.
- Apuntar inicialmente a comercios con exposición a turismo, clientes internacionales o pagos digitales en dólares.

## Acciones siguientes

- [ ] Entrevistar comercios locales y comercios orientados a turismo.
- [ ] Comparar PSPs/adquirentes y sus APIs de QR, liquidación y webhooks.
- [ ] Medir disposición a pagar por liquidación en USDC.
- [ ] Definir el primer caso de uso comercial con métricas de éxito.
