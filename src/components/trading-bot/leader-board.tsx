// static data
import { leaderboardData } from '@/data/static/trading-data';

import { Tab, TabItem, TabPanel, TabPanels } from '@/components/ui/tab';
import SimpleBar from '@/components/ui/simplebar';
import Text from '@/components/ui/text';

function TotalProfit() {
  return (
    <>
      <div className="grid grid-cols-3 pb-5">
        <Text tag="h6" className="text-sm text-gray-500">
          Username
        </Text>
        <Text tag="h6" className="text-center text-sm text-gray-500">
          Strategy
        </Text>
        <Text tag="h6" className="text-end text-sm text-gray-500">
          Profits
        </Text>
      </div>
      <SimpleBar style={{ maxHeight: 420 }} className="-mx-4 px-4">
        <div className="grid grid-cols-3 items-center space-y-5">
          {leaderboardData.map((item) => (
            <>
              <div key={item.id}>
                <Text
                  tag="h6"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  {item.title}
                </Text>
                <Text tag="span" className="text-sm uppercase text-gray-500">
                  {item.text}
                </Text>
              </div>
              <Text
                tag="span"
                className="text-center text-sm capitalize text-gray-500"
              >
                {item.strategy}
              </Text>
              <Text tag="span" className="text-end text-sm text-green-500">
                {item.profit}
              </Text>
            </>
          ))}
        </div>
      </SimpleBar>
    </>
  );
}

function WeeklyProfit() {
  return <TotalProfit />;
}

const tabItemClassName =
  'flex-1 justify-center capitalize text-gray-600 [&>span:first-child]:relative [&>span:first-child]:z-10 [&>span:first-child]:justify-center [&>span:first-child]:px-5 [&>span:first-child]:text-gray-900 [&>span:first-child]:dark:text-white [&>span:nth-of-type(2)]:top-1.5 [&>span:nth-of-type(2)]:z-0 [&>span:nth-of-type(2)]:h-[calc(100%-12px)] [&>span:nth-of-type(2)]:bg-white [&>span:nth-of-type(2)]:shadow-md [&>span:nth-of-type(2)]:dark:bg-light-dark [&>span:only-child]:text-gray-600 [&>span:only-child]:dark:text-gray-300 [&>span]:overflow-hidden [&>span]:rounded-full';

export default function LeaderBoard() {
  return (
    <Tab.Group>
      <Tab.List className="relative mx-auto flex h-13 max-w-[376px] justify-between rounded-full bg-gray-100 px-1.5 text-sm dark:bg-[#0C0F19] dark:shadow-2xl min-[375px]:justify-start min-[375px]:gap-6 2xl:gap-10">
        <TabItem
          tabItemLayoutId="nestedTabIndicator"
          className={tabItemClassName}
        >
          7 Days Profit
        </TabItem>
        <TabItem
          tabItemLayoutId="nestedTabIndicator"
          className={tabItemClassName}
        >
          Total Profit
        </TabItem>
        {/* <span className="absolute inset-x-0 bottom-0 border border-gray-200"></span> */}
      </Tab.List>
      <TabPanels className="mt-4">
        <TabPanel className="focus:outline-none">
          <WeeklyProfit />
        </TabPanel>
        <TabPanel className="focus:outline-none">
          <TotalProfit />
        </TabPanel>
      </TabPanels>
    </Tab.Group>
  );
}
