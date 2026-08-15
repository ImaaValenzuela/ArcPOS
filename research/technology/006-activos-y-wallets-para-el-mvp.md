# Activos y wallets para el MVP

- **ID:** `technology-006`
- **Estado:** `decision`
- **Fecha:** `2026-08-15`
- **Área:** tecnología y producto

## Decisión

El MVP debe soportar únicamente **USDC en Arc** como activo de liquidación. La preferencia del comercio puede ser configurable como política de settlement, pero no como una lista abierta de criptomonedas.

```text
Preferencia comercial: ARS o USDC
Red de settlement inicial: Arc
Activo inicial: USDC
```

## Por qué no soportar cualquier crypto

- La mayoría de las criptomonedas tiene volatilidad incompatible con liquidar una venta.
- Cada activo puede tener distintas redes, decimales, liquidez y reglas de compliance.
- El comercio necesita saber el valor neto que recibe.
- Un pago confirmado on-chain puede ser irreversible.
- Aumentan los errores de dirección, red, token y memo/tag.
- Agregar activos no prueba una necesidad comercial; sólo agrega superficie técnica.

## Wallets

### Usuario

El usuario paga ARS y no necesita una wallet crypto. Esto reduce la fricción y evita crear una app de pagador innecesaria.

### Comercio

Para el primer prototipo, el comercio debe proporcionar una wallet de settlement de prueba. ArcPOS registra la dirección y envía USDC al destino validado.

Para producción se debe decidir entre:

- wallet del comercio, con el comercio como custodio;
- wallet user-controlled/embedded, si el comercio necesita onboarding simplificado;
- developer-controlled wallet, sólo si ArcPOS necesita custodiar y automatizar fondos, sujeto a revisión legal y de seguridad.

No mezclar modelos de custodia en un mismo flujo sin una decisión explícita.

## Arc y Circle

- Arc es EVM-compatible y usa USDC como gas.
- Arc Testnet es el entorno adecuado para el prototipo.
- Circle App Kit puede cubrir swaps, bridges y send, pero no reemplaza la conversión ARS ni el PSP argentino.
- Gateway sólo tiene sentido si los clientes pagan desde varias cadenas y se necesita balance unificado.
- CCTP/Bridge Kit sólo tiene sentido para mover USDC entre redes.
- Un smart contract propio sólo debe aparecer si se necesita escrow, reparto, fee programable u otra lógica on-chain.

## Flujo técnico recomendado

1. Crear un `PaymentIntent` denominado en ARS.
2. Mostrar una cotización ARS/USDC con expiración.
3. Cobrar ARS mediante PSP.
4. Esperar confirmación idempotente del PSP.
5. Ordenar al partner regulado la conversión.
6. Enviar USDC a la wallet whitelistada del comercio en Arc.
7. Esperar confirmación de Arc.
8. Registrar TXID, monto bruto, monto USDC, fees, cotización y estado final.

## Criterios de producción

- Validar chain ID, token contract y decimals.
- No mezclar el saldo nativo de gas con el saldo ERC-20 visible.
- Verificar que el comercio es dueño o controla la dirección destino.
- Aplicar límites diarios, allowlists y doble aprobación para payouts.
- Implementar reintentos idempotentes y reconciliación.
- No asumir que `ARS confirmado` equivale a `USDC liquidado`.

## Fuentes

- [Arc Docs](https://docs.arc.network/llms.txt) - Arc, USDC como gas, EVM y testnet; consultado: `2026-08-15`.
- [Circle Developer Docs](https://developers.circle.com/llms.txt) - wallets, App Kit, CCTP y Gateway; consultado: `2026-08-15`.
- [Circle Wallet Models](https://developers.circle.com/wallets/infrastructure-models.md) - modelos de custodia; consultado: `2026-08-15`.
