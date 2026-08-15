# Handoff: cobro on-chain PESOS → cARS en Arc Testnet

Documento para retomar el trabajo sin contexto previo. Describe qué se agregó al
repo, qué está desplegado, cómo correrlo y qué falta.

Fecha: 2026-08-15. Todo es **Arc Testnet** (`chainId 5042002`), nada toca dinero real.

## Qué problema resuelve

ArcPOS cobra en ARS y liquida en USDC, pero el pagador nunca toca la cadena
(ver `research/technology/006-activos-y-wallets-para-el-mvp.md`). Entre el pago
en pesos y la liquidación en USDC no había **nada verificable on-chain**, y el
PSP argentino todavía no existe. Sin eso no hay demo posible.

La respuesta es un cobro de tres partes, todo on-chain y en una sola transacción:

```text
  CLIENTE                 CONTRATO                    COMERCIO
  tiene PESOS          ArcPosSettlement              quiere cARS
     |                        |                           |
     |-- payWithPermit(paymentId, merchant, amount) ----->|
     |                        |                           |
     |    transferFrom PESOS  |--> LIQUIDITY PROVIDER      |
     |                        |    (recibe los PESOS)      |
     |                        |                           |
     |                        |-- issue(cARS, paymentId) ->|
     |                        |                           |
     |              evento PaymentSettled(paymentId, ...)  |
```

Las dos patas son atómicas: si la emisión de cARS falla, la transferencia de
PESOS revierte y el `paymentId` no queda marcado como liquidado.

**La tesis, dicha con precisión:** PESOS y cARS son ambos un peso con 6
decimales. No es un swap de monedas, es una **conversión par entre dos
emisores**. El cliente tiene un crédito contra el emisor A y el comercio sólo
acepta un crédito contra el emisor B. El liquidity provider absorbe el riesgo de
A y B emite su pasivo al comercio, atómicamente. Presentarlo como "swap" o como
"stablecoin respaldada" es indefendible; presentarlo como interoperabilidad
entre emisores, sí se sostiene.

## Desplegado en Arc Testnet

| Qué | Dirección | Notas |
|---|---|---|
| cARS (`Crypto ARS`) | [`0xee60c4c1E08999c4b6061Afe072d31C9549F5e48`](https://testnet.arcscan.app/address/0xee60c4c1E08999c4b6061Afe072d31C9549F5e48) | Lo que cobra el comercio. Código verificado |
| PESOS (`Pesos`) | [`0x23EEeC1331c952617691E5905793cF96062C3dD1`](https://testnet.arcscan.app/address/0x23EEeC1331c952617691E5905793cF96062C3dD1) | Lo que paga el cliente |
| ArcPosSettlement | [`0xEFD8207b4EA173CBEF362E94D1dfEe43296da77B`](https://testnet.arcscan.app/address/0xEFD8207b4EA173CBEF362E94D1dfEe43296da77B) | Liquida el cobro |
| USDC (nativo de Arc) | `0x3600000000000000000000000000000000000000` | Es el gas de la red |

Ambos tokens tienen **6 decimales**, igual que la vista ERC-20 de USDC en Arc.

### Cuentas de la demo

| Rol | Dirección | Tiene key | Dónde vive la key |
|---|---|---|---|
| Tesorería / admin de cARS y del settlement | `0x0F15a9B272CA707DE99E9395c7fa7486Ee4e3d46` | sí | `contracts/.env` |
| Emisor de PESOS | `0x0A61b801090ec4a731A89D698F7910d42F861a27` | sí | `contracts/.env` |
| Liquidity provider | `0x434D96429769AD49da04656ba91B73bEbB20c371` | sí | `contracts/.env` |
| Cliente pagador | `0x90ca865b044a402a899CCFfDB746Bc5eA7f6b535` | sí | `contracts/.env`, va en la app del cliente |
| Comercio | `0x8Ac4710c784e73BA5CD522763f0D8b7F74e03e10` | no hace falta | solo se usa la dirección |

**El posnet no necesita ninguna private key**: el comercio recibe, no firma ni
mueve fondos. La única key que va a un teléfono es la del cliente.

Las claves están en `contracts/.env`, que está gitignoreado y **no se commitea**.
Son wallets descartables de testnet: si se filtran, se descartan y se generan
otras. Nunca mandarles fondos reales.

`MINTER_ROLE` de cARS lo tiene **únicamente** el contrato de liquidación: el
admin se lo revocó a sí mismo, así que no existe cARS que no venga de un cobro.

### Corrida real ya ejecutada

| Paso | Tx |
|---|---|
| Deploy de cARS | `0xba7107dc5c9a61884d74673e38d82b65a76d63ef9c0b78b4a6f0a31d4514277e` |
| Cobro completo PESOS → cARS | [`0xa68621d34273fced601e064a5650f566bcda1a1bb214367e93d4bf61e959f26f`](https://testnet.arcscan.app/tx/0xa68621d34273fced601e064a5650f566bcda1a1bb214367e93d4bf61e959f26f) |

En esa transacción el cliente pagó 15.000,00 PESOS, el LP los recibió y al
comercio se le emitieron 15.000,00 cARS. Todo el deploy y las pruebas costaron
menos de 0,1 USDC de gas.

## Qué se agregó al repo

### `contracts/` (nuevo, Foundry)

| Archivo | Qué es |
|---|---|
| `src/IssuedPeso.sol` | Base de un peso tokenizado: roles, emisión con referencia única, redención con referencia, pausa, permit |
| `src/Pesos.sol` | El token PESOS sobre esa base |
| `src/CryptoARS.sol` | El token cARS. Es la versión desplegada, **no tiene** el dedupe de referencias que sí tiene `IssuedPeso` |
| `src/ArcPosSettlement.sol` | El cobro de tres partes |
| `test/*.t.sol` | 44 tests, todos en verde |
| `script/*.s.sol` | Deploy, emisión, cableado de roles y una corrida del cobro |

### `services/api/src/arc.service.ts` (corregido)

El observador de pagos **no podía funcionar**. Dos bugs:

1. El topic hash de `Transfer` estaba mal escrito: 63 caracteres en vez de 64, y
   además un hash distinto del real. La RPC rechazaba la consulta con
   `Invalid params`, o sea que el endpoint de estado tiraba 503 siempre.
2. Leía el monto de `topics[3]`, que no existe: `Transfer` indexa `from` y `to`,
   el monto va en `data`.

Está arreglado y verificado contra la cadena real.

### `packages/config/src/index.ts`

Se agregó `carsTestnet` con dirección, símbolo y decimales de cARS.

### `research/technology/008-cars-token-en-arc-testnet.md`

La decisión documentada en el formato del repo, planteada como complemento de la
006, no como reemplazo: **USDC sigue siendo el activo de liquidación**.

## Cómo correrlo

```bash
pnpm install

# contratos
cd contracts
cp .env.example .env          # completar las claves, sólo testnet
forge install foundry-rs/forge-std@v1.11.0 OpenZeppelin/openzeppelin-contracts@v5.4.0
forge build && forge test

# repetir el cobro de punta a punta (cambiar DEMO_PAYMENT_ID en cada corrida)
set -a && . ./.env && set +a
export DEMO_AMOUNT=15000000000 DEMO_PAYMENT_ID="pos-demo-0002"
forge script script/PayDemo.s.sol:PayDemo --rpc-url "$ARC_TESTNET_RPC_URL" --broadcast --slow
```

Notas de Arc que ahorran horas:

- El gas se paga en USDC. Fondear desde https://faucet.circle.com, red Arc Testnet.
- El saldo nativo (18 decimales) y el USDC ERC-20 (6 decimales) **son el mismo
  fondo** visto de dos formas. Nunca sumarlos. Transferir USDC ERC-20 a una
  wallet le carga el gas.
- `foundry.toml` no puede declarar `[etherscan]`: foundry no reconoce el chain id
  y falla con `Chain 5042002 not supported`. La verificación va por Blockscout:
  `--verifier blockscout --verifier-url https://testnet.arcscan.app/api/`.
- Docs: https://docs.arc.io/llms.txt (ojo, `docs.arc.network` redirige a `docs.arc.io`).

## Lo que falta

### Para que la demo exista

1. **API**: endpoint que cree el cobro (`paymentId`, comercio, monto) y un
   observador del evento `PaymentSettled` que pase el pago a `confirmed` con su
   `txHash`. El watcher de `Transfer` ya arreglado sirve de base.
2. **merchant-mobile**: el monto ya se ingresa; falta crear el cobro contra la
   API y mostrar un **QR real** que codifique `paymentId`, comercio, monto y
   dirección del contrato. Hoy `QrStep.tsx` dibuja una grilla decorativa que no
   es escaneable.
3. **customer-mobile**: escanear, mostrar el resumen y al aceptar firmar y enviar
   `payWithPermit` con la key del cliente.
4. **Sacar la simulación**: `QrStep.tsx:44` y `payment-screens.tsx:28` permiten
   dar un cobro por confirmado con un toque local, sin transacción. Es lo primero
   que hay que borrar: hoy el comercio puede aceptar un cobro que no existe.

### Riesgos conocidos, en orden de qué atacaría un juez técnico

1. **El QR no está firmado.** El pagador elige `paymentId`, `merchant` y `amount`
   libremente al llamar al contrato: nada ata esos datos al cobro que mostró el
   posnet. El fix es una factura firmada EIP-712 por el comercio o por la API,
   que el contrato verifique. Implica que el posnet necesite una key para
   **firmar** (nunca para gastar).
2. **El respaldo no queda bloqueado.** Los PESOS van a una EOA que puede moverlos
   mientras los cARS siguen circulando. La cadena prueba que hubo una
   transferencia, no que el respaldo siga existiendo. El fix serio es un vault
   con el invariante `PESOS bloqueados >= cARS emitidos`.
3. **La redención no cierra el ciclo.** Quemar cARS no libera PESOS ni registra
   contra qué se redimió.
4. **cARS desplegado no deduplica referencias** ni rechaza monto cero, a
   diferencia de `IssuedPeso`. Hoy lo cubre el dedupe por `paymentId` del
   settlement, pero un cARS v2 sobre `IssuedPeso` lo resolvería en el token.
5. **Todo depende de EOAs sueltas.** Un solo admin puede pausar, rotar el LP y
   repartir roles. Para cualquier piloto: multisig y roles separados.
6. **Sin fee.** El LP asume riesgo, liquidez y operación sin remuneración. Vale
   modelar el fee aunque quede en cero, para no fingir que el costo no existe.

Ninguno de estos bloquea la demo. Todos hay que decirlos en voz alta antes de que
los pregunten.
