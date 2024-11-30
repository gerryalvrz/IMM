'use client';

import { useRouter } from 'next/navigation';
import cn from '@/utils/cn';
import LogoIcon from '@/components/ui/logo-icon';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import { FlashIcon } from '@/components/icons/flash';
import Hamburger from '@/components/ui/hamburger';
import ActiveLink from '@/components/ui/links/active-link';
import SearchButton from '@/components/search/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import routes from '@/config/routes';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import WalletConnect from '@/components/nft/wallet-connect';

function NotificationButton() {
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  return (
    isMounted && (
      <ActiveLink
        href={
          (layout === LAYOUT_OPTIONS.MODERN ? '' : `/${layout}`) +
          routes.notification
        }
      >
        <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
          <FlashIcon className="h-auto w-3 sm:w-auto" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-slate-50 sm:h-3 sm:w-3" />
          <span className="sr-only">Notification icon</span>
        </div>
      </ActiveLink>
    )
  );
}

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
      <NotificationButton />
      <WalletConnect />
    </div>
  );
}

export function RetroHeader({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-all duration-300 sm:h-20 3xl:h-24 ltr:right-0 rtl:left-0',
        isMounted && windowScroll.y > 17
          ? 'bg-white/80 shadow-card dark:bg-dark/80'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('RETRO_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          <SearchButton
            variant="transparent"
            className="dark:text-white ltr:-ml-[17px] rtl:-mr-[17px]"
          />
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}

export function ClassicHeader({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-all duration-300 sm:h-20 3xl:h-24 ltr:right-0 rtl:left-0',
        ((isMounted && windowScroll.y) as number) > 2
          ? 'bg-white/80 shadow-card dark:bg-dark/80'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('CLASSIC_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          <SearchButton
            variant="transparent"
            className="dark:text-white ltr:-ml-[17px] rtl:-mr-[17px]"
          />
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-shadow duration-300 sm:h-20 3xl:h-24 ltr:right-0 rtl:left-0',
        ((isMounted && windowScroll.y) as number) > 2
          ? 'bg-white/80 shadow-card dark:bg-dark/80'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('DEFAULT_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          <SearchButton
            variant="transparent"
            className="dark:text-white ltr:-ml-[17px] rtl:-mr-[17px]"
          />
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
