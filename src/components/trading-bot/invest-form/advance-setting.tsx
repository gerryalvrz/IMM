'use client';

import cn from '@/utils/cn';
import { ChangeEvent, useState } from 'react';
import { useMeasure } from '@/lib/hooks/use-measure';
import Input from '@/components/ui/forms/input';
import { useModal } from '@/components/modal-views/context';

// import icons
import { ChevronDown } from '@/components/icons/chevron-down';
import { ChevronForward } from '@/components/icons/chevron-forward';

export default function AdvanceSetting() {
  let [state, setState] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const { openModal } = useModal();

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-1 flex w-full items-center gap-1 text-sm text-[#111827] dark:text-white sm:mb-2"
      >
        <span>Advanced Settings(Optional)</span>
        <ChevronDown className={cn('w-3', isOpen && 'rotate-180')} />
      </button>
      <div
        style={{
          height: isOpen ? height : 0,
        }}
        className="ease-[cubic-bezier(0.33, 1, 0.68, 1)] -mx-0.5 overflow-hidden px-0.5 transition-all duration-[350ms]"
      >
        <div ref={ref}>
          <div className="relative pb-2">
            <Input
              type="number"
              placeholder="Max Investment"
              autoComplete="off"
              value={state ? state : ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setState(e.target.valueAsNumber)
              }
              inputClassName="border-[#E2E8F0] dark:!bg-light-dark reset-password-pin-code appearance-none rounded-lg placeholder:!text-gray-500 !bg-gray-200/50 !text-sm !font-medium pr-16 pl-4"
            />
            <span className="absolute right-5 top-1/2 -translate-y-3 text-sm">
              USDT
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm 2xl:mt-6 2xl:gap-6">
            <button
              className="group flex items-center justify-between"
              onClick={() => openModal('PROFIT_TRANSFER_PREVIEW')}
            >
              <span>Profit Target</span>
              <span className="flex items-center gap-2">
                <span>
                  10% <span className="hidden">(Notify Only)</span>
                </span>
                <ChevronForward className="w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </button>
            <button className="group flex items-center justify-between">
              <span>First Investment Date</span>
              <span className="flex items-center gap-2">
                <span>Now</span>
                <ChevronForward className="w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
