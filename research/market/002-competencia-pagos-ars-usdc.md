# Competencia en pagos ARS y USDC

- **ID:** `market-002`
- **Estado:** `validated`
- **Fecha:** `2026-08-15`
- **Área:** mercado y producto

## Pregunta

¿Existe competencia para una capa merchant-first que permita a comercios argentinos cobrar ARS y USDC, conciliar ambos rieles y elegir una liquidación local o internacional?

## Alcance

Se compararon plataformas globales de pagos cripto/stablecoin y alternativas relevantes para comercios argentinos. La revisión de páginas comerciales no reemplaza una validación contractual, regulatoria ni una prueba de disponibilidad para Argentina.

## Hechos

### Competidores directos o casi directos

| Competidor | Capacidades relevantes | Diferencia frente a ArcPOS |
|---|---|---|
| BitPay | Checkout online, facturación, POS QR, pagos en USDC y otras criptomonedas, liquidación en fiat o cripto y APIs | Tiene mayor escala global y compliance; no se presenta como una capa argentina conectada al QR/PSP local y a la liquidación ARS |
| Coinbase Business | Cuenta empresarial, pagos globales en stablecoins, invoices, payment links, checkout, APIs, conciliación y reporting | Producto financiero cripto más amplio; disponibilidad geográfica y onboarding para Argentina deben confirmarse |
| MoonPay Commerce / Helio | Checkout, pay links, Shopify, SDK/API, routing entre cadenas, conversión y settlement en cripto o fiat | Resuelve muy bien el checkout global, pero no el contexto operativo específico de un comercio argentino ni necesariamente ARS/QR local |
| Triple-A | Checkout, invoices, cuentas multicurrency, cobros y payouts en stablecoins y monedas locales, APIs y white-label | Competidor fuerte en pagos B2B y cross-border; su propuesta es global y regulada, no una experiencia local de POS argentino |
| Mercado Pago / PSPs argentinos | QR interoperable, aceptación masiva, cobro en ARS, liquidación local y herramientas comerciales | Compiten por la relación con el comercio y la aceptación ARS; no cubren por sí solos el settlement internacional en USDC |

### Alternativas indirectas

- Billeteras y exchanges regionales pueden permitir cobrar, enviar o convertir cripto, pero no necesariamente ofrecen un POS multi-rail con ledger de ventas, comisiones, liquidación y conciliación.
- Un comercio puede combinar Mercado Pago para ARS con una wallet o exchange para USDC. Este comportamiento valida el problema de fragmentación, pero también es la alternativa más simple si el volumen de USDC es bajo.

## Validación de la idea

1. **La necesidad general ya está validada por el mercado:** existen productos para cobrar stablecoins y liquidar en fiat o cripto.
2. **La idea original no es única por la tecnología:** aceptar USDC, crear checkout, usar QR o exponer APIs no constituye una barrera suficiente.
3. **El hueco plausible es local y operativo:** integrar un proveedor ARS argentino con un riel USDC, presentar una única conciliación al comercio y soportar liquidación según la necesidad del negocio.
4. **El primer segmento debe ser estrecho:** turismo, hotelería, gastronomía premium, freelancers/agencias y comercios con clientes o proveedores internacionales.
5. **La app del cliente no debe ser el producto principal:** el pagador ya puede usar wallets existentes; ArcPOS debe minimizar fricción y aceptar wallets/links compatibles.

## Riesgos competitivos

- Los competidores globales pueden añadir soporte local o asociarse con un PSP argentino.
- Mercado Pago y exchanges regionales tienen distribución, confianza y datos superiores.
- La liquidación ARS/USDC puede convertir a ArcPOS en un participante regulado o exigir un partner con permisos, KYC/AML, monitoreo y gestión de reclamos.
- Si el comercio sólo necesita cobrar ocasionalmente USDC, una payment link de un proveedor existente puede ser suficiente.

## Conclusión

ArcPOS debe posicionarse como **la capa operativa local para comercios argentinos que ya tienen una necesidad real de cobros internacionales**, no como otro gateway cripto global. La propuesta a probar es:

> Cobrá en ARS o USDC desde una sola operación y conciliá ventas, comisiones y liquidación en un único panel, usando partners regulados para cada riel.

La ventaja defendible, si se confirma, sería la combinación de distribución local, integración con PSP/QR argentino, soporte operativo en ARS y settlement USDC. El producto no debe competir de frente con BitPay, Coinbase o MoonPay en infraestructura cripto global.

## Acciones

- [ ] Confirmar qué competidores permiten onboarding y settlement para una entidad argentina.
- [ ] Obtener cotizaciones, fees, límites, tiempos y países soportados de BitPay, Coinbase Business, MoonPay Commerce y Triple-A.
- [ ] Entrevistar al menos 10 comercios del segmento inicial y medir frecuencia real de pedidos de cobro en USDC.
- [ ] Hablar con PSPs/adquirentes argentinos sobre QR dinámico, webhooks, liquidación y modelo white-label.
- [ ] Probar manualmente un concierge MVP: registrar cobros ARS y USDC, conciliar y entregar un reporte diario antes de construir infraestructura propia.
- [ ] Definir el umbral de volumen que justifica integrar USDC en lugar de recomendar una solución existente.

## Fuentes

- [BitPay - Crypto Payment Gateway](https://www.bitpay.com/business) - consultado: `2026-08-15`.
- [Coinbase Business](https://www.coinbase.com/en-ar/business) - consultado: `2026-08-15`.
- [MoonPay Commerce](https://commerce.moonpay.com/) - consultado: `2026-08-15`.
- [Triple-A](https://www.triple-a.io/) - consultado: `2026-08-15`.
- [BCRA - Transferencias 3.0](https://www.bcra.gob.ar/medios-de-pago/transferencias-3-0/) - consultado: `2026-08-13`; contexto local previamente investigado.
- [Mercado Pago - Cobrar con QR](https://www.mercadopago.com.ar/qr) - consultado: `2026-08-13`; contexto competitivo previamente investigado.
