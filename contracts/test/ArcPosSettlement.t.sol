// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ArcPosSettlement, IIssuablePeso} from "../src/ArcPosSettlement.sol";
import {CryptoARS} from "../src/CryptoARS.sol";
import {IssuedPeso} from "../src/IssuedPeso.sol";
import {Pesos} from "../src/Pesos.sol";

contract ArcPosSettlementTest is Test {
    Pesos internal pesos;
    CryptoARS internal cars;
    ArcPosSettlement internal settlement;

    address internal pesosIssuer = makeAddr("pesosIssuer");
    address internal carsIssuer = makeAddr("carsIssuer");
    address internal admin = makeAddr("admin");
    address internal liquidityProvider = makeAddr("liquidityProvider");
    address internal merchant = makeAddr("merchant");

    address internal customer;
    uint256 internal customerKey;

    uint256 internal constant AMOUNT = 15_000_000_000; // 15.000,00
    bytes32 internal constant PAYMENT_ID = keccak256("payment-abc");

    function setUp() public {
        (customer, customerKey) = makeAddrAndKey("customer");

        pesos = new Pesos(pesosIssuer, pesosIssuer, pesosIssuer);
        cars = new CryptoARS(carsIssuer);
        settlement = new ArcPosSettlement(IERC20(address(pesos)), IIssuablePeso(address(cars)), admin, liquidityProvider);

        bytes32 minterRole = cars.MINTER_ROLE();
        vm.prank(carsIssuer);
        cars.grantRole(minterRole, address(settlement));

        vm.prank(pesosIssuer);
        pesos.issue(customer, 100_000_000_000, keccak256("carga-inicial"));
    }

    function _approveAndPay(bytes32 paymentId, uint256 amount) private {
        vm.startPrank(customer);
        pesos.approve(address(settlement), amount);
        settlement.pay(paymentId, merchant, amount);
        vm.stopPrank();
    }

    function test_SettlesBothLegsInOneTransaction() public {
        vm.prank(customer);
        pesos.approve(address(settlement), AMOUNT);

        vm.expectEmit(true, true, true, true, address(settlement));
        emit ArcPosSettlement.PaymentSettled(PAYMENT_ID, customer, merchant, AMOUNT, liquidityProvider);

        vm.prank(customer);
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);

        assertEq(pesos.balanceOf(liquidityProvider), AMOUNT, "el LP recibe los PESOS");
        assertEq(pesos.balanceOf(customer), 100_000_000_000 - AMOUNT);
        assertEq(cars.balanceOf(merchant), AMOUNT, "el comercio recibe los cARS");
        assertEq(cars.totalSupply(), AMOUNT, "los cARS se emitieron, no salieron de un stock");
        assertTrue(settlement.settled(PAYMENT_ID));
    }

    function test_PaymentIdIsUsedAsSettlementReference() public {
        vm.prank(customer);
        pesos.approve(address(settlement), AMOUNT);

        vm.expectEmit(true, true, true, true, address(cars));
        emit CryptoARS.Issued(merchant, AMOUNT, PAYMENT_ID);

        vm.prank(customer);
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
    }

    function test_RejectsDuplicatePaymentId() public {
        _approveAndPay(PAYMENT_ID, AMOUNT);

        vm.startPrank(customer);
        pesos.approve(address(settlement), AMOUNT);
        vm.expectRevert(abi.encodeWithSelector(ArcPosSettlement.PaymentAlreadySettled.selector, PAYMENT_ID));
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
        vm.stopPrank();

        assertEq(cars.totalSupply(), AMOUNT, "no se emite dos veces por el mismo cobro");
    }

    function test_RejectsZeroArguments() public {
        vm.startPrank(customer);
        pesos.approve(address(settlement), AMOUNT);

        vm.expectRevert(ArcPosSettlement.ZeroPaymentId.selector);
        settlement.pay(bytes32(0), merchant, AMOUNT);

        vm.expectRevert(ArcPosSettlement.ZeroAddress.selector);
        settlement.pay(PAYMENT_ID, address(0), AMOUNT);

        vm.expectRevert(ArcPosSettlement.ZeroAmount.selector);
        settlement.pay(PAYMENT_ID, merchant, 0);
        vm.stopPrank();
    }

    function test_RevertsWithoutAllowance() public {
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, address(settlement), 0, AMOUNT)
        );
        vm.prank(customer);
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
    }

    function test_RevertsWhenCustomerLacksBalance() public {
        address broke = makeAddr("broke");

        vm.prank(broke);
        pesos.approve(address(settlement), AMOUNT);

        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, broke, 0, AMOUNT));
        vm.prank(broke);
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
    }

    function test_NothingMovesIfTheIssuanceLegFails() public {
        bytes32 minterRole = cars.MINTER_ROLE();
        vm.prank(carsIssuer);
        cars.revokeRole(minterRole, address(settlement));

        vm.startPrank(customer);
        pesos.approve(address(settlement), AMOUNT);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, address(settlement), minterRole
            )
        );
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
        vm.stopPrank();

        assertEq(pesos.balanceOf(liquidityProvider), 0, "los PESOS no se mueven si no se emiten los cARS");
        assertFalse(settlement.settled(PAYMENT_ID));
    }

    function test_PayWithPermitNeedsNoPriorApproval() public {
        uint256 deadline = block.timestamp + 1 hours;
        (uint8 v, bytes32 r, bytes32 s) = _signPermit(address(settlement), AMOUNT, deadline);

        vm.prank(customer);
        settlement.payWithPermit(PAYMENT_ID, merchant, AMOUNT, deadline, v, r, s);

        assertEq(cars.balanceOf(merchant), AMOUNT);
        assertEq(pesos.allowance(customer, address(settlement)), 0, "la allowance queda consumida");
    }

    function test_PayWithPermitStillSettlesIfPermitWasFrontRun() public {
        uint256 deadline = block.timestamp + 1 hours;
        (uint8 v, bytes32 r, bytes32 s) = _signPermit(address(settlement), AMOUNT, deadline);

        // Alguien mas ejecuta el permit primero: el nonce ya esta consumido.
        pesos.permit(customer, address(settlement), AMOUNT, deadline, v, r, s);

        vm.prank(customer);
        settlement.payWithPermit(PAYMENT_ID, merchant, AMOUNT, deadline, v, r, s);

        assertEq(cars.balanceOf(merchant), AMOUNT);
    }

    function test_PauseStopsSettlement() public {
        vm.prank(admin);
        settlement.pause();

        vm.startPrank(customer);
        pesos.approve(address(settlement), AMOUNT);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        settlement.pay(PAYMENT_ID, merchant, AMOUNT);
        vm.stopPrank();

        vm.prank(admin);
        settlement.unpause();

        _approveAndPay(PAYMENT_ID, AMOUNT);
        assertEq(cars.balanceOf(merchant), AMOUNT);
    }

    function test_OnlyAdminPauses() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, customer, bytes32(0)
            )
        );
        vm.prank(customer);
        settlement.pause();
    }

    function test_LiquidityProviderCanBeRotated() public {
        address nextProvider = makeAddr("nextProvider");

        vm.expectEmit(true, true, true, true, address(settlement));
        emit ArcPosSettlement.LiquidityProviderUpdated(liquidityProvider, nextProvider);

        vm.prank(admin);
        settlement.setLiquidityProvider(nextProvider);

        _approveAndPay(PAYMENT_ID, AMOUNT);

        assertEq(pesos.balanceOf(nextProvider), AMOUNT);
        assertEq(pesos.balanceOf(liquidityProvider), 0);
    }

    function test_ConstructorGuards() public {
        IERC20 pay = IERC20(address(pesos));
        IIssuablePeso settle = IIssuablePeso(address(cars));

        vm.expectRevert(ArcPosSettlement.ZeroAddress.selector);
        new ArcPosSettlement(IERC20(address(0)), settle, admin, liquidityProvider);

        vm.expectRevert(ArcPosSettlement.ZeroAddress.selector);
        new ArcPosSettlement(pay, settle, address(0), liquidityProvider);

        vm.expectRevert(ArcPosSettlement.ZeroAddress.selector);
        new ArcPosSettlement(pay, settle, admin, address(0));

        vm.expectRevert(ArcPosSettlement.SameToken.selector);
        new ArcPosSettlement(pay, IIssuablePeso(address(pesos)), admin, liquidityProvider);
    }

    function testFuzz_EveryCobroIsOneToOne(uint96 amount, bytes32 paymentId) public {
        vm.assume(amount > 0 && amount <= 100_000_000_000);
        vm.assume(paymentId != bytes32(0));

        _approveAndPay(paymentId, amount);

        assertEq(pesos.balanceOf(liquidityProvider), cars.balanceOf(merchant));
        assertEq(cars.totalSupply(), amount);
    }

    function _signPermit(address spender, uint256 value, uint256 deadline)
        private
        view
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                pesos.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                        customer,
                        spender,
                        value,
                        pesos.nonces(customer),
                        deadline
                    )
                )
            )
        );

        return vm.sign(customerKey, digest);
    }
}
