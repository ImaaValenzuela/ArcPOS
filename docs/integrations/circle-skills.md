# Circle Skills y MCP

## Instalación

Instalar las skills como tooling local del agente:

```bash
npx skills add circlefin/skills
```

No se importan desde la aplicación ni se incluyen en el bundle móvil.

## Skills prioritarias

- `use-arc`: red Arc, configuración y despliegue.
- `use-usdc`: balances y transferencias USDC.
- `use-gateway` y `unify-balance`: balance unificado.
- `bridge-stablecoin`: CCTP y transferencias cross-chain.
- `use-circle-wallets`: selección de custodia.
- `use-user-controlled-wallets`: wallets controladas por usuarios.
- `swap-tokens`: swaps y comisiones.

## MCP

Para APIs que cambian, configurar Circle MCP en el entorno del agente:

```text
https://api.circle.com/v1/codegen/mcp
```

El MCP no debe configurarse con secretos en este repositorio. Las direcciones, chain IDs y firmas deben verificarse en MCP y documentación oficial antes de implementar el adaptador.

## Regla de implementación

Las skills guían decisiones y patrones. El código productivo debe encapsular Circle en `packages/circle` y probarse primero contra testnet o sandbox.
