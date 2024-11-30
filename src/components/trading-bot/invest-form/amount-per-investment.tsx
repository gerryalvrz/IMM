'use client';

import { ChangeEvent, useState } from 'react';
import { useModal } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';

// import icons
import { Plus } from '@/components/icons/plus';

export default function AmountPerInvestment() {
  const { openModal } = useModal();
  let [state, setState] = useState(0);

  return (
    <div className="text-sm font-normal">
      <p className="mb-2 text-[#111827] dark:text-white sm:mb-3">
        Amount Per Investment
      </p>
      <div className="mb-2 flex items-center justify-between text-[#4B5563] dark:text-gray-400 sm:mb-3">
        <p>Price Range(USDT)</p>
        <div className="flex items-center gap-4">
          <p>USDT</p>
          <button
            onClick={() => openModal('FUND_TRANSFER_PREVIEW')}
            className="-mt-1 rounded-md border-2 border-[#4B5563] p-1 py-0.5 transition-transform duration-200 active:scale-95"
          >
            <Plus className="w-2" />
          </button>
        </div>
      </div>
      <div className="relative">
        <Input
          type="number"
          placeholder="Min: 2"
          autoComplete="off"
          value={state ? state : ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setState(e.target.valueAsNumber)
          }
          inputClassName="border-[#E2E8F0] dark:!bg-light-dark reset-password-pin-code appearance-none rounded-lg placeholder:!text-gray-500 !bg-gray-200/50 !text-sm !font-medium pr-16 pl-4"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2">USDT</span>
      </div>
    </div>
  );
}
