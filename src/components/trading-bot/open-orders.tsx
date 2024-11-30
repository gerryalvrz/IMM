'use client';

// static data
import { openOrdersData } from '@/data/static/trading-data';

import Text from '@/components/ui/text';
import OpenOrderChart from './open-order-chart';
import { SpikeBarIcon } from '../icons/spike-bar';

export default function OpenOrders() {
  return (
    <div>
      <OpenOrderChart />
      <div className="my-4 flex items-center justify-between">
        <Text
          tag="h6"
          className="text-lg font-medium text-gray-700 dark:text-white"
        >
          BTC/USDT
        </Text>
        <Text
          tag="span"
          className="flex items-center text-lg font-medium text-[#10B981]"
        >
          2.987
          <SpikeBarIcon className="h-6 w-6 flex-shrink-0 text-[#10B981]" />
        </Text>
      </div>
      <div className="space-y-4">
        {openOrdersData.map((item) => (
          <div
            className="grid grid-cols-2 justify-between gap-x-3"
            key={item.id}
          >
            <Text className="text-sm text-gray-700 dark:text-gray-300">
              {item.title}
            </Text>
            <Text
              tag="span"
              className="text-end text-sm text-gray-700 dark:text-gray-300"
            >
              {item.text}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
