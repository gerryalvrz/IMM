'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';
import TokenFactoryABI from '../../contracts/abi/TokenFactory.json';
import BondingCurvePoolABI from '../../contracts/abi/BondingCurvePool.json';


// Maintain original type for backward compatibility
type TokenFactoryContextType = {
  createTokenWithLiquidity: (
    name: string, 
    symbol: string, 
    initialSupply: number,
    initialLiquidityETH: number
  ) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
  tokens: string[];
};

// New extended type with bonding curve functionality
type BondingCurveContextType = TokenFactoryContextType & {
  // Bonding Curve Methods
  buyTokens: (ethAmount: number) => Promise<boolean>;
  sellTokens: (tokenAmount: number) => Promise<boolean>;
  calculateBuyReturn: (ethAmount: number) => Promise<string>;
  calculateSellReturn: (tokenAmount: number) => Promise<string>;
  getTokenPrice: () => Promise<string>;
  
  // Extended state
  tokensWithPools: Array<{ tokenAddress: string; poolAddress: string }>;
  selectedToken: string | null;
  selectToken: (tokenAddress: string) => void;
  refreshTokens: () => Promise<void>;
};

const TokenFactoryContext = createContext<TokenFactoryContextType | undefined>(undefined);
const BondingCurveContext = createContext<BondingCurveContextType | undefined>(undefined);

const TOKEN_FACTORY_ADDRESS = "0x1e341B712AF9C6Bd7dcf1CA8F6DB7934D344F6dc";

export const TokenFactoryProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, account, provider } = useMetaMask();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokensWithPools, setTokensWithPools] = useState<Array<{ tokenAddress: string; poolAddress: string }>>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider && isConnected) {
      const signer = provider.getSigner();
      console.log("get singer",signer)
      const contract = new ethers.Contract(
        TOKEN_FACTORY_ADDRESS,
        TokenFactoryABI.abi,
        signer
      );
      setFactoryContract(contract);
      loadTokens(contract);
    }
  }, [provider, isConnected]);

  const loadTokens = async (contract: ethers.Contract) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tokenAddresses = await contract.getAllTokens();
      const tokensWithPoolsData = [];
      
      for (const tokenAddress of tokenAddresses) {
        const poolAddress = await contract.getPoolForToken(tokenAddress);
        if (poolAddress !== ethers.constants.AddressZero) {
          tokensWithPoolsData.push({
            tokenAddress,
            poolAddress
          });
        }
      }
      
      setTokens(tokenAddresses); // Maintain original tokens array for backward compatibility
      setTokensWithPools(tokensWithPoolsData);
      
      // If there are tokens but none selected, select the first one
      if (tokensWithPoolsData.length > 0 && !selectedToken) {
        setSelectedToken(tokensWithPoolsData[0].tokenAddress);
      }
    } catch (err) {
      console.error('Error loading tokens:', err);
      setError('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const selectToken = (tokenAddress: string) => {
    if (tokensWithPools.some(t => t.tokenAddress === tokenAddress)) {
      setSelectedToken(tokenAddress);
    }
  };

  const refreshTokens = async () => {
    if (factoryContract) {
      await loadTokens(factoryContract);
    }
  };

  // Original function maintained exactly for backward compatibility
  const createTokenWithLiquidity = async (
    name: string, 
    symbol: string, 
    initialSupply: number,
    initialLiquidityETH: number
  ): Promise<string | null> => {
    if (!factoryContract || !provider) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      const parsedSupply = ethers.utils.parseUnits(initialSupply.toString(), 18);
      const parsedEth = ethers.utils.parseEther(initialLiquidityETH.toString());

      const tx = await factoryContract.createTokenWithLiquidity(
        name,
        symbol,
        parsedSupply,
        parsedEth,
        { value: parsedEth }
      );
  
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'TokenCreated');
      if (!event) {
        throw new Error('Token creation event not found');
      }
  
      const tokenAddress = event.args.token;
      const poolAddress = event.args.pool;
      
      setTokens(prev => [...prev, tokenAddress]);
      setTokensWithPools(prev => [...prev, { tokenAddress, poolAddress }]);
      setSelectedToken(tokenAddress);

      window.location.href = "/retro/listed-tokens"

  
      return tokenAddress;
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Failed to create token');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Bonding Curve Pool Methods
  const getPoolContract = () => {
    if (!provider || !selectedToken) return null;
    const pool = tokensWithPools.find(t => t.tokenAddress === selectedToken);
    if (!pool) return null;
    
    const signer = provider.getSigner();
    return new ethers.Contract(
      pool.poolAddress,
      BondingCurvePoolABI.abi,
      signer
    );
  };

  const buyTokens = async (ethAmount: number): Promise<boolean> => {
    if (!selectedToken || !provider) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const poolContract = getPoolContract();
      if (!poolContract) throw new Error('Pool contract not initialized');
      
      const parsedEth = ethers.utils.parseEther(ethAmount.toString());
      const tx = await poolContract.buy({ value: parsedEth });
      await tx.wait();
      
      return true;
    } catch (err) {
      console.error('Error buying tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to buy tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sellTokens = async (tokenAmount: number): Promise<boolean> => {
    if (!selectedToken || !provider) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const poolContract = getPoolContract();
      if (!poolContract) throw new Error('Pool contract not initialized');
      
      // First approve the pool to spend tokens
      const tokenContract = new ethers.Contract(
        selectedToken,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        provider.getSigner()
      );
      
      const parsedAmount = ethers.utils.parseUnits(tokenAmount.toString(), 18);
      await tokenContract.approve(poolContract.address, parsedAmount);
      
      // Then sell the tokens
      const tx = await poolContract.sell(parsedAmount);
      await tx.wait();
      
      return true;
    } catch (err) {
      console.error('Error selling tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to sell tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBuyReturn = async (ethAmount: number): Promise<string> => {
    if (!selectedToken || !provider) return '0';
    
    try {
      const poolContract = getPoolContract();
      if (!poolContract) return '0';
      
      const parsedEth = ethers.utils.parseEther(ethAmount.toString());
      const tokens = await poolContract.calculatePurchaseReturn(parsedEth);
      return ethers.utils.formatUnits(tokens, 18);
    } catch (err) {
      console.error('Error calculating buy return:', err);
      return '0';
    }
  };

  const calculateSellReturn = async (tokenAmount: number): Promise<string> => {
    if (!selectedToken || !provider) return '0';
    
    try {
      const poolContract = getPoolContract();
      if (!poolContract) return '0';
      
      const parsedAmount = ethers.utils.parseUnits(tokenAmount.toString(), 18);
      const eth = await poolContract.calculateSaleReturn(parsedAmount);
      return ethers.utils.formatEther(eth);
    } catch (err) {
      console.error('Error calculating sell return:', err);
      return '0';
    }
  };

  const getTokenPrice = async (): Promise<string> => {
    if (!selectedToken || !provider) return '0';
    
    try {
      const poolContract = getPoolContract();
      if (!poolContract) return '0';
      
      const price = await poolContract.currentPrice();
      return ethers.utils.formatEther(price);
    } catch (err) {
      console.error('Error getting token price:', err);
      return '0';
    }
  };

  // Original context value for backward compatibility
  const tokenFactoryContextValue: TokenFactoryContextType = {
    createTokenWithLiquidity,
    isLoading,
    error,
    tokens
  };

  // Extended context value with bonding curve functionality
  const bondingCurveContextValue: BondingCurveContextType = {
    ...tokenFactoryContextValue,
    buyTokens,
    sellTokens,
    calculateBuyReturn,
    calculateSellReturn,
    getTokenPrice,
    tokensWithPools,
    selectedToken,
    selectToken,
    refreshTokens
  };

  return (
    <TokenFactoryContext.Provider value={tokenFactoryContextValue}>
      <BondingCurveContext.Provider value={bondingCurveContextValue}>
        {children}
      </BondingCurveContext.Provider>
    </TokenFactoryContext.Provider>
  );
};

// Maintain original hook for backward compatibility
export const useTokenFactory = () => {
  const context = useContext(TokenFactoryContext);
  if (context === undefined) {
    throw new Error('useTokenFactory must be used within a TokenFactoryProvider');
  }
  return context;
};

// New hook for bonding curve functionality
export const useBondingCurve = () => {
  const context = useContext(BondingCurveContext);
  if (context === undefined) {
    throw new Error('useBondingCurve must be used within a TokenFactoryProvider');
  }
  return context;
};