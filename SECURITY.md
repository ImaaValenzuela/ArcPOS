# Seguridad

## Estado

Este repositorio es un sandbox y no debe conectarse a fondos reales ni almacenar claves privadas de producción.

## Reglas

- No commitear `.env`, tokens, claves privadas, semillas ni credenciales.
- Validar firma, timestamp e idempotencia de cada webhook.
- No confiar en datos enviados por una app móvil para autorizar una liquidación.
- Mantener fondos de usuarios separados de fondos operativos cuando exista custodia.
- Usar testnet y claves de prueba para desarrollo.
- Registrar auditoría de cambios de estado y movimientos del ledger.

Para reportar una vulnerabilidad, no abrir un issue público: contactar al mantenedor del repositorio por un canal privado.
