// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @notice Emision de un peso tokenizado contra una acreditacion identificada.
interface IIssuablePeso {
    function issue(address to, uint256 amount, bytes32 settlementRef) external;
}

/// @title Liquidacion de un cobro del posnet entre tres partes
/// @notice El cliente paga en `payToken` (PESOS) y el comercio cobra en
///         `settleToken` (cARS). En el medio esta el liquidity provider: recibe
///         los PESOS del cliente y, respaldado por esos mismos PESOS, se emiten
///         cARS al comercio que genero el cobro.
/// @dev Las dos patas ocurren en la misma transaccion: o se mueven las dos o no
///      se mueve ninguna. El `paymentId` del posnet viaja como referencia de
///      liquidacion del token emitido, asi la emision queda atada al cobro.
///      La paridad es 1:1 y ambos tokens tienen 6 decimales, asi que no hay
///      conversion de escala ni cotizacion. Testnet, sin spread ni fee.
contract ArcPosSettlement is AccessControl, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Token que entrega el cliente.
    IERC20 public immutable payToken;
    /// @notice Token que se emite al comercio. Este contrato debe tener su MINTER_ROLE.
    IIssuablePeso public immutable settleToken;

    /// @notice Cuenta que recibe los PESOS y respalda la emision de cARS.
    address public liquidityProvider;

    /// @notice Cobros ya liquidados, para que un reintento no cobre dos veces.
    mapping(bytes32 paymentId => bool done) public settled;

    /// @param paymentId Identificador del cobro que emitio el posnet.
    /// @param payer Cliente que pago.
    /// @param merchant Comercio que cobro.
    /// @param amount Monto en unidades de 6 decimales, igual en ambas patas.
    /// @param provider Liquidity provider que recibio los PESOS.
    event PaymentSettled(
        bytes32 indexed paymentId, address indexed payer, address indexed merchant, uint256 amount, address provider
    );

    /// @param previous Liquidity provider anterior.
    /// @param current Liquidity provider vigente.
    event LiquidityProviderUpdated(address indexed previous, address indexed current);

    error ZeroAddress();
    error ZeroAmount();
    error ZeroPaymentId();
    error PaymentAlreadySettled(bytes32 paymentId);
    error SameToken();

    /// @param payToken_ Token que paga el cliente (PESOS).
    /// @param settleToken_ Token que se emite al comercio (cARS).
    /// @param admin Puede pausar y cambiar el liquidity provider.
    /// @param liquidityProvider_ Cuenta que recibe los PESOS.
    constructor(IERC20 payToken_, IIssuablePeso settleToken_, address admin, address liquidityProvider_) {
        if (
            address(payToken_) == address(0) || address(settleToken_) == address(0) || admin == address(0)
                || liquidityProvider_ == address(0)
        ) revert ZeroAddress();
        if (address(payToken_) == address(settleToken_)) revert SameToken();

        payToken = payToken_;
        settleToken = settleToken_;
        liquidityProvider = liquidityProvider_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        emit LiquidityProviderUpdated(address(0), liquidityProvider_);
    }

    /// @notice Liquida un cobro. El cliente debe tener allowance de `payToken`
    ///         a favor de este contrato.
    /// @param paymentId Identificador del cobro emitido por el posnet.
    /// @param merchant Destino de los cARS emitidos.
    /// @param amount Monto en unidades de 6 decimales.
    function pay(bytes32 paymentId, address merchant, uint256 amount) external whenNotPaused {
        _settle(paymentId, merchant, amount);
    }

    /// @notice Liquida un cobro firmando la autorizacion, sin `approve` previo.
    /// @dev Si el `permit` ya fue consumido por otra transaccion, se ignora el
    ///      error y se sigue con la allowance existente.
    /// @param paymentId Identificador del cobro emitido por el posnet.
    /// @param merchant Destino de los cARS emitidos.
    /// @param amount Monto en unidades de 6 decimales.
    /// @param deadline Vencimiento de la firma.
    /// @param v Componente de la firma.
    /// @param r Componente de la firma.
    /// @param s Componente de la firma.
    function payWithPermit(
        bytes32 paymentId,
        address merchant,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused {
        try IERC20Permit(address(payToken)).permit(_msgSender(), address(this), amount, deadline, v, r, s) {} catch {}

        _settle(paymentId, merchant, amount);
    }

    /// @notice Cambia el liquidity provider.
    /// @param provider Nueva cuenta que recibe los PESOS.
    function setLiquidityProvider(address provider) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (provider == address(0)) revert ZeroAddress();

        emit LiquidityProviderUpdated(liquidityProvider, provider);
        liquidityProvider = provider;
    }

    /// @notice Corta la liquidacion de nuevos cobros.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Reanuda la liquidacion.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _settle(bytes32 paymentId, address merchant, uint256 amount) private {
        if (paymentId == bytes32(0)) revert ZeroPaymentId();
        if (merchant == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (settled[paymentId]) revert PaymentAlreadySettled(paymentId);

        address provider = liquidityProvider;
        settled[paymentId] = true;

        payToken.safeTransferFrom(_msgSender(), provider, amount);
        settleToken.issue(merchant, amount, paymentId);

        emit PaymentSettled(paymentId, _msgSender(), merchant, amount, provider);
    }
}
