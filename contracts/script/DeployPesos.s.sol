// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Pesos} from "../src/Pesos.sol";

/// @notice Despliega PESOS en Arc Testnet con su propio emisor.
/// @dev Variables: PESOS_ISSUER_PRIVATE_KEY y, opcionales, PESOS_ADMIN,
///      PESOS_MINTER y PESOS_PAUSER (por defecto, el emisor que despliega).
contract DeployPesos is Script {
    uint256 private constant ARC_TESTNET = 5_042_002;

    function run() external returns (Pesos token) {
        require(block.chainid == ARC_TESTNET, "no estas en Arc Testnet");

        uint256 issuerKey = vm.envUint("PESOS_ISSUER_PRIVATE_KEY");
        address issuer = vm.addr(issuerKey);
        address admin = vm.envOr("PESOS_ADMIN", issuer);
        address minter = vm.envOr("PESOS_MINTER", issuer);
        address pauser = vm.envOr("PESOS_PAUSER", issuer);

        vm.startBroadcast(issuerKey);
        token = new Pesos(admin, minter, pauser);
        vm.stopBroadcast();

        console2.log("chainId ", block.chainid);
        console2.log("issuer  ", issuer);
        console2.log("PESOS   ", address(token));
    }
}
