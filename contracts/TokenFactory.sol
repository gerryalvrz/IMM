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
import '@openzeppelin/contracts/access/Ownable.sol';
import './BondingCurvePool.sol';
import './TokenVesting.sol';

contract ERC20Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract TokenFactory is Ownable {
    address[] public allTokens;
    mapping(address => address) public tokenToPool;
    
    address public vestingContract;
    address public treasury;
    
    uint256 public constant DEFAULT_MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MIN_INITIAL_LIQUIDITY = 0.01 ether; // Minimum initial liquidity

    event TokenCreated(
        address indexed token,
        address indexed creator,
        address pool,
        uint256 maxSupply
    );
    
    event VestingContractDeployed(address indexed vestingContract);
    event TreasurySet(address indexed treasury);

    constructor() Ownable(msg.sender) {
        // Deploy vesting contract
        vestingContract = address(new TokenVesting());
        emit VestingContractDeployed(vestingContract);
    }
    
    /**
     * @dev Set treasury address (only owner)
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        emit TreasurySet(_treasury);
    }

    // contracts/TokenFactory.sol
    function createTokenWithLiquidity(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply,
        uint256 initialLiquidityETH
    ) external payable returns (address) {
        require(msg.value >= initialLiquidityETH, 'Insufficient ETH sent');
        require(initialLiquidityETH >= MIN_INITIAL_LIQUIDITY, 'Initial liquidity too low');
        require(vestingContract != address(0), 'Vesting contract not set');
        require(treasury != address(0), 'Treasury not set');
        require(bytes(name).length > 0, 'Name cannot be empty');
        require(bytes(symbol).length > 0, 'Symbol cannot be empty');

        // Use default max supply (80% of initial supply for bonding curve)
        uint256 maxSupply = (initialSupply * 80) / 100;

        // Create token
        ERC20Token token = new ERC20Token(name, symbol, initialSupply);
        allTokens.push(address(token));

        // Create bonding curve pool with max supply
        BondingCurvePool pool = new BondingCurvePool(address(token), maxSupply);
        tokenToPool[address(token)] = address(pool);
        
        // Set vesting contract and treasury on pool
        pool.setVestingContract(vestingContract);
        pool.setTreasury(treasury);
        
        // Authorize pool to create vesting schedules
        TokenVesting(vestingContract).authorizePool(address(pool), true);

        // Transfer tokens to pool (for bonding curve sales)
        token.transfer(address(pool), maxSupply);
        
        // Transfer remaining tokens to creator (vested separately if needed)
        uint256 creatorAmount = initialSupply - maxSupply;
        if (creatorAmount > 0) {
            token.transfer(msg.sender, creatorAmount);
        }

        // Initialize pool with ETH
        (bool success, ) = address(pool).call{value: initialLiquidityETH}(
            abi.encodeWithSignature('initialize(address)', msg.sender)
        );
        require(success, 'Pool initialization failed');

        // Refund any excess ETH
        if (msg.value > initialLiquidityETH) {
            payable(msg.sender).transfer(msg.value - initialLiquidityETH);
        }

        emit TokenCreated(address(token), msg.sender, address(pool), maxSupply);
        return address(token);
    }
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function getPoolForToken(address token) external view returns (address) {
        return tokenToPool[token];
    }
    
    /**
     * @dev Get vesting contract address
     */
    function getVestingContract() external view returns (address) {
        return vestingContract;
    }
    
    /**
     * @dev Get treasury address
     */
    function getTreasury() external view returns (address) {
        return treasury;
    }
}
