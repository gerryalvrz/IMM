import dynamic from 'next/dynamic';
import Button from '@/components/ui/button/button';
import { useModal } from '@/components/modal-views/context';
import { Close } from '@/components/icons/close';
import { Tab, TabItem, TabPanel, TabPanels } from '@/components/ui/tab';
import OpenOrders from '@/components/trading-bot/open-orders';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import TabSelect from '@/components/ui/tab-select';
import { useState } from 'react';

const OrderHistory = dynamic(
  () => import('@/components/trading-bot/order-history'),
);
const Parameters = dynamic(() => import('@/components/trading-bot/parameters'));

const tabMenu = [
  {
    title: 'Orders',
    path: '',
  },
  {
    title: 'History',
    path: '',
  },
  {
    title: 'Parameters',
    path: '',
  },
];

const tabItemClassName =
  'flex-1 justify-center capitalize text-gray-600 [&>span:first-child]:relative [&>span:first-child]:z-10 [&>span:first-child]:justify-center [&>span:first-child]:px-5 [&>span:first-child]:text-gray-900 [&>span:first-child]:dark:text-white [&>span:nth-of-type(2)]:top-1.5 [&>span:nth-of-type(2)]:z-0 [&>span:nth-of-type(2)]:h-[calc(100%-12px)] [&>span:nth-of-type(2)]:bg-white [&>span:nth-of-type(2)]:shadow-md [&>span:nth-of-type(2)]:dark:bg-light-dark [&>span:only-child]:text-gray-600 [&>span:only-child]:dark:text-gray-300 [&>span]:overflow-hidden [&>span]:rounded-full';

export default function DCAOrderHistory() {
  const { closeModal } = useModal();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="w-full xs:w-[440px] sm:w-[540px] md:w-[660px] ">
      <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white p-4 shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark sm:min-h-[640px] md:min-h-[715px] md:p-8">
        <div className="mb-8 flex items-center justify-between border-b border-dashed pb-6 text-lg font-medium capitalize -tracking-wide text-gray-900 ltr:text-left rtl:text-right dark:border-gray-700 dark:text-white lg:text-xl">
          DCA BTC/USDT
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={() => closeModal()}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>

        <div className="">
          <Tab.Group
            selectedIndex={selectedTabIndex}
            onChange={(index: any) => setSelectedTabIndex(index)}
          >
            {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
              <Tab.List className="relative mb-9">
                <TabSelect
                  tabMenu={tabMenu}
                  selectedTabIndex={selectedTabIndex}
                />
              </Tab.List>
            ) : (
              <Tab.List className="relative mb-9 flex h-13 justify-between rounded-full bg-gray-100 px-1.5 text-sm dark:bg-[#0C0F19] dark:shadow-2xl min-[375px]:justify-start min-[375px]:gap-6 2xl:gap-10">
                <TabItem
                  tabItemLayoutId="dcaNestedTab"
                  className={tabItemClassName}
                >
                  <span className="me-1 hidden sm:inline-block">Open</span>{' '}
                  Orders
                </TabItem>
                <TabItem
                  tabItemLayoutId="dcaNestedTab"
                  className={tabItemClassName}
                >
                  <span className="me-1 hidden sm:inline-block">Order</span>{' '}
                  History
                </TabItem>
                <TabItem
                  tabItemLayoutId="dcaNestedTab"
                  className={tabItemClassName}
                >
                  Parameters
                </TabItem>
              </Tab.List>
            )}

            <TabPanels>
              <TabPanel className="focus:outline-none">
                <OpenOrders />
              </TabPanel>
              <TabPanel className="focus:outline-none">
                <OrderHistory />
              </TabPanel>
              <TabPanel className="focus:outline-none">
                <Parameters />
              </TabPanel>
            </TabPanels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
