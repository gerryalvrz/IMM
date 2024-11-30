'use client';

import Button from '@/components/ui/button/button';

import InvestDay from './invest-day';
import AmountPerInvestment from './amount-per-investment';
import AdvanceSetting from './advance-setting';
import { useModal } from '@/components/modal-views/context';

export default function InvestForm() {
  return (
    <>
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col rounded-lg bg-white p-4 shadow-card dark:bg-light-dark sm:p-6 lg:h-full 2xl:px-8"
      >
        <div className="flex-grow">
          <div className="grid grid-cols-1 gap-6">
            <InvestDay />
            <AmountPerInvestment />
            <AdvanceSetting />
          </div>
        </div>
        <Button
          type="submit"
          shape="rounded"
          className="mt-8 w-full !font-bold uppercase dark:bg-blue-800"
        >
          Create
        </Button>
      </form>
    </>
  );
}
