import { useState } from 'react';
import cn from '@/utils/cn';
import { SwapIcon } from '@/components/icons/swap-icon';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';
import { ChevronDown } from '../../icons/chevron-down';
import { coinChangeData } from '@/data/static/trading-data';
import Text from '@/components/ui/text';
import { useModal } from '@/components/modal-views/context';
import { Close } from '@/components/icons/close';
import SimpleBar from '@/components/ui/simplebar';

function CoinSelect() {
  let [state, setState] = useState(coinChangeData[0]);

  return (
    <div className="relative">
      <Text className="mb-3 text-sm font-medium text-brand dark:text-white">
        Coin
      </Text>
      <Listbox value={state} onChange={setState}>
        <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-[#E2E8F0] bg-gray-200/50 px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-[#0C0F19] dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
          <div className="flex items-center gap-2">
            {state.icon}
            <span className="uppercase">{state.title}</span>
          </div>
          <ChevronDown />
        </Listbox.Button>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-[#0C0F19] xs:p-2">
            <SimpleBar className="-mx-1 max-h-44 px-2">
              {coinChangeData.map((option) => (
                <Listbox.Option key={option.id} value={option}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition ',
                        selected
                          ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/70',
                      )}
                    >
                      {option.icon}
                      <span className="text-sm font-medium uppercase text-dark dark:text-gray-100">
                        {option.title}
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </SimpleBar>
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

export default function FundTransfer() {
  let [toggleCoin, setToggleCoin] = useState(false);
  const { closeModal } = useModal();

  return (
    <div className="w-full xs:w-[444px]">
      <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white p-8 shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
        <div className="mb-8 flex items-center justify-between border-b border-dashed pb-6 text-lg font-medium capitalize -tracking-wide text-gray-900 ltr:text-left rtl:text-right dark:border-gray-700 dark:text-white lg:text-xl">
          Fund transfer
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={() => closeModal()}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
        <div
          className={cn(
            'relative flex gap-3',
            toggleCoin ? 'flex-col-reverse' : 'flex-col',
          )}
        >
          <Input
            type="text"
            placeholder="Funding Account"
            inputClassName="!bg-[#F3F4F6] dark:!bg-[#0C0F19]"
          />
          <div className="absolute left-1/2 top-1/2 z-[1] -ml-4 -mt-4 rounded-full bg-white shadow-large dark:bg-[#1E293B]">
            <Button
              size="mini"
              color="gray"
              shape="circle"
              variant="transparent"
              onClick={() => setToggleCoin(!toggleCoin)}
            >
              <SwapIcon className="h-auto w-3" />
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Trading Account"
            inputClassName="!bg-[#F3F4F6] dark:!bg-[#0C0F19]"
          />
        </div>
        <div className="mt-8 space-y-4">
          <CoinSelect />
          <Input
            label="Amount USDT"
            useUppercaseLabel={false}
            type="text"
            placeholder="Amount..."
            labelClassName="[&>span]:text-brand [&>span]:mb-3"
            inputClassName="!bg-[#F3F4F6] dark:!bg-[#0C0F19] dark:text-white"
          />
          <Button
            type="submit"
            shape="rounded"
            className="!mt-8 w-full !font-bold uppercase dark:bg-blue-800"
            onClick={() => closeModal()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
