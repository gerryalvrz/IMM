'use client';

import { useState } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';

// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';
import routes from '@/config/routes';

export default function SignInForm() {
  const [state, setState] = useState(false);

  function handleSubmit(e: any) {
    e.preventDefault();
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <Input
        type="email"
        placeholder="Enter your email"
        inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
      />
      <div className="relative">
        <Input
          type={state ? 'text' : 'password'}
          placeholder="Password"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        />
        <span
          className="absolute bottom-3 right-4 cursor-pointer text-[#6B7280] rtl:left-4 rtl:right-auto sm:bottom-3.5"
          onClick={() => setState(!state)}
        >
          {state ? (
            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          iconClassName="bg-[#4B5563] rounded focus:!ring-0"
          label="Remember me"
          labelPlacement="end"
          labelClassName="ml-1.5 mt-1 text-[#4B5563] sm:text-sm dark:text-gray-300 tracking-[0.5px]"
          inputClassName="mt-0.5 focus:!ring-offset-[1px]"
          size="sm"
        />
        <AnchorLink
          href={routes.forgetPassword}
          className="inline-block text-sm font-medium tracking-[0.5px] text-[#4B5563] underline dark:text-gray-300"
        >
          Forgot Password
        </AnchorLink>
      </div>
      <Button
        type="submit"
        className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
      >
        Log In
      </Button>
    </form>
  );
}
