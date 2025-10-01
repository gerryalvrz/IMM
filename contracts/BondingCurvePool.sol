// contracts/BondingCurvePool.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TokenVesting.sol";

contract BondingCurvePool is ReentrancyGuard {
    address public token;
    address public factory;
    address public vestingContract;
    address public creator;
    
    uint256 public reserveBalance;
    uint256 public tokenSupply;
    uint256 public maxSupply; // Maximum supply that can be sold through bonding curve
    
    uint256 public constant CURVE_EXPONENT = 2;
    uint256 public constant INITIAL_PRICE = 0.0001 ether;
    
    // Graduation parameters
    bool public graduated;
    uint256 public constant GRADUATION_MARKET_CAP = 69000 ether; // $69k in CELO equivalent
    uint256 public constant GRADUATION_SUPPLY_PERCENT = 85; // 85% of max supply
    
    // Fee parameters (in basis points, 100 = 1%)
    uint256 public constant BUY_FEE_BP = 100; // 1%
    uint256 public constant SELL_FEE_BP = 200; // 2%
    address public treasury;
    
    bool public initialized;

    event Initialized(address indexed creator, uint256 ethAmount);
    event Bought(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 vestingScheduleId);
    event Sold(address indexed seller, uint256 ethAmount, uint256 tokenAmount);
    event Graduated(uint256 finalMarketCap, uint256 finalSupply, uint256 timestamp);
    event VestingContractSet(address indexed vestingContract);
    event TreasurySet(address indexed treasury);

    constructor(address _token, uint256 _maxSupply) {
        token = _token;
        factory = msg.sender;
        maxSupply = _maxSupply;
    }
    
    /**
     * @dev Set the vesting contract address (called by factory)
     */
    function setVestingContract(address _vestingContract) external {
        require(msg.sender == factory, "Only factory");
        require(vestingContract == address(0), "Already set");
        vestingContract = _vestingContract;
        emit VestingContractSet(_vestingContract);
    }
    
    /**
     * @dev Set the treasury address (called by factory)
     */
    function setTreasury(address _treasury) external {
        require(msg.sender == factory, "Only factory");
        require(treasury == address(0), "Already set");
        treasury = _treasury;
        emit TreasurySet(_treasury);
    }
    
    // contracts/BondingCurvePool.sol
    function initialize(address _creator) external payable {
        require(msg.sender == factory, 'Only factory can initialize');
        require(!initialized, 'Already initialized');
        require(msg.value > 0, 'Must provide initial liquidity');
        require(vestingContract != address(0), 'Vesting contract not set');
        require(treasury != address(0), 'Treasury not set');

        creator = _creator;
        reserveBalance = msg.value;
        initialized = true;

        emit Initialized(_creator, msg.value);
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
    
    // Buy tokens with ETH (creates vesting schedule)
    function buy() external payable nonReentrant {
        require(!graduated, "Pool has graduated to DEX");
        require(tokenSupply < maxSupply, "Max supply reached");
        
        // Calculate fees
        uint256 fee = (msg.value * BUY_FEE_BP) / 10000;
        uint256 ethAfterFee = msg.value - fee;
        
        uint256 tokenAmount = calculatePurchaseReturn(ethAfterFee);
        require(tokenAmount > 0, "Invalid purchase amount");
        
        // Check if purchase would exceed max supply
        if (tokenSupply + tokenAmount > maxSupply) {
            tokenAmount = maxSupply - tokenSupply;
        }
        
        // Update pool balances
        reserveBalance += ethAfterFee;
        tokenSupply += tokenAmount;
        
        // Send fee to treasury
        if (fee > 0) {
            payable(treasury).transfer(fee);
        }
        
        // Get vesting parameters based on current supply
        TokenVesting vesting = TokenVesting(vestingContract);
        (uint256 cliffDuration, uint256 vestingDuration) = vesting.calculateVestingParams(
            tokenSupply,
            maxSupply
        );
        
        // Approve vesting contract to take tokens
        IERC20(token).approve(vestingContract, tokenAmount);
        
        // Create vesting schedule
        uint256 scheduleId = vesting.createVestingSchedule(
            token,
            msg.sender,
            tokenAmount,
            cliffDuration,
            vestingDuration
        );
        
        emit Bought(msg.sender, msg.value, tokenAmount, scheduleId);
        
        // Check graduation conditions
        _checkGraduation();
    }
    
    // Sell tokens for ETH (only for graduated pools or vested tokens)
    function sell(uint256 tokenAmount) external nonReentrant {
        require(graduated, "Can only sell after graduation or claim vested tokens");
        
        uint256 ethAmount = calculateSaleReturn(tokenAmount);
        require(ethAmount > 0, "Invalid sale amount");
        
        // Calculate fee
        uint256 fee = (ethAmount * SELL_FEE_BP) / 10000;
        uint256 ethAfterFee = ethAmount - fee;
        
        // Update pool balances
        reserveBalance -= ethAmount;
        tokenSupply -= tokenAmount;
        
        // Transfer tokens from seller to pool
        require(IERC20(token).transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");
        
        // Send ETH to seller
        payable(msg.sender).transfer(ethAfterFee);
        
        // Send fee to treasury
        if (fee > 0) {
            payable(treasury).transfer(fee);
        }
        
        emit Sold(msg.sender, ethAfterFee, tokenAmount);
    }
    
    /**
     * @dev Check if graduation conditions are met and graduate if so
     */
    function _checkGraduation() internal {
        if (graduated) return;
        
        // Calculate current market cap
        uint256 currentMarketCap = reserveBalance;
        
        // Check graduation conditions
        bool marketCapReached = currentMarketCap >= GRADUATION_MARKET_CAP;
        bool supplyReached = (tokenSupply * 100) >= (maxSupply * GRADUATION_SUPPLY_PERCENT);
        
        if (marketCapReached || supplyReached) {
            graduated = true;
            emit Graduated(currentMarketCap, tokenSupply, block.timestamp);
        }
    }
    
    /**
     * @dev Get current market cap
     */
    function getMarketCap() external view returns (uint256) {
        return reserveBalance;
    }
    
    /**
     * @dev Get progress to graduation (in basis points, 10000 = 100%)
     */
    function getGraduationProgress() external view returns (uint256 marketCapProgress, uint256 supplyProgress) {
        marketCapProgress = (reserveBalance * 10000) / GRADUATION_MARKET_CAP;
        supplyProgress = (tokenSupply * 10000) / ((maxSupply * GRADUATION_SUPPLY_PERCENT) / 100);
    }
    
    /**
     * @dev Check if can graduate
     */
    function canGraduate() external view returns (bool) {
        if (graduated) return false;
        
        uint256 currentMarketCap = reserveBalance;
        bool marketCapReached = currentMarketCap >= GRADUATION_MARKET_CAP;
        bool supplyReached = (tokenSupply * 100) >= (maxSupply * GRADUATION_SUPPLY_PERCENT);
        
        return marketCapReached || supplyReached;
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
