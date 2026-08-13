# Contribuir

## Flujo local

1. Copiar `.env.example` a `.env`.
2. Levantar dependencias con `docker compose up -d`.
3. Ejecutar `pnpm install`.
4. Ejecutar `pnpm check` antes de abrir un cambio.

## Convenciones

- Mantener cambios pequeños y orientados a un caso de uso.
- No importar SDKs de proveedores desde `packages/domain`.
- No usar `number` para importes monetarios.
- No usar APIs reales desde el sandbox.
- Documentar decisiones que cambien límites, custodia o compliance.

## Pull requests

Una PR debe explicar el problema, el cambio, cómo se verificó y cualquier riesgo pendiente. Si modifica pagos, debe incluir pruebas de estados, duplicación de webhooks y errores.
