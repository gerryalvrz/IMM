'use client';

import Logo from '@/components/ui/logo';
import cn from '@/utils/cn';
import { FlashIcon } from '@/components/icons/flash';
import SearchButton from '@/components/search/button';
import ActiveLink from '@/components/ui/links/active-link';
import Hamburger from '@/components/ui/hamburger';
import WalletConnect from '@/components/nft/wallet-connect';
import { MenuItems } from '@/layouts/sidebar/_layout-menu';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useDrawer } from '@/components/drawer-views/context';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import { useLayout } from '@/lib/hooks/use-layout';
import routes from '@/config/routes';
import { LAYOUT_OPTIONS } from '@/lib/constants';

function NotificationButton() {
  const isMounted = useIsMounted();
  const { layout } = useLayout();
  return (
    isMounted && (
      <ActiveLink
        href={
          '/' +
          (layout === LAYOUT_OPTIONS.MODERN ? '' : layout) +
          routes.notification
        }
      >
        <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
          <FlashIcon className="h-auto w-3 sm:w-auto" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-white sm:h-3 sm:w-3" />
        </div>
      </ActiveLink>
    )
  );
}

function HeaderRightArea() {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const { openDrawer, isOpen } = useDrawer();
  return (
    <div className="order-last flex shrink-0 items-center">
      <div className="xl:hidden ltr:mr-3.5 ltr:sm:mr-5 rtl:ml-3.5 rtl:sm:ml-5">
        <SearchButton
          color="white"
          className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
        />
      </div>

      <div className="hidden gap-6 lg:flex 2xl:gap-8">
        {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
          <div>
            <SearchButton variant="transparent" className="dark:text-white" />
          </div>
        )}
        <NotificationButton />
        <WalletConnect />
      </div>

      <div className="flex items-center lg:hidden">
        <NotificationButton />
        <Hamburger
          isOpen={isOpen}
          onClick={() => openDrawer('DRAWER_MENU')}
          color="white"
          className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white ltr:ml-3.5 ltr:sm:ml-5 rtl:mr-3.5 rtl:sm:mr-5"
        />
      </div>
    </div>
  );
}

export function Header() {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const windowScroll = useWindowScroll();
  const { openDrawer, isOpen } = useDrawer();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 flex w-full items-center justify-between px-4 backdrop-blur transition-all duration-300 sm:px-6 lg:px-8 3xl:px-10 ltr:right-0 rtl:left-0',
        isMounted && windowScroll.y > 17
          ? 'h-16 bg-white/80 shadow-card dark:bg-dark/80 sm:h-20'
          : 'h-16 sm:h-24',
      )}
    >
      <div className="mx-auto flex w-full max-w-[2160px] items-center justify-between">
        <div className="flex items-center">
          <div className="hidden lg:mr-6 lg:block xl:hidden">
            <Hamburger
              isOpen={isOpen}
              onClick={() => openDrawer('DRAWER_MENU')}
              color="white"
              className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
            />
          </div>
          <Logo />
          {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
            <MenuItems />
          )}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}

export default function MinimalLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="bg-light-100 dark:bg-dark-100 mt-8 flex min-h-screen flex-col gap-6 px-4 sm:px-6 lg:px-8 3xl:px-10">
        <main className="mx-auto mb-12 flex w-full max-w-[2160px] flex-grow flex-col @container">
          {children}
        </main>
      </div>
    </>
  );
}
