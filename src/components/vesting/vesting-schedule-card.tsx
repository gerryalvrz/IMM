'use client';

import { ethers } from 'ethers';
import { formatTimeRemaining, formatVestingDuration } from '@/hooks/useVesting';

interface VestingScheduleCardProps {
  schedule: {
    scheduleId: number;
    totalAmount: string;
    startTime: number;
    cliffDuration: number;
    vestingDuration: number;
    releasedAmount: string;
    claimableAmount: string;
    vestedAmount: string;
    lockedAmount: string;
    percentVested: number;
    cliffEndTime: number;
    vestingEndTime: number;
    isCliffPassed: boolean;
    isFullyVested: boolean;
    revoked: boolean;
  };
  tokenSymbol?: string;
  tokenName?: string;
}

export default function VestingScheduleCard({
  schedule,
  tokenSymbol = 'TOKEN',
  tokenName = 'Token',
}: VestingScheduleCardProps) {
  const formatAmount = (amount: string) => {
    const formatted = ethers.utils.formatUnits(amount, 18);
    const num = parseFloat(formatted);
    if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getStatusColor = () => {
    if (schedule.revoked) return 'bg-red-500';
    if (schedule.isFullyVested) return 'bg-green-500';
    if (schedule.isCliffPassed) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (schedule.revoked) return 'Revoked';
    if (schedule.isFullyVested) return 'Fully Vested';
    if (schedule.isCliffPassed) return 'Vesting';
    return 'Cliff Period';
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {tokenName} Vesting
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Schedule #{schedule.scheduleId}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {schedule.percentVested.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(schedule.percentVested, 100)}%` }}
          />
        </div>
      </div>

      {/* Amounts Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Total Amount
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatAmount(schedule.totalAmount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tokenSymbol}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">
            Claimable Now
          </p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            {formatAmount(schedule.claimableAmount)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            {tokenSymbol}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            Already Claimed
          </p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {formatAmount(schedule.releasedAmount)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {tokenSymbol}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
            Still Locked
          </p>
          <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
            {formatAmount(schedule.lockedAmount)}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            {tokenSymbol}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Cliff Period:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatVestingDuration(schedule.cliffDuration)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total Vesting:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatVestingDuration(schedule.vestingDuration)}
          </span>
        </div>

        {!schedule.isCliffPassed && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Cliff ends in:
            </span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {formatTimeRemaining(schedule.cliffEndTime)}
            </span>
          </div>
        )}

        {schedule.isCliffPassed && !schedule.isFullyVested && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Fully vests in:
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatTimeRemaining(schedule.vestingEndTime)}
            </span>
          </div>
        )}

        {schedule.isFullyVested && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              ✓ Fully Vested
            </span>
          </div>
        )}
      </div>

      {/* Purchase Date */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Started: {new Date(schedule.startTime * 1000).toLocaleDateString()}{' '}
          {new Date(schedule.startTime * 1000).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
