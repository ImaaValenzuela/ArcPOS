// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Base de un peso tokenizado con emisor identificable
/// @notice Cada unidad representa un peso acreditado off-chain y todavia no
///         redimido. La emision exige una referencia de liquidacion unica y la
///         redencion exige una referencia de redencion unica, para que el ledger
///         interno y la cadena se concilien sin datos personales on-chain.
/// @dev 6 decimales para compartir la escala de la vista ERC-20 de USDC en Arc.
abstract contract IssuedPeso is ERC20, ERC20Pausable, ERC20Permit, AccessControl {
    /// @notice Emite contra pesos acreditados off-chain.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice Pausa la operacion ante un incidente. Despausar queda en el admin.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    /// @notice Redime tokens de terceros consumiendo allowance.
    bytes32 public constant REDEEMER_ROLE = keccak256("REDEEMER_ROLE");

    uint8 private constant DECIMALS = 6;

    /// @notice Referencias de liquidacion ya usadas para emitir.
    mapping(bytes32 settlementRef => bool used) public settlementUsed;
    /// @notice Referencias de redencion ya usadas para quemar.
    mapping(bytes32 redemptionRef => bool used) public redemptionUsed;

    /// @param to Destino de la emision.
    /// @param amount Monto emitido en unidades de 6 decimales.
    /// @param settlementRef Referencia de la acreditacion que respalda la emision.
    event Issued(address indexed to, uint256 amount, bytes32 indexed settlementRef);

    /// @param from Cuenta cuyos tokens se destruyen.
    /// @param amount Monto redimido en unidades de 6 decimales.
    /// @param redemptionRef Referencia de la devolucion de pesos correspondiente.
    event Redeemed(address indexed from, uint256 amount, bytes32 indexed redemptionRef);

    error ZeroAddress();
    error ZeroAmount();
    error ZeroReference();
    error ReferenceAlreadyUsed(bytes32 usedRef);

    /// @param name_ Nombre del token.
    /// @param symbol_ Ticker del token.
    /// @param admin Recibe DEFAULT_ADMIN_ROLE: reparte roles y despausa.
    /// @param minter Recibe MINTER_ROLE.
    /// @param pauser Recibe PAUSER_ROLE.
    constructor(string memory name_, string memory symbol_, address admin, address minter, address pauser)
        ERC20(name_, symbol_)
        ERC20Permit(name_)
    {
        if (admin == address(0) || minter == address(0) || pauser == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(PAUSER_ROLE, pauser);
    }

    /// @inheritdoc ERC20
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /// @notice Emite contra una acreditacion off-chain, una sola vez por referencia.
    /// @param to Destino de la emision.
    /// @param amount Monto en unidades de 6 decimales.
    /// @param settlementRef Referencia de la acreditacion. No puede repetirse.
    function issue(address to, uint256 amount, bytes32 settlementRef) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        _requireFreshReference(settlementRef, settlementUsed[settlementRef]);

        settlementUsed[settlementRef] = true;
        _mint(to, amount);
        emit Issued(to, amount, settlementRef);
    }

    /// @notice Redime tokens propios contra la devolucion de pesos.
    /// @param amount Monto en unidades de 6 decimales.
    /// @param redemptionRef Referencia de la devolucion. No puede repetirse.
    function redeem(uint256 amount, bytes32 redemptionRef) external {
        _redeem(_msgSender(), amount, redemptionRef);
    }

    /// @notice Redime tokens de un tercero consumiendo su allowance.
    /// @param from Cuenta a redimir.
    /// @param amount Monto en unidades de 6 decimales.
    /// @param redemptionRef Referencia de la devolucion. No puede repetirse.
    function redeemFrom(address from, uint256 amount, bytes32 redemptionRef) external onlyRole(REDEEMER_ROLE) {
        _spendAllowance(from, _msgSender(), amount);
        _redeem(from, amount, redemptionRef);
    }

    /// @notice Corta transferencias, emisiones y redenciones.
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Reanuda la operacion. Reservado al admin, no al pauser.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _redeem(address from, uint256 amount, bytes32 redemptionRef) private {
        if (amount == 0) revert ZeroAmount();
        _requireFreshReference(redemptionRef, redemptionUsed[redemptionRef]);

        redemptionUsed[redemptionRef] = true;
        _burn(from, amount);
        emit Redeemed(from, amount, redemptionRef);
    }

    function _requireFreshReference(bytes32 ref, bool used) private pure {
        if (ref == bytes32(0)) revert ZeroReference();
        if (used) revert ReferenceAlreadyUsed(ref);
    }

    /// @dev Resuelve el override compartido entre ERC20 y ERC20Pausable.
    ///      No se rechaza `value == 0` aca: el EIP-20 exige tratar la
    ///      transferencia de cero como una transferencia normal. El monto cero
    ///      se rechaza en `issue` y en `_redeem`, que si son operaciones del emisor.
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
