/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import InputLabel from '@/components/ui/input-label';
import ToggleBar from '@/components/ui/toggle-bar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import cn from '@/utils/cn';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import { useMetaMask } from '@/hooks/useMetaMask';

const EVMNetworks = [
  {
    id: 1,
    name: 'Ethereum',
    value: 'ethereum',
    icon: <Ethereum />,
  },
];

const TokenStandards = [
  {
    id: 1,
    name: 'ERC-20',
    value: 'erc20',
    description: 'Standard fungible token',
  },
  {
    id: 2,
    name: 'ERC-20 with Mint/Burn',
    value: 'erc20Mintable',
    description: 'ERC-20 with owner minting and burning capabilities',
  },
];

export default function CreateTokenRetro() {
  const { isConnected, account, connect } = useMetaMask();
  const { createTokenWithLiquidity, isLoading, error: tokenFactoryError } = useTokenFactory();
  const [network, setNetwork] = useState(EVMNetworks[0]);
  const [tokenStandard, setTokenStandard] = useState(TokenStandards[0]);
  const [mintable, setMintable] = useState(false);
  const [burnable, setBurnable] = useState(false);
  const [pausable, setPausable] = useState(false);
  const [permit, setPermit] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('1000000');
  const [intialBuy,setInitialBuy] = useState("100");
  const [formError, setFormError] = useState('');

  const handleDeployToken = async () => {
    console.log("in deploy",isConnected)
    if (!isConnected) {
      await connect();
      return;
    }

    if (!tokenName || !tokenSymbol || !initialSupply) {
      setFormError('Please fill all required fields');
      return;
    }

    try {
      setFormError('');
      const supply = parseFloat(initialSupply);
      if (isNaN(supply) || supply <= 0) {
        setFormError('Initial supply must be a positive number');
        return;
      }
      console.log("beefore create")
      await createTokenWithLiquidity(tokenName, tokenSymbol, supply,Number("0.1"));
      
      // Reset form after successful creation
      setTokenName('');
      setTokenSymbol('');
      setInitialSupply('1000000');
    } catch (err) {
      console.error('Error deploying token:', err);
      setFormError('Failed to deploy token');
    }
  };

  return (
    <>
      <div className="mx-auto w-full pt-8 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-2xl">
          Create New ERC20 Token
        </h2>

        {(formError || tokenFactoryError) && (
          <div className="my-4 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
            {formError || tokenFactoryError}
          </div>
        )}

        <div className="mb-8 mt-6 grid grid-cols-1 gap-12 sm:mt-10">
          {/* Token Name */}
          <div className="mb-8">
            <InputLabel title="Token Name" important />
            <Input 
              type="text" 
              placeholder="My Token" 
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>

          {/* Token Symbol */}
          <div className="mb-8">
            <InputLabel title="Token Symbol" important />
            <Input 
              type="text" 
              placeholder="MTK" 
              maxLength={10}
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </div>

          {/* Initial Supply */}
          <div className="mb-8">
            <InputLabel
              title="Initial Supply"
              important
              subTitle="The initial number of tokens to mint"
            />
            <Input
              min={0}
              type="number"
              placeholder="1000000"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              inputClassName="spin-button-hidden"
            />
          </div>

              {/* Initial Supply */}
              <div className="mb-8">
            <InputLabel
              title="Initial Supply"
              important
              subTitle="The initial number of tokens to mint"
            />
            <Input
              min={0}
              type="number"
              placeholder="1000000"
              value={intialBuy}
              onChange={(e) => setInitialBuy(e.target.value)}
              inputClassName="spin-button-hidden"
            />
          </div>

          {/* Decimals - Display only since the hook uses fixed decimals */}
          <div className="mb-8">
            <InputLabel
              title="Decimals"
              subTitle="Number of decimal places (fixed to 18 in this implementation)"
            />
            <Input
              min={0}
              max={18}
              type="number"
              value={18}
              disabled
              inputClassName="spin-button-hidden"
            />
          </div>

          {/* Token Standard - Display only since the hook uses fixed standard */}
          <div className="mb-8">
            <InputLabel title="Token Standard" />
            <div className="relative">
              <Listbox value={tokenStandard} onChange={setTokenStandard}>
                <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                  <div className="flex items-center">
                    {tokenStandard.name}
                  </div>
                  <ChevronDown />
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                    {TokenStandards.map((option) => (
                      <Listbox.Option key={option.id} value={option}>
                        {({ selected }) => (
                          <div
                            className={`flex cursor-pointer items-start rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100 ${
                              selected
                                ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                            }`}
                          >
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-gray-500">
                                {option.description}
                              </div>
                            </div>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>
          </div>

          {/* Network Selection - Display only since the hook uses fixed network */}
          <div className="mb-8">
            <InputLabel title="Deploy Network" important />
            <div className="relative">
              <Listbox value={network} onChange={setNetwork}>
                <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                  <div className="flex items-center">
                    <span className="ltr:mr-2 rtl:ml-2">{network.icon}</span>
                    {network.name}
                  </div>
                  <ChevronDown />
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                    {EVMNetworks.map((option) => (
                      <Listbox.Option key={option.id} value={option}>
                        {({ selected }) => (
                          <div
                            className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100 ${
                              selected
                                ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                            }`}
                          >
                            <span className="ltr:mr-2 rtl:ml-2">
                              {option.icon}
                            </span>
                            {option.name}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="mb-8">
            <InputLabel
              title="Token Description"
              subTitle="Optional description of your token's purpose"
            />
            <Textarea placeholder="Describe what your token represents and its use cases" />
          </div>
        </div>

        <Button
          shape="rounded"
          size="large"
          className="w-full sm:w-auto"
          onClick={handleDeployToken}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'DEPLOYING...' : 'DEPLOY TOKEN'}
        </Button>

        {!isConnected && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            You'll be prompted to connect your wallet when you click Deploy
          </div>
        )}

        {isConnected && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Connected as: {account?.slice(0, 6)}...{account?.slice(-4)}
          </div>
        )}
      </div>
    </>
  );
}