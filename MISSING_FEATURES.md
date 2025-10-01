# Missing Features for Pump.Fun-Like Regenerative Finance Platform

## Current State Analysis

The project currently has:
- ✅ Basic bonding curve implementation (quadratic curve)
- ✅ Token creation factory
- ✅ Buy functionality through bonding curve
- ✅ Simple sell functionality (unrestricted)
- ✅ Frontend for token creation and trading

## Critical Missing Features for Pump.Fun + Vesting Model

### 1. **Token Vesting System** (CRITICAL)

**Problem**: Current implementation allows immediate selling after purchase, which defeats the regenerative finance model where buyers should be committed long-term.

**Required Implementation**:

#### Smart Contract: `TokenVesting.sol`
- Vesting schedules per buyer with cliff and linear unlock periods
- Cliff period: No tokens available for X days/months
- Linear vesting: Tokens unlock gradually over time
- Support multiple vesting schedules per user (from different purchases)
- Claimable tokens calculation based on time elapsed
- Vesting curve should mirror bonding curve (e.g., early buyers vest faster)

#### Key Functions Needed:
```solidity
- createVestingSchedule(address beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration)
- getVestedAmount(address beneficiary) returns (uint256)
- claim() // Claim vested tokens
- getClaimableAmount(address beneficiary) returns (uint256)
- getVestingSchedules(address beneficiary) returns (VestingSchedule[])
```

#### Parameters to Define:
- Cliff period: e.g., 30 days minimum
- Vesting duration: e.g., 180 days linear unlock
- Early buyer bonus: Earlier purchases vest faster (e.g., first 10% of supply vests in 90 days, last 10% vests in 365 days)

---

### 2. **Modified Bonding Curve Pool with Vesting Integration**

**Changes to `BondingCurvePool.sol`**:

#### A. Buy Function Modifications
- Instead of transferring tokens directly, create vesting schedule
- Tokens sent to VestingContract, not buyer wallet
- Emit event with vesting schedule details
- Track total vested vs liquid supply

#### B. Prevent Premature Selling
- Remove or restrict the current `sell()` function during bonding phase
- Only allow selling of CLAIMED and VESTED tokens
- Verify tokens are in buyer's wallet (not in vesting contract)

#### C. New State Variables Needed
```solidity
address public vestingContract;
bool public graduated; // Has bonding curve graduated to DEX?
uint256 public graduationMarketCap; // Target market cap for graduation
uint256 public graduationSupply; // Supply threshold for graduation
```

---

### 3. **Bonding Curve Graduation / Migration to DEX** (Pump.Fun Core Feature)

**Problem**: No mechanism to "graduate" successful tokens from bonding curve to a traditional DEX (like Unibeam on Celo).

**Required Implementation**:

#### Graduation Triggers
- Market cap reaches threshold (e.g., $69,000 equivalent in CELO)
- OR Total supply sold reaches threshold (e.g., 85% of max supply)
- OR Time-based graduation (e.g., 90 days after launch)

#### Migration Process
1. Lock bonding curve (no more buys through curve)
2. Create liquidity pool on Unibeam/Uniswap V2 fork
3. Transfer accumulated CELO + remaining tokens to DEX pool
4. Enable token holders to claim vested tokens
5. All future trading happens on DEX

#### New Contract: `GraduationManager.sol`
```solidity
- checkGraduationConditions() returns (bool)
- graduateToDEX() // Migrate liquidity to DEX
- setDEXRouter(address router)
- createDEXPool(address token, uint256 tokenAmount, uint256 celoAmount)
```

---

### 4. **Fee Structure & Treasury Management**

**Problem**: No fee collection mechanism for platform sustainability and regenerative impact funding.

**Required Fees**:

#### A. Trading Fees
- Buy fee: 1-2% on each purchase (sent to treasury/impact pool)
- Sell fee: 2-3% on vested token sales (discourage selling)
- Fee distribution:
  - 50% to treasury for operations
  - 30% to regenerative impact pool
  - 20% to token creator as incentive

#### B. Token Creation Fee
- Flat fee to create token (e.g., 0.1 CELO)
- Prevents spam token creation
- Funds platform development

#### C. Graduation Fee
- Small fee when token graduates to DEX (e.g., 1% of liquidity)
- Incentivizes quality projects

---

### 5. **Regenerative Finance Specific Features**

#### A. Impact Metrics Tracking
**New Contract: `ImpactRegistry.sol`**
- Link tokens to real-world regenerative projects
- Store impact metrics (carbon credits, trees planted, etc.)
- Verifiable impact reporting
- Oracle integration for off-chain impact data

#### B. Impact Pool Distribution
- Automated distribution of trading fees to verified regenerative projects
- Voting mechanism for token holders to direct impact funds
- Transparent impact reporting dashboard

#### C. Token Metadata for Regenerative Projects
```solidity
struct ProjectMetadata {
    string projectName;
    string impactCategory; // reforestation, ocean cleanup, renewable energy, etc.
    string location;
    string impactGoal;
    address impactWallet; // Where impact funds are sent
    string[] verificationDocuments; // IPFS hashes
}
```

---

### 6. **Anti-Manipulation & Security Features**

**Currently Missing**:

#### A. Anti-Bot Protection
- Max buy per transaction limit
- Cooldown period between buys from same address
- Whitelist period for early supporters

#### B. Anti-Rug Pull Mechanisms
- Creator tokens also vested (can't dump immediately)
- Liquidity lock after DEX graduation
- Multi-sig for critical functions

#### C. Price Manipulation Prevention
- Max slippage protection
- Time-weighted average price (TWAP) oracle
- MEV protection strategies

---

### 7. **Frontend Features**

**Missing UI Components**:

#### A. Vesting Dashboard
- [ ] Display user's vesting schedules per token
- [ ] Show claimable vs locked amounts
- [ ] Vesting timeline visualization
- [ ] One-click claim button
- [ ] Vesting progress bars

#### B. Token Discovery & Filtering
- [ ] Sort by time to graduation
- [ ] Filter by impact category
- [ ] Show market cap & progress to graduation
- [ ] Display impact metrics
- [ ] Trending tokens (by volume, growth)

#### C. Graduation Tracking
- [ ] Graduation countdown/progress bar
- [ ] Market cap meter
- [ ] Supply sold percentage
- [ ] Notify users when token graduates

#### D. Impact Reporting
- [ ] Real-time impact metrics
- [ ] Project updates feed
- [ ] Impact fund allocation visualization
- [ ] Verified impact badges

---

### 8. **Token Economics Refinement**

**Current Issues**:

#### A. Supply Distribution
- Define max supply clearly (e.g., 1 billion tokens)
- Reserve allocation:
  - 80% bonding curve
  - 10% creator (vested 2 years)
  - 5% team (vested 3 years)
  - 5% impact pool (immediate liquid for impact projects)

#### B. Bonding Curve Parameters
- Current curve may be too simple
- Consider sigmoid curve for more stable pricing
- Define price ceiling before graduation
- Anti-whale mechanisms (progressive tax on large buys)

---

### 9. **Social Features (Pump.Fun Signature)**

**Missing Community Elements**:

#### A. Comments & Social Feed
- [ ] Comments on token pages
- [ ] Holder chat/discussion board
- [ ] Project updates from creators
- [ ] Impact milestone celebrations

#### B. Reputation System
- [ ] Creator reputation scores
- [ ] Verified impact badges
- [ ] Community trust ratings
- [ ] Historical project success tracking

#### C. Gamification
- [ ] Badges for early supporters
- [ ] Leaderboard for impact contributors
- [ ] Achievement system
- [ ] Referral rewards

---

### 10. **Analytics & Monitoring**

**Missing Infrastructure**:

#### A. On-Chain Analytics
- [ ] Real-time price charts (not just current price)
- [ ] Volume tracking (24h, 7d, all-time)
- [ ] Holder distribution charts
- [ ] Vesting unlock calendar (system-wide)

#### B. Impact Analytics
- [ ] Total impact generated across all tokens
- [ ] Impact per category breakdown
- [ ] Carbon credits retired
- [ ] Transparent fund flows

#### C. Platform Health Metrics
- [ ] Total value locked (TVL)
- [ ] Number of graduated tokens
- [ ] Average graduation time
- [ ] Rug pull rate (should be 0% with vesting)

---

## Implementation Priority for Alfajores Testnet

### Phase 1: Core Vesting (Week 1-2)
1. ✅ Create `TokenVesting.sol` contract
2. ✅ Integrate vesting with `BondingCurvePool.sol`
3. ✅ Add claim functionality
4. ✅ Update frontend to show vesting schedules
5. ✅ Deploy to Alfajores and test

### Phase 2: Graduation Mechanism (Week 3)
1. Create `GraduationManager.sol`
2. Integrate with DEX router (Uniswap V2 fork on Celo)
3. Test graduation process
4. Add graduation UI components

### Phase 3: Regenerative Features (Week 4)
1. Create `ImpactRegistry.sol`
2. Add project metadata on token creation
3. Implement fee distribution to impact pool
4. Build impact dashboard

### Phase 4: Security & Anti-Manipulation (Week 5)
1. Add anti-bot measures
2. Implement max buy limits
3. Add cooldown periods
4. Security audit prep

### Phase 5: Social & Polish (Week 6+)
1. Add commenting system
2. Build analytics dashboard
3. Implement reputation system
4. Launch marketing site

---

## Immediate Action Items

1. **Define Vesting Parameters**
   - Cliff: 7-30 days?
   - Vesting duration: 90-365 days?
   - Early buyer advantage: Yes/No?

2. **Define Graduation Thresholds**
   - Market cap target: $69,000 USD equivalent?
   - Supply threshold: 85%?
   - Time limit: 90 days?

3. **Choose DEX for Migration**
   - Unibeam (Uniswap V2 on Celo)
   - Or custom DEX?

4. **Impact Categories**
   - Define initial categories (reforestation, ocean cleanup, renewable energy, etc.)
   - Create verification framework

5. **Fee Structure Decision**
   - Buy fee: 1%?
   - Sell fee: 2%?
   - Creation fee: 0.1 CELO?

---

## Technical Debt & Improvements

### Current Contract Issues
1. **BondingCurvePool.sol**:
   - `sell()` function sends ETH incorrectly (line 97)
   - Should use `payable(msg.sender).transfer()` or `.call{value:}`
   - Missing events for all state changes
   - No access control on critical functions

2. **TokenFactory.sol**:
   - No validation on token parameters
   - Missing minimum liquidity requirements
   - No creator verification

3. **Security Concerns**:
   - No reentrancy guards on all payable functions
   - Missing pause mechanism for emergencies
   - No upgrade path for contracts

---

## Resources Needed

### Smart Contract Libraries
- OpenZeppelin Contracts (already included) ✅
- Uniswap V2 Core/Periphery interfaces
- Chainlink oracles (for price feeds)

### Frontend Libraries
- Recharts or Lightweight Charts for vesting curves
- Web3Modal improvements for better wallet UX
- IPFS integration for impact documents

### Testing Infrastructure
- Hardhat test suite expansion
- Gas optimization testing
- Load testing for bonding curve under high volume

### External Integrations
- Celo DEX router addresses
- Impact verification APIs
- IPFS pinning service
- Subgraph for analytics

---

## Success Metrics

When complete, the platform should support:
- ✅ Token creation with regenerative project metadata
- ✅ Bonding curve purchases with automatic vesting
- ✅ Vested token claiming after time periods
- ✅ Automatic graduation to DEX at milestones
- ✅ Fee distribution to impact pools
- ✅ Zero premature sell-offs (enforced by vesting)
- ✅ Transparent impact tracking
- ✅ Community engagement features
- ✅ Full audit-ready security posture
