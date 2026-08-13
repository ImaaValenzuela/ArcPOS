# Journal: privacidad, Midnight y Arc

- **Fecha:** `2026-08-13`
- **Tema:** evolución de la arquitectura de privacidad y pagos

## Contexto

Se planteó usar Midnight Network para que el merchant nunca conozca quién pagó ni se almacenen datos del customer. También se consideró usar Circle/Arc para convertir activos a USDC y crear wallets mediante Google, username y onboarding simple.

## Conversación resumida

1. Se identificó que Midnight puede aportar privacidad programable, commitments, nullifiers, Merkle proofs y selective disclosure.
2. Se distinguió privacidad de identidad de anonimato total.
3. Se determinó que el merchant puede recibir estado, importe y referencia sin recibir nombre, email o username del customer.
4. Se detectó que una transferencia USDC visible en Arc no se vuelve privada automáticamente por usar Midnight en otra capa.
5. Se descartó asumir que Circle convierte cualquier activo de cualquier red en USDC automáticamente.
6. Se validó que Circle ofrece user-controlled wallets con autenticación social, email o PIN.
7. Se decidió separar identidad de autenticación, wallet, pago y privacidad.
8. Se decidió no derivar seeds desde Google o username.
9. Se acordó delegar a Arc/Circle wallet, USDC, Send, Bridge, Swap, Unified Balance y settlement.
10. Se acordó utilizar Midnight únicamente para privacidad y credenciales en la primera arquitectura.

## Decisión actual

```text
Midnight = privacy layer
Arc/Circle = wallet + USDC + payment + settlement
ArcPOS backend = payment intents + minimal ledger + confirmation
Merchant = no customer identity by default
```

## No prometer todavía

- Anonimato absoluto.
- Ocultamiento automático de la dirección del pagador en Arc.
- Conversión de cualquier token a USDC.
- Compatibilidad de Midnight con Circle App Kit.
- Wallet recovery perfecta mediante Google.
- Cumplimiento regulatorio resuelto por ZK.

## Próximas pruebas

- Spike de wallet user-controlled en Arc Testnet.
- Spike de credencial privada Midnight.
- Medición de metadata visible para merchant y observadores de Arc.
- Validación de Circle mobile SDK y Expo development build.
- Consulta legal/regulatoria sobre privacidad selectiva y pagos en Argentina.

## Reflexión

La ventaja no debe venderse como "pagos anónimos". La formulación más sólida es:

> Pagos privados y verificables: el comercio recibe lo necesario para cobrar y el usuario comparte sólo lo necesario.

La arquitectura debe minimizar datos por diseño, pero conservar una frontera explícita para compliance, fraude, recuperación y resolución de disputas.
