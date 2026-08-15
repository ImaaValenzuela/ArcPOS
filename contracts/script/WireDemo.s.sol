// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {CryptoARS} from "../src/CryptoARS.sol";
import {Pesos} from "../src/Pesos.sol";

/// @notice Deja la demo lista: el contrato de liquidacion pasa a ser el unico
///         minter de cARS y el cliente recibe PESOS para poder pagar.
/// @dev Se corre en dos pasos porque las firmas son de cuentas distintas.
///      Paso `cars`: firma el admin de cARS (PRIVATE_KEY).
///      Paso `pesos`: firma el emisor de PESOS (PESOS_ISSUER_PRIVATE_KEY).
contract WireDemo is Script {
    uint256 private constant ARC_TESTNET = 5_042_002;

    /// @notice Otorga MINTER_ROLE de cARS al contrato de liquidacion y se lo
    ///         revoca al admin, para que ningun cARS pueda emitirse fuera de un cobro.
    function grantMinterToSettlement() external {
        require(block.chainid == ARC_TESTNET, "no estas en Arc Testnet");

        uint256 adminKey = vm.envUint("PRIVATE_KEY");
        CryptoARS cars = CryptoARS(vm.envAddress("CARS_ADDRESS"));
        address settlement = vm.envAddress("SETTLEMENT_ADDRESS");
        bytes32 minterRole = cars.MINTER_ROLE();

        vm.startBroadcast(adminKey);
        cars.grantRole(minterRole, settlement);
        cars.revokeRole(minterRole, vm.addr(adminKey));
        vm.stopBroadcast();

        console2.log("settlement es minter de cARS ", cars.hasRole(minterRole, settlement));
        console2.log("el admin ya no es minter     ", cars.hasRole(minterRole, vm.addr(adminKey)));
    }

    /// @notice Carga PESOS en la billetera del cliente para la demo.
    function fundCustomerWithPesos() external {
        require(block.chainid == ARC_TESTNET, "no estas en Arc Testnet");

        uint256 issuerKey = vm.envUint("PESOS_ISSUER_PRIVATE_KEY");
        Pesos pesos = Pesos(vm.envAddress("PESOS_ADDRESS"));
        address customer = vm.envAddress("CUSTOMER_ADDRESS");
        uint256 amount = vm.envOr("PESOS_DEMO_FUNDING", uint256(500_000_000_000));
        bytes32 settlementRef = keccak256(bytes(vm.envString("PESOS_FUNDING_REF")));

        vm.startBroadcast(issuerKey);
        pesos.issue(customer, amount, settlementRef);
        vm.stopBroadcast();

        console2.log("cliente        ", customer);
        console2.log("saldo PESOS    ", pesos.balanceOf(customer));
    }
}
