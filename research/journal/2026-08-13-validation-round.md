# Journal: validación de la arquitectura Midnight + Arc

- **Fecha:** `2026-08-13`
- **Tema:** validaciones restantes de privacidad, wallets y settlement

## Objetivo

Validar la decisión de usar Midnight únicamente para privacidad y delegar a Circle/Arc la wallet, USDC, pagos y settlement.

## Trabajo realizado

1. Se consultó la documentación oficial de Midnight sobre privacidad, SDKs, getting started y DApp Connector.
2. Se consultó la documentación oficial de Circle sobre user-controlled wallets, autenticación, blockchains soportadas y onboarding social.
3. Se consultó la documentación oficial de Arc App Kit sobre blockchains, tokens, Unified Balance y conectividad.
4. Se comprobó el RPC de Arc Testnet desde el entorno de desarrollo.
5. Se comparó el modelo del DApp Connector de Midnight con el modelo nativo de Expo/React Native.

## Resultados

- Arc Testnet respondió correctamente.
- Chain ID confirmado: `5042002`.
- Circle documenta Arc Testnet para user-controlled wallets EOA y SCA.
- Circle documenta Google/Apple/Facebook, email OTP y PIN.
- App Kit no lista Midnight como blockchain soportada.
- Unified Balance opera con USDC, no con cualquier activo.
- DApp Connector de Midnight depende de `window.midnight` y no es una integración nativa directa para Expo.
- La privacidad de Midnight sirve para credenciales y pruebas, no para ocultar automáticamente una transferencia USDC en Arc.

## Decisiones actualizadas

```text
customer-mobile: Circle wallet + Arc USDC
privacy layer: Midnight, sólo después del spike mobile
merchant: nunca recibe customer PII por defecto
settlement: Arc/Circle
cross-chain: sólo redes/tokens oficialmente soportados
```

## Bloqueos identificados

- Circle Console y OAuth son necesarios para la prueba end-to-end.
- La prueba de wallet requiere credenciales y fondos de testnet.
- Midnight mobile requiere validar Wallet SDK o módulo nativo.
- La privacidad de settlement requiere un diseño adicional si queremos ocultar la dirección Arc.
- Compliance argentino todavía necesita consulta profesional.

## Próximo paso

No integrar Midnight en las apps todavía. Ejecutar primero el Spike A de Circle/Arc, luego el Spike B de Midnight, y comparar resultados antes de definir el contrato de privacidad.
