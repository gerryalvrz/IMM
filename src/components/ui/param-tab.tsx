'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import cn from '@/utils/cn';
import { Tab, TabItem, TabPanels, TabPanel } from '@/components/ui/tab';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
// import { useLayout } from '@/lib/hooks/use-layout';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useClickAway } from '@/lib/hooks/use-click-away';
import TabSelect from './tab-select';
// import { LAYOUT_OPTIONS } from '@/lib/constants';

interface TabMenuItem {
  title: React.ReactNode;
  path: string;
}

interface ParamTabTypes {
  tabMenu: TabMenuItem[];
  children: React.ReactNode;
  tabListClassName?: string;
}

export { TabPanel };

export default function ParamTab({
  tabMenu,
  children,
  tabListClassName,
}: ParamTabTypes) {
  const router = useRouter();
  // const { layout } = useLayout();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('view');
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const dropdownEl = useRef<HTMLDivElement>(null);
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [visibleMobileMenu, setVisibleMobileMenu] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function handleTabChange(index: number) {
    router.push(
      pathname + '?' + createQueryString('view', tabMenu[index].path),
      { scroll: false },
    );
  }

  useEffect(() => {
    if (query) {
      setSelectedTabIndex(tabMenu.findIndex((item) => query === item.path));
    }
    // console.log('query updated');
  }, [query]);

  useClickAway(dropdownEl, () => {
    setVisibleMobileMenu(false);
  });

  return (
    <Tab.Group
      selectedIndex={selectedTabIndex}
      onChange={(index: any) => handleTabChange(index)}
    >
      <Tab.List
        className={cn(
          'relative mb-6 bg-body text-sm uppercase before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-sm before:bg-gray-200 dark:bg-dark dark:before:bg-gray-800 sm:gap-8 sm:rounded-none md:before:h-0.5',
          tabListClassName,
        )}
      >
        {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
          <TabSelect tabMenu={tabMenu} selectedTabIndex={selectedTabIndex} />
        ) : (
          <div className="flex gap-6 md:gap-8 xl:gap-10 3xl:gap-12">
            {tabMenu.map((item) => (
              <TabItem tabItemLayoutId="activeTabIndicator-two" key={item.path}>
                {item.title}
              </TabItem>
            ))}
          </div>
        )}
      </Tab.List>
      <TabPanels>{children}</TabPanels>
    </Tab.Group>
  );
}
