// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IssuedPeso} from "./IssuedPeso.sol";

/// @title PESOS - el peso que el cliente usa para pagar en el POS
/// @notice Emisor propio, separado del emisor de cARS. En el flujo de demo el
///         cliente paga PESOS en el posnet y el comercio recibe cARS.
/// @dev Testnet. No es un instrumento regulado ni tiene respaldo auditado.
contract Pesos is IssuedPeso {
    constructor(address admin, address minter, address pauser)
        IssuedPeso("Pesos", "PESOS", admin, minter, pauser)
    {}
}
