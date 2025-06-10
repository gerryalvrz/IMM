// contracts/TokenFactory.sol
// SPDX-License-Identifier: MIT

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract ERC20Token is ERC20 {
//     constructor(
//         string memory name,
//         string memory symbol,
//         uint256 initialSupply
//     ) ERC20(name, symbol) {
//         // msg.sender here will be the TokenFactory contract
//         _mint(msg.sender, initialSupply);
//     }
// }

// contract TokenFactory {
//     address[] public allTokens;
//     event TokenCreated(address indexed token, address indexed creator);

//     function createToken(
//         string calldata name,
//         string calldata symbol,
//         uint256 initialSupply
//     ) external returns (address) {
//         ERC20Token token = new ERC20Token(name, symbol, initialSupply);
//         allTokens.push(address(token));

//         // Transfer all tokens from factory to creator
//         ERC20(address(token)).transfer(msg.sender, initialSupply);

//         emit TokenCreated(address(token), msg.sender);
//         return address(token);
//     }

//     function getAllTokens() external view returns (address[] memory) {
//         return allTokens;
//     }
// }

pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './BondingCurvePool.sol';

contract ERC20Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract TokenFactory {
    address[] public allTokens;
    mapping(address => address) public tokenToPool;

    event TokenCreated(
        address indexed token,
        address indexed creator,
        address pool
    );

    // contracts/TokenFactory.sol
    function createTokenWithLiquidity(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply,
        uint256 initialLiquidityETH
    ) external payable returns (address) {
        require(msg.value >= initialLiquidityETH, 'Insufficient ETH sent');

        // Create token
        ERC20Token token = new ERC20Token(name, symbol, initialSupply);
        allTokens.push(address(token));

        // Create bonding curve pool
        BondingCurvePool pool = new BondingCurvePool(address(token));
        tokenToPool[address(token)] = address(pool);


        // Transfer ETH to pool and initialize
        (bool success, ) = address(pool).call{value: initialLiquidityETH}(
            abi.encodeWithSignature('initialize(address)', msg.sender)
        );
        require(success, 'ETH transfer failed');

        // Transfer tokens from factory to creator
        token.transfer(address(pool), initialSupply);

        // Refund any excess ETH
        if (msg.value > initialLiquidityETH) {
            payable(msg.sender).transfer(msg.value - initialLiquidityETH);
        }

        emit TokenCreated(address(token), msg.sender, address(pool));
        return address(token);
    }
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function getPoolForToken(address token) external view returns (address) {
        return tokenToPool[token];
    }
}
