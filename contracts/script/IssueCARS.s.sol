// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {CryptoARS} from "../src/CryptoARS.sol";

/// @notice Emite cARS contra una acreditacion ARS ya confirmada off-chain.
/// @dev Variables de entorno: PRIVATE_KEY (minter), CARS_ADDRESS, CARS_ISSUE_TO,
///      CARS_ISSUE_AMOUNT (unidades de 6 decimales) y CARS_SETTLEMENT_REF.
contract IssueCARS is Script {
    function run() external {
        uint256 minterKey = vm.envUint("PRIVATE_KEY");
        CryptoARS token = CryptoARS(vm.envAddress("CARS_ADDRESS"));
        address to = vm.envAddress("CARS_ISSUE_TO");
        uint256 amount = vm.envUint("CARS_ISSUE_AMOUNT");
        bytes32 settlementRef = keccak256(bytes(vm.envString("CARS_SETTLEMENT_REF")));

        vm.startBroadcast(minterKey);
        token.issue(to, amount, settlementRef);
        vm.stopBroadcast();

        console2.log("issued to  ", to);
        console2.log("amount     ", amount);
        console2.log("new supply ", token.totalSupply());
    }
}
