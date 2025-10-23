'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';
import TokenVestingABI from '../../contracts/abi/TokenVesting.json';

type VestingSchedule = {
  totalAmount: string;
  startTime: number;
  cliffDuration: number;
  vestingDuration: number;
  releasedAmount: string;
  revoked: boolean;
};

type VestingScheduleWithProgress = VestingSchedule & {
  scheduleId: number;
  claimableAmount: string;
  vestedAmount: string;
  lockedAmount: string;
  percentVested: number;
  cliffEndTime: number;
  vestingEndTime: number;
  isCliffPassed: boolean;
  isFullyVested: boolean;
};

type VestingContextType = {
  vestingContract: ethers.Contract | null;
  getVestingSchedules: (tokenAddress: string) => Promise<VestingScheduleWithProgress[]>;
  getClaimableAmount: (tokenAddress: string) => Promise<string>;
  getTotalVestedAmount: (tokenAddress: string) => Promise<string>;
  getLockedAmount: (tokenAddress: string) => Promise<string>;
  claimTokens: (tokenAddress: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
};

const VestingContext = createContext<VestingContextType | undefined>(undefined);

// TokenVesting contract deployed on Alfajores - January 23, 2025
const VESTING_CONTRACT_ADDRESS = '0xa4D430F24601b1484D3103B8a26A90BD8AaF9f07';

export const VestingProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, account, provider } = useMetaMask();
  const [vestingContract, setVestingContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (provider && isConnected && VESTING_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        VESTING_CONTRACT_ADDRESS,
        TokenVestingABI.abi,
        signer
      );
      setVestingContract(contract);
    }
  }, [provider, isConnected]);

  const calculateVestingProgress = (schedule: VestingSchedule, scheduleId: number): VestingScheduleWithProgress => {
    const now = Math.floor(Date.now() / 1000);
    const cliffEndTime = schedule.startTime + schedule.cliffDuration;
    const vestingEndTime = schedule.startTime + schedule.vestingDuration;
    
    const isCliffPassed = now >= cliffEndTime;
    const isFullyVested = now >= vestingEndTime;

    // Calculate vested amount
    let vestedAmount = '0';
    if (isFullyVested) {
      vestedAmount = schedule.totalAmount;
    } else if (isCliffPassed) {
      const timeFromStart = now - schedule.startTime;
      const totalAmount = ethers.BigNumber.from(schedule.totalAmount);
      const vestedBN = totalAmount.mul(timeFromStart).div(schedule.vestingDuration);
      vestedAmount = vestedBN.toString();
    }

    // Calculate claimable amount
    const vestedBN = ethers.BigNumber.from(vestedAmount);
    const releasedBN = ethers.BigNumber.from(schedule.releasedAmount);
    const claimableBN = vestedBN.sub(releasedBN);
    const claimableAmount = claimableBN.toString();

    // Calculate locked amount
    const totalBN = ethers.BigNumber.from(schedule.totalAmount);
    const lockedBN = totalBN.sub(vestedBN);
    const lockedAmount = lockedBN.toString();

    // Calculate percent vested
    const percentVested = totalBN.gt(0)
      ? vestedBN.mul(10000).div(totalBN).toNumber() / 100
      : 0;

    return {
      ...schedule,
      scheduleId,
      claimableAmount,
      vestedAmount,
      lockedAmount,
      percentVested,
      cliffEndTime,
      vestingEndTime,
      isCliffPassed,
      isFullyVested,
    };
  };

  const getVestingSchedules = async (tokenAddress: string): Promise<VestingScheduleWithProgress[]> => {
    if (!vestingContract || !account) {
      throw new Error('Vesting contract or account not available');
    }

    try {
      setIsLoading(true);
      setError(null);

      const schedules = await vestingContract.getVestingSchedules(tokenAddress, account);
      
      const schedulesWithProgress = schedules.map((schedule: any, index: number) => {
        const formattedSchedule: VestingSchedule = {
          totalAmount: schedule.totalAmount.toString(),
          startTime: schedule.startTime.toNumber(),
          cliffDuration: schedule.cliffDuration.toNumber(),
          vestingDuration: schedule.vestingDuration.toNumber(),
          releasedAmount: schedule.releasedAmount.toString(),
          revoked: schedule.revoked,
        };
        return calculateVestingProgress(formattedSchedule, index);
      });

      return schedulesWithProgress;
    } catch (err) {
      console.error('Error fetching vesting schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vesting schedules');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getClaimableAmount = async (tokenAddress: string): Promise<string> => {
    if (!vestingContract || !account) return '0';

    try {
      setIsLoading(true);
      setError(null);

      const amount = await vestingContract.getClaimableAmount(tokenAddress, account);
      return amount.toString();
    } catch (err) {
      console.error('Error fetching claimable amount:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch claimable amount');
      return '0';
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalVestedAmount = async (tokenAddress: string): Promise<string> => {
    if (!vestingContract || !account) return '0';

    try {
      const amount = await vestingContract.getTotalVestedAmount(tokenAddress, account);
      return amount.toString();
    } catch (err) {
      console.error('Error fetching total vested amount:', err);
      return '0';
    }
  };

  const getLockedAmount = async (tokenAddress: string): Promise<string> => {
    if (!vestingContract || !account) return '0';

    try {
      const amount = await vestingContract.getLockedAmount(tokenAddress, account);
      return amount.toString();
    } catch (err) {
      console.error('Error fetching locked amount:', err);
      return '0';
    }
  };

  const claimTokens = async (tokenAddress: string): Promise<boolean> => {
    if (!vestingContract) {
      setError('Vesting contract not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check claimable amount first
      const claimable = await getClaimableAmount(tokenAddress);
      if (ethers.BigNumber.from(claimable).eq(0)) {
        setError('No tokens available to claim');
        return false;
      }

      const tx = await vestingContract.claim(tokenAddress, {
        gasLimit: 300000,
      });
      await tx.wait();

      // Update timestamp to trigger UI refresh
      setLastUpdate(Date.now());

      return true;
    } catch (err) {
      console.error('Error claiming tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VestingContext.Provider
      value={{
        vestingContract,
        getVestingSchedules,
        getClaimableAmount,
        getTotalVestedAmount,
        getLockedAmount,
        claimTokens,
        isLoading,
        error,
        lastUpdate,
      }}
    >
      {children}
    </VestingContext.Provider>
  );
};

export const useVesting = () => {
  const context = useContext(VestingContext);
  if (context === undefined) {
    throw new Error('useVesting must be used within a VestingProvider');
  }
  return context;
};

// Utility functions
export const formatVestingDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  const hours = Math.floor(seconds / 3600);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
};

export const formatTimeRemaining = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  if (timestamp <= now) return 'Completed';
  
  const remaining = timestamp - now;
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getVestingTierInfo = (percentSold: number) => {
  if (percentSold <= 20) {
    return {
      tier: 'Early Buyer',
      cliff: '7 days',
      vesting: '90 days',
      color: 'green',
      description: 'Best vesting terms for early supporters',
    };
  } else if (percentSold <= 50) {
    return {
      tier: 'Mid Buyer',
      cliff: '14 days',
      vesting: '180 days',
      color: 'blue',
      description: 'Standard vesting terms',
    };
  } else if (percentSold <= 80) {
    return {
      tier: 'Late Buyer',
      cliff: '30 days',
      vesting: '270 days',
      color: 'yellow',
      description: 'Extended vesting for late supporters',
    };
  } else {
    return {
      tier: 'Final Buyer',
      cliff: '60 days',
      vesting: '365 days',
      color: 'red',
      description: 'Maximum vesting period',
    };
  }
};
