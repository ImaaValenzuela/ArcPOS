# Tap to Pay on iPhone

- **ID:** `technology-002`
- **Estado:** `validated`
- **Fecha:** `2026-08-13`
- **Área:** tecnología y operaciones

## Pregunta

¿Podemos aceptar tarjetas, Apple Pay y otros wallets contactless desde un iPhone en Argentina?

## Hechos

Apple indica que Tap to Pay on iPhone permite aceptar tarjetas contactless, Apple Pay, Apple Watch y otros dispositivos con wallets digitales, pero exige:

1. Integrar un PSP compatible con la región.
2. Solicitar el entitlement de Tap to Pay.
3. Integrar ProximityReader o el SDK del PSP.
4. Cumplir certificaciones y revisión de App Store.

La página oficial de países y regiones consultada no incluye Argentina entre los mercados listados para Tap to Pay on iPhone.

Apple también indica que Apple Pay es un método basado en tarjetas elegibles del emisor y que el comercio debe trabajar con un proveedor de pagos para aceptar Apple Pay.

## Conclusiones

1. Tap to Pay no debe ser dependencia del MVP argentino.
2. No se puede implementar sólo con Expo Go o NFC genérico.
3. Requeriría un PSP compatible, entitlement Apple, SDK nativo y probablemente un development build.
4. Apple Pay debe tratarse como método futuro dentro de una integración adquirente.
5. La prioridad actual debe ser QR interoperable ARS y USDC en Arc testnet.

## Criterio de reactivación

Reabrir esta línea sólo cuando exista un PSP que confirme por escrito:

- Disponibilidad para Argentina.
- SDK o API de integración.
- Certificación requerida.
- Tarjetas y wallets soportadas.
- Modelo de liquidación.
- Requisitos para el comercio.

## Fuentes

- [Apple - Tap to Pay on iPhone](https://developer.apple.com/tap-to-pay/) - fecha de consulta: `2026-08-13`.
- [Apple - Countries and Regions](https://developer.apple.com/tap-to-pay/regions/) - fecha de consulta: `2026-08-13`.
- [Apple Pay Argentina](https://www.apple.com/la/apple-pay/) - fecha de consulta: `2026-08-13`.
