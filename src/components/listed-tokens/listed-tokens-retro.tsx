'use client';

import { useState, useEffect } from 'react';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import InputLabel from '@/components/ui/input-label';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import cn from '@/utils/cn';
import { useBondingCurve } from '@/hooks/useTokenFactory';
import { useMetaMask } from '@/hooks/useMetaMask';

// Add this utility function at the top of your file
const createBlockExplorerLink = (address: any, type = 'address') => {
    return `https://celo-alfajores.blockscout.com/${type}/${address}`;
};

export default function TokenMarketplace() {
    const { isConnected, account, connect } = useMetaMask();
    const {
        tokens,
        tokensWithPools,
        selectedToken,
        selectToken,
        buyTokens,
        sellTokens,
        calculateBuyReturn,
        calculateSellReturn,
        getTokenPrice,
        refreshTokens,
        isLoading,
        error
    } = useBondingCurve();

    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('');
    const [estimatedReturn, setEstimatedReturn] = useState('');
    const [currentPrice, setCurrentPrice] = useState('0');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load price when selected token changes
    useEffect(() => {
        const loadPrice = async () => {
            if (selectedToken) {
                const price = await getTokenPrice();
                setCurrentPrice(price);
            }
        };
        loadPrice();
    }, [selectedToken, getTokenPrice]);

    const handleCalculateReturn = async () => {
        if (!amount || isNaN(Number(amount))) return;

        try {
            if (activeTab === 'buy') {
                const returnAmount = await calculateBuyReturn(Number(amount));
                setEstimatedReturn(returnAmount);
            } else {
                const returnAmount = await calculateSellReturn(Number(amount));
                setEstimatedReturn(returnAmount);
            }
        } catch (err) {
            console.error('Error calculating return:', err);
            setEstimatedReturn('0');
        }
    };

    const handleSubmit = async () => {
        if (!isConnected) {
            await connect();
            return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return;
        }

        try {
            if (activeTab === 'buy') {
                await buyTokens(Number(amount));
            } else {
                await sellTokens(Number(amount));
            }
            // Refresh data after successful transaction
            await refreshData();
        } catch (err) {
            console.error('Transaction failed:', err);
        }
    };

    const refreshData = async () => {
        try {
            setIsRefreshing(true);
            await refreshTokens();
            if (selectedToken) {
                const price = await getTokenPrice();
                setCurrentPrice(price);
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="mx-auto w-full pt-8 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
            <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-2xl">
                Token Marketplace
            </h2>

            {error && (
                <div className="my-4 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Token List */}
                <div className="md:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Available Tokens
                        </h3>
                        <button
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {tokensWithPools.length === 0 && (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No tokens found
                            </div>
                        )}


                        {tokensWithPools.map((token) => (
                            <div
                                key={token.tokenAddress}
                                onClick={() => selectToken(token.tokenAddress)}
                                className={cn(
                                    'cursor-pointer rounded-lg border p-4 transition-colors',
                                    selectedToken === token.tokenAddress
                                        ? 'border-gray-900 bg-gray-100 dark:border-gray-600 dark:bg-gray-700'
                                        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">
                                            <a
                                                href={createBlockExplorerLink(token.tokenAddress)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()} // Prevent triggering the parent div's onClick
                                                className="hover:underline"
                                            >
                                                {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                                            </a>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Pool: <a
                                                href={createBlockExplorerLink(token.poolAddress)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="hover:underline"
                                            >
                                                {token.poolAddress.slice(0, 6)}...{token.poolAddress.slice(-4)}
                                            </a>
                                        </div>
                                    </div>
                                    {selectedToken === token.tokenAddress && (
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Token Details */}
                <div className="md:col-span-2">
                    {selectedToken ? (
                        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">
                                    <a
                                        href={createBlockExplorerLink(selectedToken)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {selectedToken.slice(0, 6)}...{selectedToken.slice(-4)}
                                    </a>
                                </h3>
                                <div className="text-lg font-bold">
                                    {Number(currentPrice).toFixed(8)} ETH
                                </div>
                            </div>
                            {/* Buy/Sell Toggle */}
                            <div className="mb-6 flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                                <button
                                    onClick={() => setActiveTab('buy')}
                                    className={cn(
                                        'flex-1 rounded-md py-2 text-sm font-medium',
                                        activeTab === 'buy'
                                            ? 'bg-white shadow dark:bg-gray-700'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                                    )}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setActiveTab('sell')}
                                    className={cn(
                                        'flex-1 rounded-md py-2 text-sm font-medium',
                                        activeTab === 'sell'
                                            ? 'bg-white shadow dark:bg-gray-700'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                                    )}
                                >
                                    Sell
                                </button>
                            </div>

                            {/* Amount Input */}
                            <div className="mb-4">
                                <InputLabel
                                    title={activeTab === 'buy' ? 'ETH Amount' : 'Token Amount'}
                                    important
                                />
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.00000001"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            // Debounce this in a real app
                                            setTimeout(handleCalculateReturn, 300);
                                        }}
                                        inputClassName="pr-24"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                                        {activeTab === 'buy' ? 'ETH' : 'Tokens'}
                                    </div>
                                </div>
                            </div>

                            {/* Estimated Return */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        You will receive:
                                    </span>
                                    <span className="font-medium">
                                        {estimatedReturn || '0'} {activeTab === 'buy' ? 'Tokens' : 'ETH'}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                shape="rounded"
                                size="large"
                                className="w-full"
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                            >
                                {activeTab === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}
                            </Button>

                            {!isConnected && (
                                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Connect your wallet to trade
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                Select a token to view trading options
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}