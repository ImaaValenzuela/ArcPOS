# Circle, Arc y USDC

- **ID:** `technology-001`
- **Estado:** `in-progress`
- **Fecha:** `2026-08-13`
- **Área:** tecnología

## Pregunta

¿Qué parte del flujo cripto puede cubrir Circle/Arc y qué no debemos prometer todavía?

## Hechos

La documentación de Arc indica que:

- Arc es una blockchain EVM-compatible.
- USDC es el token nativo utilizado para gas.
- Arc ofrece finalización determinística sub-second según su documentación.
- Arc está disponible actualmente en testnet.
- App Kit reúne Bridge, Swap, Send y Unified Balance.

La documentación de Circle Gateway indica que:

- Permite un balance unificado de USDC entre blockchains compatibles.
- Las transferencias pueden ser menores a 500 ms una vez establecido el balance.
- El modelo es no custodial.
- Gateway no es por sí mismo un sistema de liquidación ARS ni una cuenta bancaria.

Circle Payments Network distingue entre operación self-managed y managed. En el modo managed Circle puede encargarse de partes de custodia, compliance y settlement, sujeto a disponibilidad, producto y jurisdicción.

## Conclusiones

1. Arc es adecuado como riel de liquidación cripto y pagos internacionales, no como sustituto del PSP argentino.
2. Gateway/App Kit pueden ocultar parte de la complejidad multi-chain, pero no eliminan autorización, wallet, liquidez, fees o compliance.
3. La velocidad de la red no equivale al tiempo total de experiencia: debemos medir autorización, backend, webhook, confirmación y actualización del comercio.
4. No debemos comunicar costos, disponibilidad mainnet ni liquidación bancaria como hechos hasta validarlos.
5. El primer adaptador cripto debe apuntar a Arc testnet y estar aislado del dominio.

## Arquitectura recomendada

```text
customer-mobile
    -> wallet/provider adapter
    -> Arc testnet / Circle App Kit
    -> webhook or confirmation
    -> ArcPOS payment intent
    -> merchant-mobile
```

## Decisiones postergadas

- Custodia versus user-controlled wallet.
- Gateway versus CCTP para cada caso.
- Uso de App Kit en mobile Expo versus backend orchestration.
- Conversión USDC/ARS.
- Liquidación bancaria.

## Acciones siguientes

- [ ] Probar un pago USDC mínimo en Arc testnet.
- [ ] Confirmar adaptadores soportados por App Kit y mobile.
- [ ] Documentar eventos y webhooks necesarios.
- [ ] Medir tiempo end-to-end de pago.
- [ ] Consultar disponibilidad de Circle Payments Network para el caso argentino.

## Fuentes

- [Arc documentation index](https://docs.arc.io/llms.txt) - fecha de consulta: `2026-08-13`.
- [Arc App Kit](https://docs.arc.io/app-kit.md) - fecha de consulta: `2026-08-13`.
- [Circle Gateway](https://developers.circle.com/gateway) - fecha de consulta: `2026-08-13`.
- [Circle Developer Platform index](https://developers.circle.com/llms.txt) - fecha de consulta: `2026-08-13`.
