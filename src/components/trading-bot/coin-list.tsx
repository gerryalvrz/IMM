'use client';

// static data
import { coinCardData } from '@/data/static/trading-data';

import dynamic from 'next/dynamic';
import Input from '@/components/ui/forms/input';
import SimpleBar from '@/components/ui/simplebar';
import { useScrollableSlider } from '@/lib/hooks/use-scrollable-slider';
import { Tab, TabItem, TabPanel, TabPanels } from '@/components/ui/tab';
import CoinCard from './coin-card';
import Loader from '@/components/ui/loader';

// import icons
import { ChevronDown } from '../icons/chevron-down';

// Dynamic imports
const LeaderBoard = dynamic(
  () => import('@/components/trading-bot/leader-board'),
  {
    loading: () => <LoaderComponent />,
  },
);
const HotCoinList = dynamic(
  () => import('@/components/trading-bot/hot-coin-list'),
  {
    loading: () => <LoaderComponent />,
  },
);
const NewCoinList = dynamic(
  () => import('@/components/trading-bot/new-coin-list'),
  {
    loading: () => <LoaderComponent />,
  },
);

function LoaderComponent() {
  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center">
      <Loader size="small" />
    </div>
  );
}

export default function CoinList() {
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  return (
    <div className="h-full rounded-lg bg-white p-4 pb-6 shadow-card dark:bg-light-dark sm:px-6 2xl:px-8 2xl:pb-9">
      <Tab.Group>
        <div className="flex items-start">
          <button
            ref={sliderPrevBtn}
            onClick={() => scrollToTheLeft()}
            className="flex h-8 w-6 items-center justify-center bg-gradient-to-r from-white to-transparent text-dark dark:from-gray-800 xs:hidden"
          >
            <ChevronDown className="w-4 rotate-90 dark:text-white" />
          </button>
          <div className="-mb-4 flex h-full min-h-[36px] w-full items-start overflow-hidden xs:mb-0">
            <Tab.List
              ref={sliderEl}
              className="coin-list-scrollbar relative border-b border-gray-200 dark:border-gray-800 flex w-full justify-between overflow-x-auto scroll-smooth text-sm min-[375px]:justify-start min-[375px]:gap-6 xs:mb-0 2xl:gap-10"
            >
              <TabItem className="whitespace-nowrap capitalize text-gray-600 2xl:uppercase [&>span]:px-0">
                Coin list
              </TabItem>
              <TabItem className="whitespace-nowrap px-0 capitalize text-gray-600 2xl:uppercase">
                Leader board
              </TabItem>
              <TabItem className="whitespace-nowrap px-0 capitalize text-gray-600 2xl:uppercase">
                Hot
              </TabItem>
              <TabItem className="whitespace-nowrap px-0 capitalize text-gray-600 2xl:uppercase">
                New
              </TabItem>
            </Tab.List>
          </div>
          <button
            ref={sliderNextBtn}
            onClick={() => scrollToTheRight()}
            className="flex h-8 w-6 items-center justify-center bg-gradient-to-l from-white to-transparent text-dark dark:from-gray-800 xs:hidden"
          >
            <ChevronDown className="w-4 -rotate-90 dark:text-white" />
          </button>
        </div>
        <TabPanels className="mt-4">
          <TabPanel className="focus:outline-none">
            <Input
              placeholder="Search..."
              autoComplete="off"
              inputClassName="mb-5 border-[#E2E8F0] !bg-gray-100 dark:!bg-light-dark appearance-none placeholder:!text-[#4B5563] !text-[#111827] dark:!text-white"
            />
            <SimpleBar
              style={{ maxHeight: 450 }}
              className="-mx-0.5 px-0.5 @container"
            >
              <div className="grid grid-cols-1 gap-3 @xs:grid-cols-2 @2xl:grid-cols-3 @6xl:grid-cols-4">
                {coinCardData.map((item) => (
                  <CoinCard
                    key={`coin-card-details-${item.id}`}
                    details={item}
                  />
                ))}
              </div>
            </SimpleBar>
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <LeaderBoard />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <HotCoinList />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <NewCoinList />
          </TabPanel>
        </TabPanels>
      </Tab.Group>
    </div>
  );
}
