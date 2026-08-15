// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IssuedPeso} from "../src/IssuedPeso.sol";
import {Pesos} from "../src/Pesos.sol";

contract PesosTest is Test {
    Pesos internal token;

    address internal admin = makeAddr("admin");
    address internal minter = makeAddr("minter");
    address internal pauser = makeAddr("pauser");
    address internal customer = makeAddr("customer");
    address internal merchant = makeAddr("merchant");

    bytes32 internal constant REF = keccak256("payment-0001");
    bytes32 internal constant OTHER_REF = keccak256("payment-0002");

    function setUp() public {
        token = new Pesos(admin, minter, pauser);
    }

    function _issue(address to, uint256 amount, bytes32 ref) private {
        vm.prank(minter);
        token.issue(to, amount, ref);
    }

    function test_Metadata() public view {
        assertEq(token.name(), "Pesos");
        assertEq(token.symbol(), "PESOS");
        assertEq(token.decimals(), 6);
        assertEq(token.totalSupply(), 0);
    }

    function test_RolesAreSeparated() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(token.hasRole(token.MINTER_ROLE(), minter));
        assertTrue(token.hasRole(token.PAUSER_ROLE(), pauser));
        assertFalse(token.hasRole(token.MINTER_ROLE(), admin));
        assertFalse(token.hasRole(token.PAUSER_ROLE(), admin));
    }

    function test_ConstructorRejectsZeroAccounts() public {
        vm.expectRevert(IssuedPeso.ZeroAddress.selector);
        new Pesos(address(0), minter, pauser);

        vm.expectRevert(IssuedPeso.ZeroAddress.selector);
        new Pesos(admin, address(0), pauser);

        vm.expectRevert(IssuedPeso.ZeroAddress.selector);
        new Pesos(admin, minter, address(0));
    }

    function test_IssueMarksReferenceAndEmits() public {
        vm.expectEmit(true, true, true, true, address(token));
        emit IssuedPeso.Issued(customer, 50_000_000, REF);

        _issue(customer, 50_000_000, REF);

        assertEq(token.balanceOf(customer), 50_000_000);
        assertTrue(token.settlementUsed(REF));
    }

    function test_IssueRejectsDuplicateReference() public {
        _issue(customer, 1_000_000, REF);

        vm.expectRevert(abi.encodeWithSelector(IssuedPeso.ReferenceAlreadyUsed.selector, REF));
        _issue(customer, 1_000_000, REF);

        assertEq(token.totalSupply(), 1_000_000);
    }

    function test_IssueRejectsZeroReference() public {
        vm.expectRevert(IssuedPeso.ZeroReference.selector);
        _issue(customer, 1_000_000, bytes32(0));
    }

    function test_IssueRejectsZeroAmount() public {
        vm.expectRevert(IssuedPeso.ZeroAmount.selector);
        _issue(customer, 0, REF);
    }

    function test_IssueRejectsZeroDestination() public {
        vm.expectRevert(IssuedPeso.ZeroAddress.selector);
        _issue(address(0), 1_000_000, REF);
    }

    function test_IssueRevertsForNonMinter() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, admin, token.MINTER_ROLE()
            )
        );
        vm.prank(admin);
        token.issue(customer, 1_000_000, REF);
    }

    function test_RedeemBurnsAndMarksReference() public {
        _issue(customer, 3_000_000, REF);

        vm.expectEmit(true, true, true, true, address(token));
        emit IssuedPeso.Redeemed(customer, 3_000_000, OTHER_REF);

        vm.prank(customer);
        token.redeem(3_000_000, OTHER_REF);

        assertEq(token.totalSupply(), 0);
        assertTrue(token.redemptionUsed(OTHER_REF));
    }

    function test_RedeemRejectsDuplicateReference() public {
        _issue(customer, 3_000_000, REF);

        vm.startPrank(customer);
        token.redeem(1_000_000, OTHER_REF);

        vm.expectRevert(abi.encodeWithSelector(IssuedPeso.ReferenceAlreadyUsed.selector, OTHER_REF));
        token.redeem(1_000_000, OTHER_REF);
        vm.stopPrank();
    }

    function test_RedeemFromRequiresRoleAndAllowance() public {
        _issue(customer, 3_000_000, REF);

        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, merchant, token.REDEEMER_ROLE()
            )
        );
        vm.prank(merchant);
        token.redeemFrom(customer, 1_000_000, OTHER_REF);

        // La llamada externa a REDEEMER_ROLE() consumiria el prank si fuera inline.
        bytes32 redeemerRole = token.REDEEMER_ROLE();
        vm.prank(admin);
        token.grantRole(redeemerRole, merchant);

        vm.prank(customer);
        token.approve(merchant, 1_000_000);

        vm.prank(merchant);
        token.redeemFrom(customer, 1_000_000, OTHER_REF);

        assertEq(token.totalSupply(), 2_000_000);
    }

    function test_PauseStopsMovementAndOnlyAdminResumes() public {
        _issue(customer, 2_000_000, REF);

        vm.prank(pauser);
        token.pause();

        vm.expectRevert(Pausable.EnforcedPause.selector);
        vm.prank(customer);
        token.transfer(merchant, 1);

        vm.expectRevert(Pausable.EnforcedPause.selector);
        vm.prank(customer);
        token.redeem(1, OTHER_REF);

        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, pauser, token.DEFAULT_ADMIN_ROLE()
            )
        );
        vm.prank(pauser);
        token.unpause();

        vm.prank(admin);
        token.unpause();

        vm.prank(customer);
        token.transfer(merchant, 1);
        assertEq(token.balanceOf(merchant), 1);
    }

    function test_ZeroValueTransferIsAllowedPerEip20() public {
        vm.prank(customer);
        token.transfer(merchant, 0);
        assertEq(token.balanceOf(merchant), 0);
    }

    function test_PermitLetsThePosPullWithoutHolderGas() public {
        (address holder, uint256 holderKey) = makeAddrAndKey("holder");
        _issue(holder, 7_000_000, REF);

        uint256 deadline = block.timestamp + 1 hours;
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                        holder,
                        merchant,
                        7_000_000,
                        token.nonces(holder),
                        deadline
                    )
                )
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(holderKey, digest);

        token.permit(holder, merchant, 7_000_000, deadline, v, r, s);
        assertEq(token.allowance(holder, merchant), 7_000_000);
    }

    function test_PermitRejectsExpiredDeadline() public {
        (address holder, uint256 holderKey) = makeAddrAndKey("holder");
        uint256 deadline = block.timestamp - 1;

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                        holder,
                        merchant,
                        1,
                        token.nonces(holder),
                        deadline
                    )
                )
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(holderKey, digest);

        vm.expectRevert();
        token.permit(holder, merchant, 1, deadline, v, r, s);
    }

    function testFuzz_IssueIsIdempotentPerReference(bytes32 ref, uint96 amount) public {
        vm.assume(ref != bytes32(0));
        vm.assume(amount > 0);

        _issue(customer, amount, ref);

        vm.expectRevert(abi.encodeWithSelector(IssuedPeso.ReferenceAlreadyUsed.selector, ref));
        _issue(customer, amount, ref);

        assertEq(token.totalSupply(), amount);
    }
}
