"use client"
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from 'react';
  import { ethers } from 'ethers';
  
  declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
  type MetaMaskContextType = {
    isConnected: boolean;
    account: string | null;
    chainId: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    error: string | null;
    isLoading: boolean;
    provider: ethers.providers.Web3Provider | null;
  };
  
  const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);
  
  export const MetaMaskProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  
    // Check if MetaMask is installed
    const isMetaMaskInstalled = () => {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
    };
  
    // Initialize the provider
    useEffect(() => {
      const initialize = async () => {
        if (!isMetaMaskInstalled()) {
          setError('MetaMask is not installed');
          setIsLoading(false);
          return;
        }
  
        try {
          // Initialize ethers provider
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
  
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
  
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
  
          const chain = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chain);
  
          // Set up event listeners
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
          window.ethereum.on('disconnect', handleDisconnect);
        } catch (err) {
          console.error('Error initializing MetaMask:', err);
          setError('Failed to initialize MetaMask');
        } finally {
          setIsLoading(false);
        }
      };
  
      initialize();
  
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }, []);
  
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has disconnected all accounts
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };
  
    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      // Reload the page to ensure everything is up to date
      window.location.reload();
    };
  
    const handleDisconnect = () => {
      disconnect();
    };
  
    const connect = async () => {
      if (!isMetaMaskInstalled()) {
        setError('MetaMask is not installed');
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        // Initialize ethers provider if not already set
        if (!provider) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
        }
  
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
  
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
  
        const chain = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chain);
      } catch (err) {
        console.error('Error connecting to MetaMask:', err);
        setError('Failed to connect to MetaMask');
        //@ts-ignore
        if (err.code === 4001) {
          // User rejected the request
          setError('Please connect to MetaMask to continue');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    const disconnect = () => {
      setAccount(null);
      setIsConnected(false);
      setChainId(null);
      setProvider(null);
    };
  
    return (
      <MetaMaskContext.Provider
        value={{
          isConnected,
          account,
          chainId,
          connect,
          disconnect,
          error,
          isLoading,
          provider,
        }}
      >
        {children}
      </MetaMaskContext.Provider>
    );
  };
  
  export const useMetaMask = () => {
    const context = useContext(MetaMaskContext);
    if (context === undefined) {
      throw new Error('useMetaMask must be used within a MetaMaskProvider');
    }
    return context;
  };