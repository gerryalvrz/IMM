'use client';

import React from 'react';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import ErrorLightImage from '@/assets/images/404-light.svg';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { useLayout } from '@/lib/hooks/use-layout';
import ModernLayout from '@/layouts/modern/layout';
import MinimalLayout from '@/layouts/minimal/layout';
import RetroLayout from '@/layouts/retro/layout';
import ClassicLayout from '@/layouts/classic/layout';

const Layout = ({ children }: React.PropsWithChildren) => {
  const { layout } = useLayout();
  if (layout === LAYOUT_OPTIONS.MINIMAL) {
    return <MinimalLayout>{children}</MinimalLayout>;
  }
  if (layout === LAYOUT_OPTIONS.CLASSIC) {
    return <ClassicLayout>{children}</ClassicLayout>;
  }
  if (layout === LAYOUT_OPTIONS.RETRO) {
    return <RetroLayout>{children}</RetroLayout>;
  }
  return <ModernLayout>{children}</ModernLayout>;
};

const NotFoundPage = () => {
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  return (
    <Layout>
      <div className="flex max-w-full flex-col items-center justify-center text-center">
        <div className="relative aspect-[257/173] w-52 max-w-full sm:w-[400px] xl:w-[450px] 3xl:w-[500px]">
          {isMounted && !isDarkMode && (
            <Image src={ErrorLightImage} alt="404 Error" priority />
          )}
          {isMounted && isDarkMode && (
            <Image src={ErrorDarkImage} alt="404 Error" priority />
          )}
        </div>

        <h2 className="mb-2 mt-5 text-base font-medium uppercase tracking-wide text-gray-900 dark:text-white sm:mb-4 sm:mt-10 sm:text-xl 3xl:mt-12 3xl:text-2xl">
          Error! No Result Found
        </h2>
        <p className="mb-4 max-w-full text-xs leading-loose tracking-tight text-gray-600 dark:text-gray-400 sm:mb-6 sm:w-[430px] sm:text-sm sm:leading-loose">
          Sorry, the page you are looking for might be renamed, removed, or
          might never exist.
        </p>
        {isMounted && (
          <AnchorLink
            href={{
              pathname:
                layout === LAYOUT_OPTIONS.MODERN ? '/' : routes.home + layout,
            }}
          >
            <Button shape="rounded">Back to Home</Button>
          </AnchorLink>
        )}
      </div>
    </Layout>
  );
};

export default NotFoundPage;
