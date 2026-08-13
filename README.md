# ArcPOS Argentina

ArcPOS es la base de un punto de venta móvil para comercios argentinos. El producto está diseñado para aceptar pagos en ARS mediante proveedores locales y pagos en USDC mediante Arc/Circle, con una experiencia de cobro simple para el comercio.

> Estado actual: arquitectura y sandbox. No procesa dinero real, no es un PSP y no ofrece todavía custodia, QR interoperable oficial ni Tap-to-Pay productivo.

## Objetivos

- Probar el ciclo de vida completo de un cobro sin dinero real.
- Mantener el dominio independiente de PSPs, bancos y proveedores blockchain.
- Preparar una migración progresiva desde sandbox a testnet y luego producción.
- Registrar pagos, comisiones, liquidaciones y conciliación en un ledger interno.

## Stack

- Expo + React Native para la aplicación POS móvil.
- Next.js para el panel web del comercio.
- NestJS para la API.
- PostgreSQL para persistencia transaccional.
- Redis para trabajos asíncronos futuros.
- pnpm + Turborepo para el monorepo.
- Circle Skills y MCP como tooling de asistencia para integraciones Circle.

## Estructura

```text
apps/
  merchant-mobile/       POS Expo para el comercio
  merchant-web/          Panel web del comercio
services/
  api/                   API NestJS y límites HTTP
packages/
  domain/                Tipos y reglas de negocio compartidas
  config/                Constantes de configuración compartidas
docs/
  architecture/          Decisiones y flujos técnicos
  integrations/          Guías de proveedores y Circle
.agents/skills/          Skills locales del workflow de agentes
```

## Requisitos

- Node.js LTS.
- pnpm 9+.
- Docker y Docker Compose.
- Expo CLI se ejecuta mediante el script del workspace.

## Desarrollo local

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

Endpoints iniciales:

- API: `http://localhost:3000/health`
- Panel web: `http://localhost:3001`

Comandos de calidad:

```bash
pnpm typecheck
pnpm build
pnpm check
docker compose config --quiet
```

## Arquitectura de pagos

El flujo principal es:

```text
POS -> PaymentIntent -> Provider adapter -> Confirmation -> Ledger -> Settlement
```

La confirmación y la liquidación son etapas diferentes. Los webhooks deben ser verificables, idempotentes y auditables. El dominio no debe importar SDKs específicos de Circle, un PSP o un banco.

Más información:

- [Arquitectura general](./ARCHITECTURE.md)
- [Ciclo de vida del pago](./docs/architecture/payment-lifecycle.md)
- [Roadmap](./docs/architecture/roadmap.md)
- [Circle Skills y MCP](./docs/integrations/circle-skills.md)
- [Contribuir](./CONTRIBUTING.md)
- [Seguridad](./SECURITY.md)
- [Research y decisiones](./research/README.md)

## Circle Skills

Las skills se instalan como contexto para agentes y no son dependencias de runtime:

```bash
npx skills add circlefin/skills --yes
```

La instalación está registrada en `skills-lock.json`. Las versiones de SDK, direcciones de contratos, chain IDs y firmas deben confirmarse con Circle MCP y documentación oficial antes de codificar una integración.

## Alcance excluido

El primer corte no incluye PSP real, QR interoperable certificado, custodia de claves, liquidación bancaria, Tap-to-Pay, USYC, Kafka ni microservicios desplegables independientes. Se incorporan sólo cuando exista una necesidad técnica, contractual o regulatoria concreta.
