// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ArcPosSettlement} from "../src/ArcPosSettlement.sol";
import {CryptoARS} from "../src/CryptoARS.sol";
import {Pesos} from "../src/Pesos.sol";

/// @notice Corre el rulo completo desde la billetera del cliente: firma la
///         autorizacion de PESOS y liquida el cobro en una sola transaccion.
/// @dev Es la misma llamada que hara la app del cliente al aceptar el QR.
///      Variables: CUSTOMER_PRIVATE_KEY, PESOS_ADDRESS, CARS_ADDRESS,
///      SETTLEMENT_ADDRESS, MERCHANT_ADDRESS, DEMO_PAYMENT_ID y DEMO_AMOUNT.
contract PayDemo is Script {
    uint256 private constant ARC_TESTNET = 5_042_002;

    bytes32 private constant PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    function run() external {
        require(block.chainid == ARC_TESTNET, "no estas en Arc Testnet");

        uint256 customerKey = vm.envUint("CUSTOMER_PRIVATE_KEY");
        address customer = vm.addr(customerKey);

        Pesos pesos = Pesos(vm.envAddress("PESOS_ADDRESS"));
        CryptoARS cars = CryptoARS(vm.envAddress("CARS_ADDRESS"));
        ArcPosSettlement settlement = ArcPosSettlement(vm.envAddress("SETTLEMENT_ADDRESS"));

        address merchant = vm.envAddress("MERCHANT_ADDRESS");
        uint256 amount = vm.envUint("DEMO_AMOUNT");
        bytes32 paymentId = keccak256(bytes(vm.envString("DEMO_PAYMENT_ID")));
        uint256 deadline = block.timestamp + 1 hours;

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                pesos.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        PERMIT_TYPEHASH, customer, address(settlement), amount, pesos.nonces(customer), deadline
                    )
                )
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(customerKey, digest);

        vm.startBroadcast(customerKey);
        settlement.payWithPermit(paymentId, merchant, amount, deadline, v, r, s);
        vm.stopBroadcast();

        console2.log("cobro liquidado");
        console2.log("  cliente PESOS  ", pesos.balanceOf(customer));
        console2.log("  LP PESOS       ", pesos.balanceOf(settlement.liquidityProvider()));
        console2.log("  comercio cARS  ", cars.balanceOf(merchant));
        console2.log("  supply cARS    ", cars.totalSupply());
    }
}
