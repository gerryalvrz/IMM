'use client';

import { useState } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';

// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';

export default function SignUpForm() {
  const [state, setState] = useState(false);

  function handleSubmit(e: any) {
    e.preventDefault();
    // console.log(e);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
        <Input
          type="text"
          placeholder="First Name"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        />
        <Input
          type="text"
          placeholder="Last Name"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        />
      </div>
      <Input
        type="email"
        placeholder="Email"
        inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
      />
      <div className="relative">
        <Input
          type={state ? 'text' : 'password'}
          placeholder="Password"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        />
        <span
          className="absolute bottom-3 right-4 cursor-pointer text-[#6B7280] sm:bottom-3.5 rtl:left-4 rtl:right-auto"
          onClick={() => setState(!state)}
        >
          {state ? (
            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </span>
      </div>
      <Checkbox
        iconClassName="bg-[#4B5563] rounded mt-0.5"
        label={
          <>
            I’ve read and agree with
            <AnchorLink
              href={'#'}
              className="ml-2 font-medium tracking-[0.5px] underline dark:text-gray-300"
            >
              Terms of Service and our Privacy Policy
            </AnchorLink>
          </>
        }
        labelPlacement="end"
        labelClassName="ml-1.5 text-[#4B5563] !text-xs dark:text-gray-300 tracking-[0.5px] !leading-7"
        containerClassName="!items-start"
        inputClassName="mt-1 focus:!ring-offset-[1px]"
        size="sm"
      />
      <Button
        type="submit"
        className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
      >
        sign up
      </Button>
    </form>
  );
}
