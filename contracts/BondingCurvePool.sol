// contracts/BondingCurvePool.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BondingCurvePool is ReentrancyGuard {
    address public token;
    address public factory;
    
    uint256 public reserveBalance;
    uint256 public tokenSupply;
    
    uint256 public constant CURVE_EXPONENT = 2;
    uint256 public constant INITIAL_PRICE = 0.0001 ether;
    
    bool public initialized;

    event Initialized(address indexed creator, uint256 ethAmount);
    event Bought(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event Sold(address indexed seller, uint256 ethAmount, uint256 tokenAmount);

    constructor(address _token) {
        token = _token;
        factory = msg.sender;
    }
    
    // contracts/BondingCurvePool.sol
    function initialize(address creator) external payable {
        require(msg.sender == factory, 'Only factory can initialize');
        require(!initialized, 'Already initialized');
        require(msg.value > 0, 'Must provide initial liquidity');

        reserveBalance = msg.value;
        initialized = true;

        emit Initialized(creator, msg.value);
    }

    // Add receive function to accept ETH
    receive() external payable {}
    
    // Calculate price based on current supply
    function currentPrice() public view returns (uint256) {
        if (tokenSupply == 0) return INITIAL_PRICE;
        return INITIAL_PRICE * (tokenSupply ** CURVE_EXPONENT) / (1e18 ** (CURVE_EXPONENT - 1));
    }
    
    // Calculate tokens received for ETH sent
    function calculatePurchaseReturn(uint256 ethAmount) public view returns (uint256) {
        if (tokenSupply == 0) {
            return sqrt(ethAmount * 1e36 / INITIAL_PRICE);
        }
        
        uint256 newReserve = reserveBalance + ethAmount;
        uint256 newSupply = sqrt(newReserve * 1e36 / INITIAL_PRICE);
        return newSupply - tokenSupply;
    }
    
    // Calculate ETH received for tokens sent
    function calculateSaleReturn(uint256 tokenAmount) public view returns (uint256) {
        require(tokenAmount <= tokenSupply, "Not enough tokens in pool");
        
        if (tokenSupply == 0) return 0;
        
        uint256 newSupply = tokenSupply - tokenAmount;
        uint256 newReserve = (newSupply ** 2) * INITIAL_PRICE / 1e36;
        return reserveBalance - newReserve;
    }
    
    // Buy tokens with ETH
    function buy() external payable nonReentrant {
        uint256 tokenAmount = calculatePurchaseReturn(msg.value);
        require(tokenAmount > 0, "Invalid purchase amount");
        
        // Update pool balances
        reserveBalance += msg.value;
        tokenSupply += tokenAmount;
        
        // Transfer tokens to buyer
        require(ERC20(token).transfer(msg.sender, tokenAmount), "Transfer failed");
        
        emit Bought(msg.sender, msg.value, tokenAmount);
    }
    
    // Sell tokens for ETH
    function sell(uint256 tokenAmount) external nonReentrant {
        uint256 ethAmount = calculateSaleReturn(tokenAmount);
        require(ethAmount > 0, "Invalid sale amount");
        
        // Update pool balances
        reserveBalance -= ethAmount;
        tokenSupply -= tokenAmount;
        
        // Transfer ETH to seller
        (bool success, ) = address(this).call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        // Transfer tokens from seller to pool
        require(ERC20(token).transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");
        
        emit Sold(msg.sender, ethAmount, tokenAmount);
    }
    
    // Square root function for quadratic curve
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}