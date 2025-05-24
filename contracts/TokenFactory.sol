// contracts/TokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        // msg.sender here will be the TokenFactory contract
        _mint(msg.sender, initialSupply);
    }
}

contract TokenFactory {
    address[] public allTokens;
    event TokenCreated(address indexed token, address indexed creator);

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address) {
        ERC20Token token = new ERC20Token(name, symbol, initialSupply);
        allTokens.push(address(token));
        
        // Transfer all tokens from factory to creator
        ERC20(address(token)).transfer(msg.sender, initialSupply);
        
        emit TokenCreated(address(token), msg.sender);
        return address(token);
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
}