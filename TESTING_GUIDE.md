# Testing Guide - Regenerative Finance Platform with Vesting

## Quick Start Testing

### Prerequisites
- ✅ Contracts deployed to Alfajores
- ✅ MetaMask installed and configured
- ✅ Alfajores CELO in wallet (get from https://faucet.celo.org/alfajores)
- ✅ Frontend running (`pnpm dev`)

---

## Test Flow 1: Complete User Journey

### Step 1: Setup MetaMask for Alfajores
```
Network Name: Celo Alfajores Testnet
RPC URL: https://alfajores-forno.celo-testnet.org/
Chain ID: 44787
Currency Symbol: CELO
Block Explorer: https://alfajores.celoscan.io
```

### Step 2: Get Test CELO
1. Visit: https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Request CELO (you'll need ~1 CELO for testing)
4. Wait for confirmation

### Step 3: Start Frontend
```bash
cd /Users/cesarangulo/Documents/celo/IMM
pnpm dev
```
Navigate to: http://localhost:3000

### Step 4: Create a Test Token

#### Go to Token Creation Page
- Navigate to: http://localhost:3000/retro/create-token
- OR use menu: ERC20 > Create Token

#### Fill in Token Details
```
Token Name: TestRefi Token
Token Symbol: TREFI
Initial Supply: 1000000000 (1 billion)
Initial Liquidity: 0.1 (CELO)
```

#### Expected Behavior
1. ✅ MetaMask prompts for transaction approval
2. ✅ Transaction includes 0.1 CELO
3. ✅ Deployment takes ~30-60 seconds
4. ✅ Success message with token address
5. ✅ Redirects to listed tokens page

#### Verify on Celoscan
- Find transaction: https://alfajores.celoscan.io
- Check:
  - TokenFactory interaction
  - Token contract created
  - BondingCurvePool created
  - Vesting schedules authorized

### Step 5: Buy Tokens (Create Vesting Schedule)

#### Go to Listed Tokens
- Navigate to: http://localhost:3000/retro/listed-tokens
- Find your test token

#### Make Purchase
```
Amount: 0.01 CELO
Expected: ~100 tokens (depends on bonding curve)
```

#### Expected Behavior
1. ✅ MetaMask prompts for transaction
2. ✅ 0.01 CELO charged + gas
3. ✅ 1% fee deducted (0.0001 CELO to treasury)
4. ✅ Vesting schedule created (not visible tokens in wallet yet!)
5. ✅ Transaction success

#### Verify Vesting Schedule Created
**Via Celoscan**:
1. Go to: https://alfajores.celoscan.io/address/0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07
2. Click "Contract" tab
3. Click "Read Contract"
4. Call `getVestingScheduleCount` with:
   - token: [your token address]
   - beneficiary: [your wallet address]
5. Should return: 1

**Expected Values**:
- Vesting tier: Early Buyer (0-20% sold)
- Cliff: 7 days
- Vesting: 90 days
- Status: Cliff Period

### Step 6: View Vesting Dashboard

#### Navigate to Vesting Page
- Go to: http://localhost:3000/retro/vesting
- OR use menu: ERC20 > My Vesting

#### Expected Display
1. ✅ Token selector showing your token
2. ✅ Total claimable: 0 (in cliff period)
3. ✅ Vesting schedule card showing:
   - Total Amount: ~100 tokens
   - Claimable Now: 0
   - Already Claimed: 0
   - Still Locked: ~100 tokens
   - Progress: 0%
   - Cliff ends in: ~7 days
   - Status: Cliff Period

#### UI Elements to Verify
- [ ] Progress bar shows 0%
- [ ] Status badge shows "Cliff Period" (yellow)
- [ ] "Claim All" button is disabled
- [ ] Countdown to cliff end is visible
- [ ] Purchase date/time displayed

### Step 7: Wait for Cliff Period (Testing Challenge!)

**Problem**: Cliff is 7 days - too long for testing!

**Options**:

#### Option A: Use Hardhat Local Fork (Recommended for testing)
```bash
# Start local fork with time manipulation
npx hardhat node --fork https://alfajores-forno.celo-testnet.org/

# In new terminal, fast forward time
npx hardhat console --network localhost
> await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]) // 7 days
> await ethers.provider.send("evm_mine")
```

#### Option B: Wait Actual Time
- Come back in 7 days
- Check vesting dashboard
- Should show claimable amount

#### Option C: Deploy Testnet Version (Future)
- Modify TokenVesting.sol for testnet
- Change vesting periods to hours:
  - Cliff: 1 hour instead of 7 days
  - Vesting: 24 hours instead of 90 days
- Redeploy to different address

### Step 8: Claim Vested Tokens (After Cliff)

#### After Cliff Period Passes
1. Go to: http://localhost:3000/retro/vesting
2. Refresh page
3. Check claimable amount

#### Expected Behavior (During Vesting)
- Progress bar shows partial progress
- Claimable amount increases over time
- Can claim multiple times as tokens vest

#### Claim Tokens
1. Click "Claim All" button
2. Confirm MetaMask transaction
3. Wait for confirmation

#### Expected Results
1. ✅ Tokens transferred to wallet
2. ✅ "Already Claimed" amount updates
3. ✅ "Claimable Now" resets to 0 (if partial claim)
4. ✅ Progress bar updates
5. ✅ Transaction visible on Celoscan

### Step 9: Check Tokens in Wallet

#### Add Token to MetaMask
1. Open MetaMask
2. Click "Import tokens"
3. Enter token contract address
4. Token symbol should auto-fill
5. Confirm

#### Verify Balance
- Should see claimed tokens
- Balance matches "Already Claimed" amount

---

## Test Flow 2: Graduation Testing

### Step 1: Create Token for Graduation Test
- Use higher initial liquidity (e.g., 69 CELO) to test market cap graduation
- OR use very low max supply to reach 85% quickly

### Step 2: Buy Enough to Trigger Graduation

#### Market Cap Route
- Need 69,000 CELO in reserve
- Impractical for testnet

#### Supply Route (Easier)
- Buy until 85% of max supply sold
- For 1B token supply (800M on curve):
  - Need to buy 680M tokens
  - Requires significant CELO

**Testnet Workaround**:
- Modify `GRADUATION_MARKET_CAP` in contract to 1 CELO for testing
- Redeploy to test address

### Step 3: Verify Graduation
1. Check pool contract on Celoscan
2. Call `graduated()` - should return true
3. Call `canGraduate()` - should return false (already graduated)

### Step 4: Test Selling (After Graduation)
1. Go to token page
2. Try to sell tokens
3. Should be enabled (vs. disabled before)
4. 2% fee should be deducted

---

## Test Flow 3: Multiple Purchases (Vesting Tiers)

### Objective
Test that later buyers get longer vesting periods

### Step 1: First Purchase (Early Buyer)
- Buy with 0.01 CELO
- Should get: 7 day cliff, 90 day vesting

### Step 2: Buy More Supply (20-50% Range)
- Buy enough to push supply to 30%
- Make another purchase
- Should get: 14 day cliff, 180 day vesting

### Step 3: Check Multiple Schedules
- Go to vesting dashboard
- Should see 2 separate vesting schedules
- Each with different durations
- Total claimable combines both

### Step 4: Verify Tier Calculations
**Via Contract**:
```solidity
// Call on TokenVesting contract
calculateVestingParams(currentSupply, maxSupply)
// Returns: (cliffDuration, vestingDuration)
```

**Expected Returns**:
| Supply Sold | Cliff | Vesting |
|-------------|-------|---------|
| 0-20% | 7 days | 90 days |
| 20-50% | 14 days | 180 days |
| 50-80% | 30 days | 270 days |
| 80-100% | 60 days | 365 days |

---

## Test Flow 4: Edge Cases & Error Handling

### Test 1: Buy with Insufficient CELO
- Try to buy with 0 CELO
- Expected: Transaction reverts with "Invalid purchase amount"

### Test 2: Claim Before Cliff
- Try to claim immediately after purchase
- Expected: "No tokens to claim" error

### Test 3: Claim When Nothing Claimable
- Claim all tokens
- Try to claim again immediately
- Expected: "No tokens to claim" error

### Test 4: Buy After Max Supply Reached
- Buy until max supply reached
- Try to buy more
- Expected: "Max supply reached" error

### Test 5: Sell Before Graduation
- Try to sell tokens before pool graduates
- Expected: "Can only sell after graduation" error

### Test 6: Buy After Graduation
- Pool graduates
- Try to buy more tokens
- Expected: "Pool has graduated to DEX" error

---

## Verification Checklist

### Smart Contract Verification

#### TokenFactory (0xb64Ef5a4aB2Fe8D8d655DA5658b8305414883a92)
- [ ] Can create tokens
- [ ] Auto-deploys vesting contract
- [ ] Sets up pool correctly
- [ ] Authorizes pool in vesting contract
- [ ] Transfers tokens to pool
- [ ] Returns correct token address

#### TokenVesting (0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07)
- [ ] Creates vesting schedules
- [ ] Calculates vesting params correctly
- [ ] Tracks multiple schedules per user
- [ ] Calculates claimable amount correctly
- [ ] Transfers tokens on claim
- [ ] Updates released amounts
- [ ] Emits events correctly

#### BondingCurvePool
- [ ] Accepts ETH for token purchase
- [ ] Calculates token amount correctly (bonding curve)
- [ ] Deducts 1% buy fee
- [ ] Sends fee to treasury
- [ ] Creates vesting schedule (not direct transfer)
- [ ] Tracks supply correctly
- [ ] Checks graduation conditions
- [ ] Disables buying after graduation
- [ ] Enables selling after graduation
- [ ] Deducts 2% sell fee

### Frontend Verification

#### Vesting Dashboard
- [ ] Connects wallet correctly
- [ ] Loads token list
- [ ] Displays vesting schedules
- [ ] Shows correct amounts
- [ ] Calculates progress correctly
- [ ] Formats durations properly
- [ ] Displays countdowns
- [ ] Updates after claims
- [ ] Shows loading states
- [ ] Handles errors gracefully

#### Token Creation
- [ ] Form validation works
- [ ] Creates token successfully
- [ ] Shows transaction status
- [ ] Redirects after success

#### Token List
- [ ] Shows created tokens
- [ ] Displays pool addresses
- [ ] Buy button works
- [ ] Shows transaction status

---

## Common Issues & Solutions

### Issue: "Vesting contract or account not available"
**Solution**: 
- Check MetaMask is connected
- Verify on Alfajores network
- Refresh page

### Issue: No vesting schedules showing
**Solution**:
- Verify you bought tokens (not just created)
- Check correct token selected
- Verify transaction confirmed on Celoscan

### Issue: "No tokens to claim"
**Solution**:
- Check if cliff period has passed
- Verify vesting has started
- Check claimable amount on contract directly

### Issue: Claim button disabled
**Solution**:
- No claimable tokens yet (cliff or fully claimed)
- Check progress on vesting card

### Issue: Transaction fails
**Solution**:
- Check gas limit (try 300,000)
- Verify CELO balance for gas
- Check contract hasn't been paused

---

## Performance Testing

### Load Testing
1. Create 10 tokens
2. Buy from each
3. Check vesting dashboard performance
4. Verify gas costs scale reasonably

### Stress Testing
1. Create many vesting schedules
2. Claim from multiple schedules at once
3. Monitor gas usage
4. Check UI responsiveness

---

## Security Testing (Pre-Audit)

### Access Control
- [ ] Only authorized pools can create vesting schedules
- [ ] Only owner can revoke vesting
- [ ] Only factory can initialize pools
- [ ] Only owner can set treasury

### Reentrancy
- [ ] All external calls protected
- [ ] State updated before transfers
- [ ] ReentrancyGuard on sensitive functions

### Integer Overflow/Underflow
- [ ] All calculations use SafeMath (built into Solidity 0.8+)
- [ ] No unchecked blocks without reason

### Front-Running
- [ ] Understand MEV implications
- [ ] Consider max slippage parameters

---

## Automated Testing (Future)

### Unit Tests Needed
```javascript
describe("TokenVesting", function() {
  it("Should create vesting schedule correctly")
  it("Should calculate vested amount correctly")
  it("Should handle cliff period")
  it("Should allow claiming after cliff")
  it("Should handle multiple schedules")
  it("Should calculate vesting tiers correctly")
})

describe("BondingCurvePool", function() {
  it("Should calculate purchase return correctly")
  it("Should create vesting on buy")
  it("Should deduct fees correctly")
  it("Should graduate at market cap")
  it("Should graduate at supply threshold")
  it("Should disable buy after graduation")
  it("Should enable sell after graduation")
})
```

---

## Test Data Template

### Token 1: Early Buyer Test
```json
{
  "name": "EarlyTest",
  "symbol": "EARLY",
  "supply": "1000000000000000000000000000",
  "liquidity": "100000000000000000",
  "buyer": "0x...",
  "purchaseAmount": "10000000000000000",
  "expectedVesting": {
    "cliff": 604800,
    "duration": 7776000
  }
}
```

### Token 2: Late Buyer Test
```json
{
  "name": "LateTest",
  "symbol": "LATE",
  "supply": "1000000000000000000000000000",
  "liquidity": "100000000000000000",
  "buyer": "0x...",
  "purchaseAmount": "1000000000000000000",
  "expectedVesting": {
    "cliff": 5184000,
    "duration": 31536000
  }
}
```

---

## Success Criteria

### Functional Requirements
- ✅ Users can create tokens with vesting
- ✅ Purchases create vesting schedules automatically
- ✅ Vesting tiers work based on purchase timing
- ✅ Users can view all vesting schedules
- ✅ Users can claim vested tokens
- ✅ Pools graduate at thresholds
- ✅ Selling disabled until graduation

### Non-Functional Requirements
- ✅ Gas costs reasonable (<$5 equivalent)
- ✅ UI responsive (<2s load time)
- ✅ Error messages clear and helpful
- ✅ Transactions confirm in <60s
- ✅ Dashboard updates automatically

---

## Next Steps After Testing

1. **Document Issues** - Log any bugs found
2. **Create Hardhat Tests** - Automate testing
3. **Security Audit** - Professional review
4. **Testnet Adjustments** - Shorter vesting for easier testing
5. **Mainnet Preparation** - Multi-sig, timelock, etc.

---

## Quick Reference

### Contract Addresses (Alfajores)
- TokenFactory: `0xb64Ef5a4aB2Fe8D8d655DA5658b8305414883a92`
- TokenVesting: `0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07`
- Treasury: `0x9f42Caf52783EF12d8174d33c281a850b8eA58aD`

### Useful Links
- Celoscan: https://alfajores.celoscan.io
- Faucet: https://faucet.celo.org/alfajores
- Celo Docs: https://docs.celo.org

### Test Accounts Needed
- Minimum 1 account with ~5 CELO
- For multi-user testing: 3+ accounts with ~2 CELO each
