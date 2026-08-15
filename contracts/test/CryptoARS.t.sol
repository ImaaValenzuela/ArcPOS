// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {CryptoARS} from "../src/CryptoARS.sol";

contract CryptoARSTest is Test {
    CryptoARS internal token;

    address internal admin = makeAddr("admin");
    address internal merchant = makeAddr("merchant");
    address internal customer = makeAddr("customer");

    bytes32 internal constant REFERENCE = keccak256("psp-settlement-0001");

    function setUp() public {
        token = new CryptoARS(admin);
    }

    function test_MetadataMatchesUsdcView() public view {
        assertEq(token.name(), "Crypto ARS");
        assertEq(token.symbol(), "cARS");
        assertEq(token.decimals(), 6);
        assertEq(token.totalSupply(), 0);
    }

    function test_ConstructorRejectsZeroAdmin() public {
        vm.expectRevert(CryptoARS.ZeroAddress.selector);
        new CryptoARS(address(0));
    }

    function test_AdminHoldsEveryRole() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(token.hasRole(token.MINTER_ROLE(), admin));
        assertTrue(token.hasRole(token.PAUSER_ROLE(), admin));
    }

    function test_IssueMintsAndEmitsReference() public {
        vm.expectEmit(true, true, true, true, address(token));
        emit CryptoARS.Issued(merchant, 15_000_000_000, REFERENCE);

        vm.prank(admin);
        token.issue(merchant, 15_000_000_000, REFERENCE);

        assertEq(token.balanceOf(merchant), 15_000_000_000);
        assertEq(token.totalSupply(), 15_000_000_000);
    }

    function test_IssueRevertsForNonMinter() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, customer, token.MINTER_ROLE()
            )
        );
        vm.prank(customer);
        token.issue(customer, 1_000_000, REFERENCE);
    }

    function test_IssueRevertsForZeroDestination() public {
        vm.expectRevert(CryptoARS.ZeroAddress.selector);
        vm.prank(admin);
        token.issue(address(0), 1_000_000, REFERENCE);
    }

    function test_RedemptionBurnsSupply() public {
        vm.prank(admin);
        token.issue(merchant, 5_000_000, REFERENCE);

        vm.prank(merchant);
        token.burn(2_000_000);

        assertEq(token.balanceOf(merchant), 3_000_000);
        assertEq(token.totalSupply(), 3_000_000);
    }

    function test_BurnFromRequiresAllowance() public {
        vm.prank(admin);
        token.issue(merchant, 5_000_000, REFERENCE);

        vm.prank(merchant);
        token.approve(admin, 2_000_000);

        vm.prank(admin);
        token.burnFrom(merchant, 2_000_000);

        assertEq(token.totalSupply(), 3_000_000);
    }

    function test_PauseBlocksTransfersAndIssuance() public {
        vm.startPrank(admin);
        token.issue(merchant, 1_000_000, REFERENCE);
        token.pause();
        vm.stopPrank();

        vm.expectRevert(Pausable.EnforcedPause.selector);
        vm.prank(merchant);
        token.transfer(customer, 1);

        vm.expectRevert(Pausable.EnforcedPause.selector);
        vm.prank(admin);
        token.issue(merchant, 1, REFERENCE);

        vm.prank(admin);
        token.unpause();

        vm.prank(merchant);
        token.transfer(customer, 1);
        assertEq(token.balanceOf(customer), 1);
    }

    function test_PauseRevertsForNonPauser() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector, customer, token.PAUSER_ROLE()
            )
        );
        vm.prank(customer);
        token.pause();
    }

    function test_PermitApprovesWithoutGasFromHolder() public {
        (address holder, uint256 holderKey) = makeAddrAndKey("holder");

        vm.prank(admin);
        token.issue(holder, 4_000_000, REFERENCE);

        uint256 deadline = block.timestamp + 1 hours;
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                holder,
                merchant,
                4_000_000,
                token.nonces(holder),
                deadline
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(holderKey, digest);

        token.permit(holder, merchant, 4_000_000, deadline, v, r, s);
        assertEq(token.allowance(holder, merchant), 4_000_000);

        vm.prank(merchant);
        token.transferFrom(holder, merchant, 4_000_000);
        assertEq(token.balanceOf(merchant), 4_000_000);
    }

    function test_TransferRevertsOnInsufficientBalance() public {
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, merchant, 0, 1_000_000)
        );
        vm.prank(merchant);
        token.transfer(customer, 1_000_000);
    }

    function testFuzz_IssueThenTransferPreservesSupply(uint96 minted, uint96 sent) public {
        vm.assume(sent <= minted);

        vm.prank(admin);
        token.issue(merchant, minted, REFERENCE);

        vm.prank(merchant);
        token.transfer(customer, sent);

        assertEq(token.balanceOf(merchant) + token.balanceOf(customer), minted);
        assertEq(token.totalSupply(), minted);
    }
}
