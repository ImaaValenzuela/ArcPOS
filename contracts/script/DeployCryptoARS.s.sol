// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {CryptoARS} from "../src/CryptoARS.sol";

/// @notice Despliega cARS en Arc Testnet.
/// @dev Requiere PRIVATE_KEY en el entorno. CARS_ADMIN es opcional: si no se
///      define, el deployer queda como admin, minter y pauser.
contract DeployCryptoARS is Script {
    function run() external returns (CryptoARS token) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        address admin = vm.envOr("CARS_ADMIN", deployer);

        vm.startBroadcast(deployerKey);
        token = new CryptoARS(admin);
        vm.stopBroadcast();

        console2.log("chainId  ", block.chainid);
        console2.log("deployer ", deployer);
        console2.log("admin    ", admin);
        console2.log("cARS     ", address(token));
    }
}
