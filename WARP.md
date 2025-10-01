# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Web3 NFT Crypto Dashboard application called "Criptic" (branded as "ImpactMarketMaker") built with Next.js 14, React, TypeScript, and Tailwind CSS. The project integrates smart contracts for token creation with bonding curve liquidity pools on the Celo blockchain.

## Essential Commands

### Development
```bash
pnpm dev          # Start development server at http://localhost:3000
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint linter
pnpm clean        # Remove node_modules, .next, out, and cache
```

### Smart Contract Development
```bash
npx hardhat compile                                # Compile Solidity contracts
npx hardhat run script/deploy.js --network alfajores  # Deploy to Celo Alfajores testnet
```

### Pre-commit Hooks
The project uses Husky to automatically run `pnpm run lint` and `pnpm run build` before commits.

## Required Environment Variables

Create a `.env.local` file with:
- `NEXT_PUBLIC_CRYPTO_PROJECT_ID` - Required for Web3Modal/WalletConnect integration. Get from [WalletConnect Docs](https://docs.walletconnect.com/web3modal/nextjs/about)

## Architecture

### Smart Contracts (Solidity)

Located in `/contracts`:

- **TokenFactory.sol**: Factory contract for creating ERC20 tokens with associated bonding curve pools
  - Creates ERC20Token instances
  - Deploys BondingCurvePool for each token with vesting
  - Maintains mapping of tokens to pools
  - Auto-deploys TokenVesting contract
  - **Contract address (Alfajores)**: `0xb64Ef5a4aB2Fe8D8d655DA5658b8305414883a92`
  - Explorer: https://alfajores.celoscan.io/address/0xb64Ef5a4aB2Fe8D8d655DA5658b8305414883a92

- **TokenVesting.sol**: Vesting contract for bonding curve purchases
  - Manages vesting schedules with cliff and linear unlock
  - Early buyer advantage (shorter vesting for early supporters)
  - Claimable token tracking
  - **Contract address (Alfajores)**: `0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07`
  - Explorer: https://alfajores.celoscan.io/address/0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07

- **BondingCurvePool.sol**: Implements a quadratic bonding curve for token liquidity
  - Buy/sell mechanism with automatic price discovery
  - Uses square root calculations for curve pricing
  - Initial price: 0.0001 ETH
  - Includes ReentrancyGuard protection

- **Contract ABIs**: Located in `/contracts/abi/` as JSON files, imported by frontend hooks

### Blockchain Integration

- **Network**: Celo Alfajores testnet (Chain ID: 44787)
- **RPC URL**: `https://alfajores-forno.celo-testnet.org/`
- **Hardhat config**: See `hardhat.config.js` for deployment settings

### Frontend Architecture (Next.js App Router)

**Directory Structure**:
- `/src/app/(modern)` - Default modern layout routes
- `/src/app/retro` - Retro theme variant
- `/src/app/classic` - Classic theme variant  
- `/src/app/minimal` - Minimal theme variant
- `/src/app/shared` - Shared providers and utilities
- `/src/components` - Reusable React components
- `/src/hooks` - Custom React hooks
- `/src/config` - Configuration files including routes
- `/src/utils` - Utility functions

**Key Components**:
- `create-token/` - Token creation UI
- `listed-tokens/` - Display created tokens with pools
- `trading-bot/` - Trading bot interfaces
- `nft/` - NFT-related components
- `ui/` - Reusable UI primitives

### Context Providers (Root Layout)

The application wraps components in this provider hierarchy (see `src/app/layout.tsx`):

1. **WalletProvider** - Web3Modal/Wagmi wallet connection
2. **MetaMaskProvider** - MetaMask-specific wallet integration
3. **TokenFactoryProvider** - Smart contract interaction layer
4. **QueryProvider** - TanStack Query for data fetching
5. **ThemeProvider** - next-themes for dark/light mode

### Custom Hooks

**`useMetaMask` (`src/hooks/useMetaMask.tsx`)**:
- Manages MetaMask connection state
- Provides ethers.js Web3Provider instance
- Handles account and chain change events
- Exposes: `{ isConnected, account, chainId, connect, disconnect, provider }`

**`useTokenFactory` (`src/hooks/useTokenFactory.tsx`)**:
- Interfaces with TokenFactory and BondingCurvePool contracts
- Methods:
  - `createTokenWithLiquidity()` - Deploy new token with bonding curve
  - `buyTokens()` - Purchase tokens via bonding curve
  - `sellTokens()` - Sell tokens via bonding curve
  - `calculateBuyReturn()` / `calculateSellReturn()` - Price calculations
  - `refreshTokens()` - Reload token list
- State: `{ tokens, tokensWithPools, selectedToken, isLoading, error }`

### State Management

- **Jotai**: Atomic state management for global state
- **React Hook Form + Yup**: Form validation
- **TanStack Query**: Server state and caching

### Routing

Routes are centralized in `src/config/routes.ts`. Key routes:
- `/retro/create-token` - Token creation interface
- `/retro/listed-tokens` - View all created tokens with pools
- `/swap`, `/liquidity` - DEX functionality
- `/trading-bot/*` - Various trading bot strategies

### Styling

- **Tailwind CSS** with custom config (`tailwind.config.js`)
- **Prettier** with `prettier-plugin-tailwindcss` for class sorting
- Path alias: `@/*` maps to `./src/*`
- Theme variants: light/dark mode via next-themes

### Key Dependencies

- **Web3**: `wagmi` v2.5+, `viem` v2.9+, `@web3modal/wagmi` v4.1+, `ethers` v5.8 (for smart contracts)
- **UI**: `@headlessui/react`, `framer-motion`, `recharts`, `swiper`
- **Dev Tools**: ESLint (Next.js config), Prettier, Husky for git hooks

## Development Guidelines

### TypeScript

- Strict mode enabled in `tsconfig.json`
- Use path aliases: `@/components`, `@/hooks`, `@/utils`, etc.
- Type declarations: `react-table-config.d.ts`, `additional.d.ts`

### Linting & Formatting

- ESLint extends `next/core-web-vitals`
- Key rules: warn on duplicate imports, error on unknown React props
- Prettier formats with single quotes and Tailwind class sorting
- Lint-staged runs on pre-commit for changed files only

### Smart Contract Development

- Solidity version: 0.8.20
- OpenZeppelin contracts for ERC20 and security
- Always test on Alfajores testnet before mainnet
- ABI files must be manually updated after compilation in `/contracts/abi/`

### Component Patterns

- Use functional components with hooks
- Leverage existing UI primitives from `/src/components/ui`
- Follow existing theme variants (modern/retro/classic/minimal) when adding features
- Utilize the drawer and modal systems (`drawer-views/`, `modal-views/`)

### Working with Bonding Curves

When modifying token trading logic:
1. Understand the quadratic curve formula: `price = INITIAL_PRICE * (supply^2)`
2. Test calculations with `calculatePurchaseReturn()` / `calculateSaleReturn()` before transactions
3. Always include gas limits for buy/sell transactions (e.g., `gasLimit: 300000`)
4. Handle contract errors gracefully in the UI

### Multi-Layout System

The app supports multiple visual themes. When adding new pages:
- Place in appropriate theme directory (`retro/`, `classic/`, `minimal/`, or `(modern)/`)
- Update `src/config/routes.ts` with new route paths
- Ensure components respect the theme context
