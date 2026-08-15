# cARS: peso argentino tokenizado en Arc Testnet

- **ID:** `technology-008`
- **Estado:** `decision`
- **Fecha:** `2026-08-15`
- **Área:** tecnología

## Problema

`technology-006` fija USDC en Arc como único activo de liquidación y deja al
pagador fuera de la cadena: paga ARS por PSP y ArcPOS liquida USDC al comercio.
Eso resuelve el producto, pero deja el prototipo con un agujero: **entre el pago
en ARS y la liquidación en USDC no hay ningún registro on-chain**. El tramo en
pesos vive sólo en el ledger interno, así que no se puede demostrar el ciclo de
vida completo de un cobro sin depender de un PSP real ni de un partner regulado
que convierta.

## Decisión

Emitir `cARS`, un ERC-20 propio en Arc Testnet que representa un peso argentino
acreditado y todavía no redimido. `cARS` **no reemplaza a USDC** como activo de
liquidación: es la pierna en pesos del flujo, la que hoy no existe on-chain.

```text
Cliente paga ARS (PSP sandbox)
  -> emisor acredita y ejecuta issue(comercio, monto, settlementRef)   [cARS on-chain]
  -> comercio mantiene cARS o pide settlement
  -> conversión: burn(cARS) + transferencia de USDC                     [USDC on-chain]
```

Cada emisión lleva la referencia de la acreditación off-chain en el evento
`Issued`, así el ledger interno y la cadena se concilian sin publicar datos
personales.

## Por qué un token propio y no otra cosa

- Una stablecoin ARS de terceros con liquidez real no existe en Arc Testnet.
- Denominar el `PaymentIntent` en ARS pero registrar sólo USDC obliga a explicar
  la cotización en cada demo. Con `cARS` el monto en pesos es verificable.
- Permite probar emisión, quema, pausa y roles antes de que haya dinero real,
  que es exactamente lo que `technology-006` pide como criterio de producción.
- El comercio que prefiere ARS (ver flujo de onboarding) recibe algo concreto en
  vez de una preferencia guardada en base.

## Parámetros

| Campo | Valor | Razón |
|---|---|---|
| Ticker | `cARS` | La `c` marca que es una representación, no el peso del banco. |
| Decimales | 6 | Misma escala que la vista ERC-20 de USDC en Arc: el POS no convierte. |
| Emisión | `MINTER_ROLE` | Sólo el emisor emite, y siempre contra ARS acreditados. |
| Quema | holder + `burnFrom` | La redención destruye circulante contra devolución de pesos. |
| Pausa | `PAUSER_ROLE` | Corte de emergencia ante un incidente de emisión. |
| Permit | EIP-2612 | Aprobación firmada, sin obligar al pagador a mandar otra tx. |
| Base | OpenZeppelin v5.4.0 | Código auditado, sin ERC-20 hecho a mano. |

## Despliegue

| Campo | Valor |
|---|---|
| Red | Arc Testnet (`5042002`) |
| Contrato | `0xee60c4c1E08999c4b6061Afe072d31C9549F5e48` |
| Deploy | `0xba7107dc5c9a61884d74673e38d82b65a76d63ef9c0b78b4a6f0a31d4514277e` |
| Primera emisión | `0xe784f4477c0e0f374a59e91efa6598a0ef85f976a6f8fb7e7b83e44710ef19a0` (1.000.000,00 cARS) |
| Código | verificado en `https://testnet.arcscan.app` |
| Costo total en gas | `0.030818` USDC |

Código, tests y scripts en `contracts/`. Dirección y decimales expuestos en
`packages/config` como `carsTestnet`.

## Riesgos asumidos

- **El respaldo no es verificable on-chain.** El invariante "1 cARS = 1 peso
  acreditado" lo sostiene el emisor, no el contrato. Sin prueba de reservas,
  `cARS` es un pagaré, no una stablecoin.
- **Admin en una EOA.** Hoy una sola clave emite, pausa y reparte roles. En
  producción tiene que ser multisig con minter y pauser separados.
- **Emitir una representación del peso tiene lectura regulatoria** en Argentina.
  Ver `regulation/001` antes de sacar esto de testnet.
- **Sin blocklist.** Si el marco exige congelar cuentas, hay que agregarla antes
  de cualquier piloto con usuarios reales.

## Pendiente

- Decidir si la API expone un rail `arc-cars` además de `arc-usdc`, y si el
  `PaymentIntent` en ARS pasa a tener representación on-chain por defecto.
- Conciliación automática entre eventos `Issued` / `Transfer` y el ledger interno.
- Definir quién custodia el `MINTER_ROLE` en un piloto.

## Fuentes

- [Deploy on Arc](https://docs.arc.io/arc/tutorials/deploy-on-arc.md) - Foundry, RPC y verificación Blockscout; consultado: `2026-08-15`.
- [Connect to Arc](https://docs.arc.io/arc/references/connect-to-arc.md) - chain id, endpoints y gas en USDC; consultado: `2026-08-15`.
- [OpenZeppelin Contracts v5.4.0](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v5.4.0) - ERC20, Permit, Pausable y AccessControl; consultado: `2026-08-15`.
- `technology-006` - decisión previa sobre activos y wallets del MVP.
