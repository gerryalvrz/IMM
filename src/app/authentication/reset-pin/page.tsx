import Logo from '@/components/ui/logo';
import Image from '@/components/ui/image';
import ResetPinForm from '@/components/auth/reset-pin-form';

// import images and icons
import BitcoinImg from '@/assets/images/bit-coin.png';

export default function ResetPin() {
  return (
    <div className="grid flex-grow grid-cols-1 gap-0 lg:grid-cols-[1fr_40%] 3xl:grid-cols-2">
      <div className="flex flex-grow items-center justify-center py-14">
        <div className="w-full max-w-[494px] px-4 text-center">
          <div className="mx-auto mb-4 w-20 xl:w-24 2xl:mb-8">
            <Logo className="!w-full" />
          </div>
          <h2 className="mb-4 text-xl font-medium uppercase dark:text-white lg:text-2xl 2xl:mb-8">
            Enter Pin
          </h2>
          <p className="mb-8 text-sm leading-7 text-[#4B5563] dark:text-gray-300 2xl:mb-12">
            We emailed you the six digit code to{' '}
            <span className="font-medium">deny@deny.com</span> Enter the code
            below to confirm your email address.
          </p>
          <ResetPinForm />
          <p className="text-xs tracking-[0.5px] text-[#4B5563] dark:text-gray-300 sm:text-sm">
            Didn&apos;t received the code?
            <span className="ml-1 cursor-pointer font-medium underline">
              Resend it!
            </span>
          </p>
        </div>
      </div>
      <div className="relative hidden bg-[#F3F4F6] lg:block">
        <Image src={BitcoinImg} alt="sign-up" fill className="object-cover" />
      </div>
    </div>
  );
}
