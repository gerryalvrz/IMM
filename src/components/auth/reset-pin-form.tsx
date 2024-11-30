'use client';

import Button from '@/components/ui/button/button';
import PinCode from '@/components/ui/forms/pin-code';

export default function ResetPinForm() {
  return (
    <>
      <PinCode
        length={5}
        type="number"
        placeholder="-"
        inputClassName="reset-password-pin-code border-[#E3E8ED] focus:border-[#111827] focus:ring-gray-900 dark:focus:ring-gray-200 dark:focus:ring-1 !text-lg lg:!text-2xl 2xl:!text-[32px] w-12 h-14 lg:w-14 lg:h-16 2xl:w-16 2xl:h-[72px] !mr-0 focus:!ring-opacity-0 dark:focus:!ring-opacity-100"
        setValue={function noRefCheck() {}}
        className="mb-8 gap-3 sm:gap-4 2xl:mb-12 2xl:gap-6"
      />
      <Button
        type="submit"
        className="mb-8 w-full max-w-[292px] rounded-lg !text-sm uppercase tracking-[0.04em] sm:w-2/3 sm:max-w-full lg:w-3/4 2xl:mb-10 2xl:w-5/6"
      >
        Log In
      </Button>
    </>
  );
}
