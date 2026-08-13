# Midnight como privacidad y Arc como settlement

- **ID:** `technology-003`
- **Estado:** `decision`
- **Fecha:** `2026-08-13`
- **Área:** tecnología, privacidad y arquitectura

## Pregunta

¿Podemos usar Midnight únicamente para privacidad y delegar wallets, USDC, pagos y settlement a Circle/Arc?

## Decisión

Sí, esta separación es la arquitectura recomendada, con una precisión importante:

```text
Midnight = credenciales, pruebas privadas y selective disclosure
Circle/Arc = wallet, USDC, transferencia, bridge, swap y settlement
```

Midnight no debe considerarse automáticamente una capa de privacidad para la transferencia USDC en Arc. Si el pago final ocurre como una transferencia visible en Arc, la cadena y potencialmente el receptor pueden observar la dirección y metadata propia de ese riel.

## Hechos verificados

### Midnight

La documentación de Midnight describe:

- Estado público visible y estado privado almacenado localmente.
- Cálculo privado probado con ZK-SNARKs.
- Selective disclosure.
- Pruebas de hechos sin revelar el dato subyacente.
- Credenciales y compliance selectivo como casos de uso.
- Contratos Compact con valores privados por defecto.

Los patrones de privacidad adecuados incluyen commitments, nullifiers, Merkle trees y divulgación selectiva. `disclose()` no cifra un valor: autoriza que un valor llegue a un límite público. Por eso la privacidad depende de la arquitectura completa, no sólo del contrato.

### Circle User-Controlled Wallets

Circle documenta wallets user-controlled con:

- Google, Apple, Facebook, email OTP o PIN como autenticación.
- Control de claves del usuario mediante MPC 2-of-2.
- Operaciones de firma que requieren una sesión autenticada del usuario.
- Uso para pagos, checkout y aplicaciones consumer.
- Cuentas EOA o smart contract accounts según el caso.

Esto valida el onboarding sencillo propuesto, pero Google es autenticación y no debe tratarse como la seed o clave privada del usuario.

### Arc y App Kit

La documentación de Arc/Circle confirma:

- Arc Testnet disponible.
- USDC como token de gas de Arc.
- App Kit con Send, Bridge, Swap y Unified Balance.
- Arc Testnet soportado por App Kit para Send, Bridge, Swap y Unified Balance.
- En testnet, Swap soporta USDC, EURC y cirBTC.
- Unified Balance opera con USDC, no con cualquier activo arbitrario.

La tabla oficial de App Kit no incluye Midnight entre las blockchains soportadas.

## Qué privacidad podemos ofrecer

### Viable

El merchant puede recibir únicamente:

```text
Payment intent
Importe
Moneda
Estado
Referencia efímera
Timestamp operacional
```

Y no recibir:

```text
Nombre del pagador
Email
Username
Google ID
Historial del usuario
Wallet permanente del usuario
```

Midnight puede utilizarse para demostrar, sin revelar identidad:

- Que el usuario está habilitado.
- Que posee una credencial válida.
- Que no usó previamente un beneficio o nullifier.
- Que cumple una regla de elegibilidad.
- Que una operación corresponde a un compromiso específico.

### No garantizado automáticamente

Midnight no elimina por sí solo:

- IP.
- Device fingerprint.
- Logs de infraestructura.
- Tiempo y monto del pago.
- Datos entregados durante KYC.
- Correlación entre Google y una wallet.
- Dirección del pago final en Arc.
- Metadata visible del proveedor de wallet.

Por eso la promesa debe ser **privacidad de identidad y minimización de datos**, no anonimato absoluto.

## Flujo recomendado

```text
Customer Mobile
  -> login social o passkey
  -> Circle user-controlled wallet
  -> Midnight private credential/proof
  -> Arc/Circle USDC payment
  -> Payment confirmation
  -> Merchant recibe estado, importe y referencia efímera
```

El username sólo debe existir en el perfil de aplicación. No debe ser dirección, identificador on-chain ni clave de correlación de pagos.

## Límite crítico

Para que el pago USDC en Arc sea privado frente al merchant y frente al análisis público de Arc, haría falta una capa adicional:

```text
Midnight shielded payment
  -> bridge, wrapped asset o relayer
  -> USDC en Arc
  -> merchant
```

Eso ya no es "Midnight sólo como privacidad". Es un protocolo de settlement entre redes, con riesgos de bridge, liquidez, custodia, fallos del relayer y compliance.

Por lo tanto, para el primer alcance:

- Midnight protege credenciales y reglas de privacidad.
- Arc liquida USDC de forma transparente según las propiedades del riel.
- No se promete ocultar la dirección on-chain del pagador en Arc.

## Decisiones de wallet

### Recomendación

Usar Circle user-controlled wallets para el customer mobile cuando la compatibilidad mobile y de Arc esté confirmada.

Ventajas:

- Onboarding con Google/Apple/email.
- El backend no mantiene las claves del usuario.
- El usuario aprueba operaciones.
- Evita exigir seed phrases al inicio.

Riesgos:

- Dependencia de Circle.
- Compatibilidad específica por plataforma y chain.
- Requisitos de sesión y recuperación.
- Correlación si usamos el mismo identificador social para todo.

### Separación de identidades

```text
Auth identity       Google/Apple/email
Wallet identity     wallet user-controlled
Payment identity    referencia efímera
Privacy identity    credential/nullifier Midnight
Compliance identity sólo cuando sea exigible
```

Nunca derivar una seed determinística directamente de Google o username.

## Scope por fases

### Fase 1: minimización

- No enviar identidad al merchant.
- Referencias efímeras por pago.
- Separar customer account, wallet y payment intent.
- Reducir logs y analytics identificables.

### Fase 2: Arc USDC

- Wallet user-controlled en testnet.
- USDC en Arc Testnet.
- Send y confirmación.
- Merchant recibe estado y settlement.

### Fase 3: Midnight privacy credential

- Credencial privada.
- Proof of eligibility.
- Nullifier por beneficio u operación.
- Selective disclosure.

### Fase 4: privacidad del settlement

Sólo después de un diseño y auditoría independientes para bridge, relayer, wrapped asset o protocolo de pago privado.

## Criterios de validación pendientes

- [ ] Confirmar SDK mobile de Circle user-controlled wallets y compatibilidad con Expo development builds.
- [ ] Crear y firmar una operación USDC en Arc Testnet con wallet user-controlled.
- [ ] Medir qué dirección y metadata observa el merchant en Arc.
- [ ] Compilar una prueba Midnight mínima de credencial y nullifier.
- [ ] Medir generación de proof en un teléfono común.
- [ ] Definir recuperación cuando se pierde acceso a Google/Apple/email.
- [ ] Validar qué datos requiere Circle para el onboarding y compliance.
- [ ] Consultar el modelo regulatorio para un producto de pagos con privacidad selectiva en Argentina.

## Fuentes

- [Midnight - What is Midnight?](https://docs.midnight.network/what-is-midnight) - fecha de consulta: `2026-08-13`.
- [Midnight documentation index](https://docs.midnight.network/llms.txt) - fecha de consulta: `2026-08-13`.
- [Circle - User-controlled wallets](https://developers.circle.com/wallets/user-controlled.md) - fecha de consulta: `2026-08-13`.
- [Circle - Wallet models](https://developers.circle.com/wallets/infrastructure-models.md) - fecha de consulta: `2026-08-13`.
- [Arc App Kit supported blockchains](https://docs.arc.io/app-kit/references/supported-blockchains.md) - fecha de consulta: `2026-08-13`.
- [Arc - Connect to Arc Testnet](https://docs.arc.io/arc/references/connect-to-arc.md) - fecha de consulta: `2026-08-13`.
- [Arc App Kit Unified Balance](https://docs.arc.io/app-kit/unified-balance.md) - fecha de consulta: `2026-08-13`.
