'use client';

// static data
import { coinChangeData } from '@/data/static/trading-data';

import cn from '@/utils/cn';
import { Fragment, useState } from 'react';
import Input from '@/components/ui/forms/input';
import SimpleBar from '@/components/ui/simplebar';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';

// import icons
import { ChevronDown } from '@/components/icons/chevron-down';

export default function CoinChange() {
  const [selected, setSelected] = useState(coinChangeData[0]);

  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="flex items-center gap-3 rounded-full bg-gray-100 p-2 py-1.5 pr-6 dark:bg-light-dark">
            {selected.icon}
            <span className="inline-block">
              <p className="font-medium uppercase text-brand dark:text-white sm:text-lg">
                {selected.title}/ustd
              </p>
              <p className="text-left text-sm capitalize text-gray-500 dark:text-gray-300">
                {selected.name}
              </p>
            </span>
            <span className=" ml-2 text-gray-500">
              <ChevronDown className="h-auto w-3" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute -left-3 top-full z-20 mt-1 w-[300px] rounded-lg border bg-white pb-4 shadow-main dark:border-gray-700 dark:bg-light-dark min-[375px]:left-0 min-[375px]:w-[320px] sm:w-[400px] sm:pb-6">
              <div className="p-4 pb-0 sm:p-6 sm:pb-0">
                <Input
                  placeholder="Search..."
                  autoComplete="off"
                  inputClassName="border-[#E2E8F0] !bg-gray-100 dark:!bg-light-dark appearance-none placeholder:!text-[#4B5563] !text-[#111827] dark:!text-gray-200 !mt-0"
                />
                <div className="grid grid-cols-12 items-center py-5 text-sm font-normal text-gray-500">
                  <p className="col-span-3">Pair</p>
                  <p className="col-span-4 text-center">Price</p>
                  <p className="col-span-3 text-center">24H</p>
                  <p className="col-span-2 text-end">Vol</p>
                </div>
              </div>
              <SimpleBar style={{ height: 446 - 156 }} className="px-2">
                {coinChangeData.map((coin) => (
                  <Listbox.Option
                    key={`coin-data-${coin.id}`}
                    className="grid cursor-pointer grid-cols-12 items-center gap-1 rounded-lg px-2 py-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600/60 sm:px-4"
                    value={coin}
                  >
                    <p className="col-span-3 flex items-center gap-2 font-medium uppercase text-dark dark:text-gray-300">
                      {coin.icon}
                      <span>{coin.title}</span>
                    </p>
                    <p
                      className={cn(
                        'col-span-4 text-center font-normal',
                        coin.inCrease ? 'text-green-500' : 'text-red-500',
                      )}
                    >
                      {coin.price}
                    </p>
                    <p
                      className={cn(
                        'col-span-3 text-center font-normal',
                        coin.inCrease ? 'text-green-500' : 'text-red-500',
                      )}
                    >
                      {coin.priceUpDown}
                    </p>
                    <p className="col-span-2 text-end font-normal text-gray-500">
                      {coin.vol}
                    </p>
                  </Listbox.Option>
                ))}
              </SimpleBar>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
}
