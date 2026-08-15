# cARS - contratos de ArcPOS

`cARS` (Crypto ARS) es el peso argentino tokenizado que usa ArcPOS para representar
on-chain una acreditacion en ARS. Es un ERC-20 con 6 decimales, la misma vista
numerica que USDC en Arc, para que el POS no tenga que convertir escalas.

> Testnet. No es un instrumento regulado, no tiene respaldo auditado y no debe
> usarse con dinero real.

## Despliegue actual

| Campo | Valor |
|---|---|
| Red | Arc Testnet (`5042002`) |
| Contrato | [`0xee60c4c1E08999c4b6061Afe072d31C9549F5e48`](https://testnet.arcscan.app/address/0xee60c4c1E08999c4b6061Afe072d31C9549F5e48) |
| Nombre / ticker | `Crypto ARS` / `cARS` |
| Decimales | 6 |
| Admin, minter y pauser | `0x0F15a9B272CA707DE99E9395c7fa7486Ee4e3d46` |
| Tx de deploy | `0xba7107dc5c9a61884d74673e38d82b65a76d63ef9c0b78b4a6f0a31d4514277e` |
| Tx de primera emision | `0xe784f4477c0e0f374a59e91efa6598a0ef85f976a6f8fb7e7b83e44710ef19a0` |
| Codigo verificado | si, en testnet.arcscan.app |

## Diseno del contrato

`src/CryptoARS.sol` compone extensiones auditadas de OpenZeppelin v5.4.0:

- **ERC20 + ERC20Permit**: transferencias estandar y aprobaciones firmadas (EIP-2612),
  para que un pagador pueda autorizar sin tener que mandar una tx aparte.
- **AccessControl**: `MINTER_ROLE` emite, `PAUSER_ROLE` frena, `DEFAULT_ADMIN_ROLE`
  reparte roles. Nadie mas puede emitir.
- **ERC20Pausable**: corta transferencias, emisiones y quemas ante un incidente.
- **ERC20Burnable**: la redencion quema el circulante contra la devolucion de ARS.
- **`issue(to, amount, settlementRef)`**: unico camino de emision. Emite el evento
  `Issued` con la referencia de la acreditacion off-chain que la respalda, asi el
  ledger interno y la cadena se pueden conciliar sin datos personales on-chain.

Invariante operativa: cada `cARS` en circulacion debe corresponder a un peso
acreditado y todavia no redimido. La cadena no lo puede garantizar sola, por eso
la referencia de liquidacion viaja en el evento.

## Uso

```bash
cp .env.example .env      # completar PRIVATE_KEY (solo testnet)
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts@v5.4.0
forge build
forge test -vv
```

Deploy:

```bash
set -a && . ./.env && set +a
forge script script/DeployCryptoARS.s.sol:DeployCryptoARS \
  --rpc-url "$ARC_TESTNET_RPC_URL" --broadcast --slow
```

Emision contra una acreditacion confirmada:

```bash
export CARS_ADDRESS=0xee60c4c1E08999c4b6061Afe072d31C9549F5e48
export CARS_ISSUE_TO=0x...
export CARS_ISSUE_AMOUNT=250000000000          # 250.000,00 cARS en 6 decimales
export CARS_SETTLEMENT_REF=psp-settlement-0042
forge script script/IssueCARS.s.sol:IssueCARS \
  --rpc-url "$ARC_TESTNET_RPC_URL" --broadcast --slow
```

Verificacion de codigo (Blockscout):

```bash
forge verify-contract <address> src/CryptoARS.sol:CryptoARS \
  --chain-id 5042002 --verifier blockscout \
  --verifier-url https://testnet.arcscan.app/api/ \
  --compiler-version 0.8.28 \
  --constructor-args $(cast abi-encode "constructor(address)" <admin>)
```

## Notas de Arc

- El gas se paga en USDC. Fondear el deployer en https://faucet.circle.com antes
  de cualquier tx. El deploy completo costo `0.030818` USDC.
- El saldo nativo (18 decimales) y el ERC-20 de USDC (6 decimales) son el mismo
  fondo visto de dos maneras. Nunca sumarlos ni mostrarlos por separado.
- `cARS` no comparte esa dualidad: es un ERC-20 comun de 6 decimales.
- `foundry.toml` no declara bloque `[etherscan]` a proposito: foundry todavia no
  reconoce el chain id `5042002` y falla con `Chain 5042002 not supported`.

## Pendiente antes de produccion

- Multisig como admin en vez de una EOA, y separar minter de pauser.
- Blocklist o freeze por cuenta si el marco regulatorio lo exige.
- Prueba de reservas y conciliacion automatica contra el ledger interno.
- Auditoria externa y revision legal (ver `research/regulation/`).
