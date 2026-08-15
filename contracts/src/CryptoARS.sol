// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title cARS - peso argentino tokenizado para liquidacion en ArcPOS
/// @notice ERC-20 con 6 decimales (misma vista que USDC en Arc) usado como
///         representacion on-chain de un peso argentino respaldado off-chain.
///         Emision y quema quedan en manos del emisor: cada mint debe tener
///         respaldo ARS acreditado y cada redencion debe quemar el mismo monto.
/// @dev Testnet. No es un instrumento regulado ni tiene respaldo auditado.
contract CryptoARS is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, AccessControl {
    /// @notice Puede emitir cARS contra ARS acreditados off-chain.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice Puede pausar y despausar las transferencias ante un incidente.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice Decimales fijos en 6 para alinear con la vista ERC-20 de USDC en Arc.
    uint8 private constant DECIMALS = 6;

    /// @notice Emitido en cada mint con la referencia del deposito ARS que lo respalda.
    /// @param to Destino de los cARS emitidos.
    /// @param amount Monto emitido en unidades de 6 decimales.
    /// @param settlementRef Referencia off-chain (id de liquidacion del PSP, no un dato personal).
    event Issued(address indexed to, uint256 amount, bytes32 indexed settlementRef);

    error ZeroAddress();

    /// @param admin Cuenta que recibe DEFAULT_ADMIN_ROLE, MINTER_ROLE y PAUSER_ROLE.
    constructor(address admin) ERC20("Crypto ARS", "cARS") ERC20Permit("Crypto ARS") {
        if (admin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    /// @inheritdoc ERC20
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /// @notice Emite cARS contra pesos acreditados off-chain.
    /// @param to Destino de la emision.
    /// @param amount Monto en unidades de 6 decimales.
    /// @param settlementRef Referencia de la acreditacion ARS que respalda esta emision.
    function issue(address to, uint256 amount, bytes32 settlementRef) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();

        _mint(to, amount);
        emit Issued(to, amount, settlementRef);
    }

    /// @notice Pausa todas las transferencias, emisiones y quemas.
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Reanuda la operacion normal.
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @dev Resuelve el override compartido entre ERC20 y ERC20Pausable.
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
