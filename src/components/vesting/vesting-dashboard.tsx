'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useVesting } from '@/hooks/useVesting';
import { useMetaMask } from '@/hooks/useMetaMask';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import VestingScheduleCard from './vesting-schedule-card';
import Button from '@/components/ui/button';

export default function VestingDashboard() {
  const { isConnected, account, connect } = useMetaMask();
  const { tokensWithPools } = useTokenFactory();
  const {
    getVestingSchedules,
    getClaimableAmount,
    claimTokens,
    isLoading,
    error,
    lastUpdate,
  } = useVesting();

  const [selectedToken, setSelectedToken] = useState<string>('');
  const [vestingSchedules, setVestingSchedules] = useState<any[]>([]);
  const [totalClaimable, setTotalClaimable] = useState<string>('0');
  const [isClaiming, setIsClaiming] = useState(false);

  // Load vesting schedules when token selected or wallet connected
  useEffect(() => {
    if (selectedToken && account) {
      loadVestingData();
    }
  }, [selectedToken, account, lastUpdate]);

  // Auto-select first token if available
  useEffect(() => {
    if (tokensWithPools.length > 0 && !selectedToken) {
      setSelectedToken(tokensWithPools[0].tokenAddress);
    }
  }, [tokensWithPools]);

  const loadVestingData = async () => {
    if (!selectedToken) return;

    try {
      const schedules = await getVestingSchedules(selectedToken);
      setVestingSchedules(schedules);

      const claimable = await getClaimableAmount(selectedToken);
      setTotalClaimable(claimable);
    } catch (err) {
      console.error('Error loading vesting data:', err);
    }
  };

  const handleClaim = async () => {
    if (!selectedToken) return;

    setIsClaiming(true);
    try {
      const success = await claimTokens(selectedToken);
      if (success) {
        // Reload data after successful claim
        await loadVestingData();
      }
    } catch (err) {
      console.error('Error claiming tokens:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  const formatClaimable = () => {
    const formatted = ethers.utils.formatUnits(totalClaimable, 18);
    const num = parseFloat(formatted);
    if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const hasClaimableTokens = ethers.BigNumber.from(totalClaimable).gt(0);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Connect your wallet to view your vesting schedules
        </p>
        <Button onClick={connect} className="px-6 py-3">
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (tokensWithPools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Tokens Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have any vesting schedules yet. Buy some tokens to start vesting!
        </p>
        <Button href="/retro/listed-tokens" className="px-6 py-3">
          Browse Tokens
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Vesting Schedules
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and claim your vested tokens
        </p>
      </div>

      {/* Token Selector & Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Token
            </label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {tokensWithPools.map((token) => (
                <option key={token.tokenAddress} value={token.tokenAddress}>
                  {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                </option>
              ))}
            </select>
          </div>

          {/* Claimable Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Claimable
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatClaimable()}
            </p>
            <Button
              onClick={handleClaim}
              disabled={!hasClaimableTokens || isClaiming}
              className="w-full"
              size="small"
            >
              {isClaiming ? 'Claiming...' : 'Claim All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Vesting Schedules */}
      {!isLoading && vestingSchedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No vesting schedules found for this token
          </p>
        </div>
      )}

      {!isLoading && vestingSchedules.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vestingSchedules.map((schedule) => (
            <VestingScheduleCard
              key={schedule.scheduleId}
              schedule={schedule}
              tokenSymbol="TOKEN"
              tokenName="Token"
            />
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 About Vesting
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Tokens purchased through bonding curves are automatically vested</li>
          <li>• Early buyers get shorter vesting periods (faster access)</li>
          <li>• You can claim tokens as they vest - no need to wait for full vesting</li>
          <li>• Vesting prevents pump & dumps and aligns long-term interests</li>
        </ul>
      </div>
    </div>
  );
}
