// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ArcPosSettlement, IIssuablePeso} from "../src/ArcPosSettlement.sol";

/// @notice Despliega el contrato de liquidacion del posnet en Arc Testnet.
/// @dev Variables: PRIVATE_KEY (admin del contrato), PESOS_ADDRESS, CARS_ADDRESS
///      y LIQUIDITY_PROVIDER_ADDRESS.
contract DeploySettlement is Script {
    uint256 private constant ARC_TESTNET = 5_042_002;

    function run() external returns (ArcPosSettlement settlement) {
        require(block.chainid == ARC_TESTNET, "no estas en Arc Testnet");

        uint256 adminKey = vm.envUint("PRIVATE_KEY");
        address pesos = vm.envAddress("PESOS_ADDRESS");
        address cars = vm.envAddress("CARS_ADDRESS");
        address provider = vm.envAddress("LIQUIDITY_PROVIDER_ADDRESS");

        require(pesos.code.length > 0, "PESOS_ADDRESS no es un contrato");
        require(cars.code.length > 0, "CARS_ADDRESS no es un contrato");

        vm.startBroadcast(adminKey);
        settlement = new ArcPosSettlement(IERC20(pesos), IIssuablePeso(cars), vm.addr(adminKey), provider);
        vm.stopBroadcast();

        console2.log("settlement       ", address(settlement));
        console2.log("payToken  PESOS  ", pesos);
        console2.log("settle    cARS   ", cars);
        console2.log("liquidityProvider", provider);
    }
}
