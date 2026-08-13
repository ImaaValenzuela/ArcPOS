# Validaciones técnicas restantes

- **ID:** `technology-004`
- **Estado:** `validated`
- **Fecha:** `2026-08-13`
- **Área:** tecnología, mobile y privacidad

## Objetivo

Validar las hipótesis pendientes de la arquitectura:

```text
Midnight = privacidad
Circle/Arc = wallet, USDC, pagos y settlement
Expo = mobile customer
```

## Resumen de resultados

| Hipótesis | Resultado | Evidencia |
|---|---|---|
| Circle ofrece user-controlled wallets con login social | Validada documentalmente | Google, Apple y Facebook están documentados |
| Circle soporta Arc Testnet en user-controlled wallets | Validada documentalmente | `ARC-TESTNET`, EOA/SCA |
| App Kit soporta Arc Testnet | Validada documentalmente | Send, Bridge, Swap y Unified Balance |
| Unified Balance convierte cualquier token | Refutada | Opera con USDC; Swap tiene tokens y liquidez limitados |
| Arc Testnet está accesible | Validada por RPC | Chain ID `5042002` y bloques respondidos |
| Midnight está soportado por App Kit | No validada / actualmente no listado | No aparece en la tabla oficial de chains |
| Midnight DApp Connector funciona directamente en Expo nativo | Refutada para el enfoque directo | API expuesta vía `window.midnight` |
| Midnight puede aportar credenciales y proofs privadas | Validada documentalmente | Private state, ZK proofs, selective disclosure |
| Un pago USDC en Arc queda privado por usar Midnight | Refutada | La transferencia final sigue el modelo de visibilidad de Arc |
| Google login permite recuperar siempre la wallet | Refutada | Circle indica que la recuperación depende del proveedor social |
| La app puede probar el flujo real sin credenciales | No ejecutada | Requiere Circle Console, OAuth y fondos de testnet |

## Validación de Circle Wallets

La documentación de Circle confirma:

- User-controlled wallets con Google, Apple, Facebook, email OTP o PIN.
- El usuario conserva control mediante MPC 2-of-2.
- Las operaciones de firma requieren una sesión autenticada.
- Existen ejemplos oficiales para Web, iOS, Android y React Native.
- Arc Testnet (`ARC-TESTNET`) soporta wallets user-controlled EOA y SCA.
- El flujo requiere Circle Developer Console, API key, App ID y configuración OAuth.

### Decisión

El onboarding social es técnicamente viable como dirección de implementación, pero la prueba end-to-end queda pendiente de:

- Crear una aplicación Circle.
- Configurar Google OAuth.
- Obtener API key y App ID.
- Ejecutar el flujo en una development build o sample mobile compatible.
- Crear y financiar una wallet de testnet.

No se deben poner esas credenciales en el repositorio ni en Expo público.

## Validación de Arc Testnet

Se consultó el RPC oficial:

```text
POST https://rpc.testnet.arc.io
method: eth_chainId
result: 0x4cef52
```

`0x4cef52` equivale a chain ID decimal `5042002`, coincidente con la documentación oficial de Arc Testnet.

También respondió:

```text
method: eth_blockNumber
result: 0x3639ac0
```

### Decisión

Arc Testnet está accesible desde este entorno. Esto valida conectividad de red, no valida todavía wallets, fondos, transferencias ni settlement.

## Validación de App Kit

La tabla oficial de App Kit lista Arc Testnet para:

- Send.
- Bridge.
- Swap.
- Unified Balance.

También indica:

- Bridge sólo opera USDC.
- Unified Balance opera USDC.
- En Arc Testnet, Swap soporta USDC, EURC y cirBTC.
- La compatibilidad depende del adapter y de la capacidad concreta.

### Decisión

La frase de producto debe ser:

> Pagá con USDC desde redes y wallets compatibles.

No:

> Pagá con cualquier token y Arc lo convierte automáticamente.

## Validación de Midnight Mobile

La documentación oficial de Midnight presenta:

- Midnight.js.
- Wallet SDK.
- DApp Connector API.
- Compact y runtime.

El DApp Connector se expone como:

```text
window.midnight.<walletId>
```

Y utiliza conexión con una wallet instalada, configuración de indexer, node y proof server.

### Resultado

El DApp Connector no es una integración directa para una app Expo nativa, porque una app React Native no tiene el modelo de wallet inyectada en `window` de un navegador.

Para `customer-mobile` las alternativas son:

1. Usar Wallet SDK para implementar o integrar una wallet propia.
2. Crear un módulo nativo que conecte con una wallet compatible.
3. Abrir una experiencia web/browser para usar el DApp Connector.
4. Mover Midnight a un servicio/companion web, perdiendo parte de la experiencia nativa.

### Decisión

Midnight no se agrega todavía como dependencia de `customer-mobile`. Antes se necesita un spike separado de Wallet SDK y runtime mobile.

## Validación de privacidad

### Sí es posible

El merchant puede recibir sólo:

- Importe.
- Moneda.
- Estado.
- Payment intent.
- Referencia efímera.

El sistema puede usar Midnight para probar:

- Elegibilidad.
- Posesión de una credencial.
- No reutilización mediante nullifier.
- Reglas privadas.

### No está validado

No se ejecutó aún una transferencia real para medir:

- Qué metadata ve el merchant.
- Qué dirección ve un observador de Arc.
- Si la wallet user-controlled expone datos correlacionables.
- Si un relayer puede separar identidad y settlement.

### Decisión

La garantía de producto será:

> No compartimos la identidad del customer con el merchant por defecto.

La garantía no será:

> El pago es anónimo para todas las partes.

## Recuperación y autenticación

Circle documenta que:

- Social login recupera mediante el proveedor social.
- Circle no puede recuperar credenciales sociales perdidas o bloqueadas.
- Cada proveedor social puede crear un user ID distinto.
- Email OTP depende del acceso a la cuenta de email.
- PIN ofrece custody del usuario, pero perder PIN y respuestas puede implicar pérdida permanente.

### Decisión

El onboarding inicial puede ofrecer Google, pero debe comunicar claramente:

- Qué controla el usuario.
- Qué ocurre si pierde Google.
- Que username no es seed ni wallet address.
- Que el sistema no debe derivar claves desde el username.

## Qué se validó realmente

### Validado

- Documentación oficial de Midnight sobre privacidad y SDKs.
- Documentación oficial de Circle sobre wallets y autenticación.
- Soporte documental de Arc Testnet.
- Conectividad RPC real de Arc Testnet.
- Límites de App Kit y Unified Balance.
- Incompatibilidad directa de DApp Connector con el modelo Expo nativo.

### Pendiente con credenciales y fondos

- Crear user-controlled wallet real.
- Ejecutar login Google real.
- Inicializar wallet SCA/EOA en Arc Testnet.
- Recibir USDC desde faucet.
- Ejecutar envío USDC.
- Confirmar webhook y balance.
- Medir metadata visible.
- Generar y verificar proof Midnight en mobile.

## Plan del siguiente spike

### Spike A: Circle/Arc

- [ ] Crear configuración Circle Testnet.
- [ ] Crear muestra mobile React Native oficial.
- [ ] Configurar Google OAuth de prueba.
- [ ] Crear user-controlled wallet Arc Testnet.
- [ ] Obtener USDC del faucet.
- [ ] Enviar una cantidad mínima a una dirección receptora.
- [ ] Observar balance, transaction hash y eventos.

### Spike B: Midnight

- [ ] Crear proyecto Compact mínimo.
- [ ] Probar commitment privado.
- [ ] Probar nullifier de uso único.
- [ ] Generar proof local.
- [ ] Medir tiempo y memoria en Android/iOS.
- [ ] Determinar si el runtime funciona en Expo development build.
- [ ] Definir si Midnight vive en mobile, backend o una wallet externa.

## Fuentes

- [Circle - Build a wallet app](https://developers.circle.com/wallets/user-controlled/build-a-wallet-app) - fecha de consulta: `2026-08-13`.
- [Circle - Authentication methods](https://developers.circle.com/wallets/user-controlled/authentication-methods.md) - fecha de consulta: `2026-08-13`.
- [Circle - Supported blockchains](https://developers.circle.com/wallets/supported-blockchains.md) - fecha de consulta: `2026-08-13`.
- [Arc - App Kit supported blockchains](https://docs.arc.io/app-kit/references/supported-blockchains.md) - fecha de consulta: `2026-08-13`.
- [Arc - Connect to Arc Testnet](https://docs.arc.io/arc/references/connect-to-arc.md) - fecha de consulta: `2026-08-13`.
- [Arc - Unified Balance](https://docs.arc.io/app-kit/unified-balance.md) - fecha de consulta: `2026-08-13`.
- [Midnight - Get started](https://docs.midnight.network/getting-started) - fecha de consulta: `2026-08-13`.
- [Midnight - SDKs](https://docs.midnight.network/sdks) - fecha de consulta: `2026-08-13`.
- [Midnight - DApp Connector API](https://docs.midnight.network/api-reference/dapp-connector) - fecha de consulta: `2026-08-13`.
