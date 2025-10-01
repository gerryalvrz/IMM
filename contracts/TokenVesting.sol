// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenVesting
 * @dev Vesting contract for bonding curve token purchases
 * Supports cliff period and linear vesting with early buyer bonuses
 */
contract TokenVesting is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct VestingSchedule {
        uint256 totalAmount;        // Total tokens to be vested
        uint256 startTime;          // Start timestamp
        uint256 cliffDuration;      // Cliff period in seconds
        uint256 vestingDuration;    // Total vesting duration in seconds
        uint256 releasedAmount;     // Amount already released
        bool revoked;               // Whether vesting was revoked
    }

    // Token address => Beneficiary => Array of vesting schedules
    mapping(address => mapping(address => VestingSchedule[])) private vestingSchedules;
    
    // Track which contracts are authorized to create vesting schedules
    mapping(address => bool) public authorizedPools;

    // Events
    event VestingScheduleCreated(
        address indexed token,
        address indexed beneficiary,
        uint256 scheduleId,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration
    );
    
    event TokensReleased(
        address indexed token,
        address indexed beneficiary,
        uint256 amount
    );
    
    event VestingRevoked(
        address indexed token,
        address indexed beneficiary,
        uint256 scheduleId
    );

    event PoolAuthorized(address indexed pool, bool authorized);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Authorize a bonding curve pool to create vesting schedules
     */
    function authorizePool(address pool, bool authorized) external onlyOwner {
        authorizedPools[pool] = authorized;
        emit PoolAuthorized(pool, authorized);
    }

    /**
     * @dev Create a new vesting schedule
     * Can only be called by authorized bonding curve pools
     */
    function createVestingSchedule(
        address token,
        address beneficiary,
        uint256 amount,
        uint256 cliffDuration,
        uint256 vestingDuration
    ) external returns (uint256) {
        require(authorizedPools[msg.sender], "Not authorized");
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(vestingDuration > 0, "Duration must be > 0");
        require(cliffDuration <= vestingDuration, "Cliff too long");

        // Transfer tokens from pool to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Create vesting schedule
        VestingSchedule memory schedule = VestingSchedule({
            totalAmount: amount,
            startTime: block.timestamp,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            releasedAmount: 0,
            revoked: false
        });

        vestingSchedules[token][beneficiary].push(schedule);
        uint256 scheduleId = vestingSchedules[token][beneficiary].length - 1;

        emit VestingScheduleCreated(
            token,
            beneficiary,
            scheduleId,
            amount,
            block.timestamp,
            cliffDuration,
            vestingDuration
        );

        return scheduleId;
    }

    /**
     * @dev Calculate vested amount for a specific schedule
     */
    function _calculateVestedAmount(VestingSchedule memory schedule) 
        private 
        view 
        returns (uint256) 
    {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }

        if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
            return schedule.totalAmount;
        }

        uint256 timeFromStart = block.timestamp - schedule.startTime;
        uint256 vestedAmount = (schedule.totalAmount * timeFromStart) / schedule.vestingDuration;
        
        return vestedAmount;
    }

    /**
     * @dev Get total claimable amount across all schedules for a beneficiary
     */
    function getClaimableAmount(address token, address beneficiary) 
        public 
        view 
        returns (uint256) 
    {
        VestingSchedule[] storage schedules = vestingSchedules[token][beneficiary];
        uint256 claimable = 0;

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                uint256 vested = _calculateVestedAmount(schedules[i]);
                claimable += vested - schedules[i].releasedAmount;
            }
        }

        return claimable;
    }

    /**
     * @dev Get total vested amount (including already claimed)
     */
    function getTotalVestedAmount(address token, address beneficiary) 
        public 
        view 
        returns (uint256) 
    {
        VestingSchedule[] storage schedules = vestingSchedules[token][beneficiary];
        uint256 totalVested = 0;

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                totalVested += _calculateVestedAmount(schedules[i]);
            }
        }

        return totalVested;
    }

    /**
     * @dev Get total locked amount (not yet vested)
     */
    function getLockedAmount(address token, address beneficiary) 
        public 
        view 
        returns (uint256) 
    {
        VestingSchedule[] storage schedules = vestingSchedules[token][beneficiary];
        uint256 totalLocked = 0;

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                uint256 vested = _calculateVestedAmount(schedules[i]);
                totalLocked += schedules[i].totalAmount - vested;
            }
        }

        return totalLocked;
    }

    /**
     * @dev Get all vesting schedules for a beneficiary
     */
    function getVestingSchedules(address token, address beneficiary) 
        external 
        view 
        returns (VestingSchedule[] memory) 
    {
        return vestingSchedules[token][beneficiary];
    }

    /**
     * @dev Get specific vesting schedule details
     */
    function getVestingSchedule(
        address token, 
        address beneficiary, 
        uint256 scheduleId
    ) 
        external 
        view 
        returns (VestingSchedule memory) 
    {
        require(scheduleId < vestingSchedules[token][beneficiary].length, "Invalid schedule ID");
        return vestingSchedules[token][beneficiary][scheduleId];
    }

    /**
     * @dev Claim all vested tokens
     */
    function claim(address token) external nonReentrant {
        uint256 claimableAmount = getClaimableAmount(token, msg.sender);
        require(claimableAmount > 0, "No tokens to claim");

        // Update released amounts for all schedules
        VestingSchedule[] storage schedules = vestingSchedules[token][msg.sender];
        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                uint256 vested = _calculateVestedAmount(schedules[i]);
                uint256 releasable = vested - schedules[i].releasedAmount;
                schedules[i].releasedAmount += releasable;
            }
        }

        // Transfer tokens to beneficiary
        IERC20(token).safeTransfer(msg.sender, claimableAmount);

        emit TokensReleased(token, msg.sender, claimableAmount);
    }

    /**
     * @dev Calculate vesting parameters based on purchase timing
     * Early buyers get shorter vesting periods
     * @param currentSupply Current token supply sold
     * @param maxSupply Maximum supply that can be sold on bonding curve
     * @return cliffDuration Cliff period in seconds
     * @return vestingDuration Total vesting duration in seconds
     */
    function calculateVestingParams(
        uint256 currentSupply,
        uint256 maxSupply
    ) 
        public 
        pure 
        returns (uint256 cliffDuration, uint256 vestingDuration) 
    {
        require(maxSupply > 0, "Max supply must be > 0");
        require(currentSupply <= maxSupply, "Current exceeds max");

        // Calculate percentage of supply sold (in basis points, 10000 = 100%)
        uint256 percentSold = (currentSupply * 10000) / maxSupply;

        // Early buyers (0-20% sold): 7 day cliff, 90 day vest
        if (percentSold <= 2000) {
            return (7 days, 90 days);
        }
        // Mid buyers (20-50% sold): 14 day cliff, 180 day vest
        else if (percentSold <= 5000) {
            return (14 days, 180 days);
        }
        // Late buyers (50-80% sold): 30 day cliff, 270 day vest
        else if (percentSold <= 8000) {
            return (30 days, 270 days);
        }
        // Final buyers (80-100% sold): 60 day cliff, 365 day vest
        else {
            return (60 days, 365 days);
        }
    }

    /**
     * @dev Emergency function to revoke vesting (only owner)
     * Returns unvested tokens to the pool
     */
    function revokeVesting(
        address token,
        address beneficiary,
        uint256 scheduleId,
        address poolAddress
    ) external onlyOwner {
        require(scheduleId < vestingSchedules[token][beneficiary].length, "Invalid schedule ID");
        
        VestingSchedule storage schedule = vestingSchedules[token][beneficiary][scheduleId];
        require(!schedule.revoked, "Already revoked");

        uint256 vested = _calculateVestedAmount(schedule);
        uint256 refundAmount = schedule.totalAmount - vested;

        schedule.revoked = true;

        if (refundAmount > 0) {
            IERC20(token).safeTransfer(poolAddress, refundAmount);
        }

        emit VestingRevoked(token, beneficiary, scheduleId);
    }

    /**
     * @dev Get number of vesting schedules for a beneficiary
     */
    function getVestingScheduleCount(address token, address beneficiary) 
        external 
        view 
        returns (uint256) 
    {
        return vestingSchedules[token][beneficiary].length;
    }
}
