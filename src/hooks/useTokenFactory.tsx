// hooks/useTokenFactory.ts
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

// Import your TokenFactory ABI
import TokenFactoryABI from '../../contracts/abi/TokenFactory.json';

type TokenFactoryContextType = {
  createToken: (
    name: string, 
    symbol: string, 
    initialSupply: number
  ) => Promise<ethers.Contract | null>;
  getAllTokens: () => Promise<string[]>;
  isLoading: boolean;
  error: string | null;
  tokens: string[];
};

const TokenFactoryContext = createContext<TokenFactoryContextType | undefined>(undefined);

// Your deployed TokenFactory contract address
const TOKEN_FACTORY_ADDRESS = "0x1c50eCae677b8607Bc38818dc03dbA3aa593ce8F"; // Replace with your actual deployed address

export const TokenFactoryProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, account, connect, provider } = useMetaMask();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider && isConnected) {
      const signer = provider.getSigner();
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
      const tokenAddresses = await contract.getAllTokens();
      setTokens(tokenAddresses);
    } catch (err) {
      console.error('Error loading tokens:', err);
      setError('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const createToken = async (
    name: string, 
    symbol: string, 
    initialSupply: number
  ): Promise<ethers.Contract | null> => {
    console.log("hey",factoryContract,isConnected)
    if (!factoryContract || !isConnected) {
      await connect();
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const signer = provider!.getSigner();
      const tx = await factoryContract.createToken(
        name,
        symbol,
        ethers.utils.parseUnits(initialSupply.toString(), 18)
      );
      
      const receipt = await tx.wait();
      
      // Find the TokenCreated event to get the new token address
      const event = receipt.events?.find((e: any) => e.event === 'TokenCreated');
      if (!event) {
        throw new Error('Token creation event not found');
      }
      
      const tokenAddress = event.args.token;
      
      // Add the new token to the list
      setTokens(prev => [...prev, tokenAddress]);

      // Return an instance of the ERC20 token contract
      const ERC20ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount)",
        "function approve(address spender, uint256 amount)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function transferFrom(address from, address to, uint256 amount)"
      ];
      
      return new ethers.Contract(tokenAddress, ERC20ABI, signer);
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Failed to create token');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTokens = async (): Promise<string[]> => {
    if (!factoryContract) return tokens;
    try {
      return await factoryContract.getAllTokens();
    } catch (err) {
      console.error('Error getting tokens:', err);
      return tokens;
    }
  };

  return (
    <TokenFactoryContext.Provider
      value={{
        createToken,
        getAllTokens,
        isLoading,
        error,
        tokens
      }}
    >
      {children}
    </TokenFactoryContext.Provider>
  );
};

export const useTokenFactory = () => {
  const context = useContext(TokenFactoryContext);
  if (context === undefined) {
    throw new Error('useTokenFactory must be used within a TokenFactoryProvider');
  }
  return context;
};