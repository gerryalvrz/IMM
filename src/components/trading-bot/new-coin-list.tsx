import { useState } from 'react';
import cn from '@/utils/cn';
import { newCoinListData } from '@/data/static/trading-data';
import SimpleBar from '@/components/ui/simplebar';
import Text from '@/components/ui/text';
import Link from 'next/link';

export default function NewCoinList() {
  return (
    <SimpleBar style={{ maxHeight: 500 }} className="-mx-4 px-4">
      <div className="space-y-5">
        {newCoinListData.map((item) => (
          <Link
            key={item.id}
            href="/"
            onClick={(e) => e.preventDefault()}
            className="flex gap-3 rounded"
          >
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <Text
                    tag="h6"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {item.title}
                  </Text>
                  <Text tag="span" className="text-sm uppercase text-gray-500">
                    {parseFloat(item.value)}k
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Text
                    tag="span"
                    className="text-center text-sm capitalize text-gray-500"
                  >
                    {item.value}
                  </Text>
                  <Text
                    tag="span"
                    className={cn(
                      'text-center text-xs capitalize text-gray-500',
                      !item.increase ? 'text-red-500' : 'text-green-500',
                    )}
                  >
                    {item.metric}
                  </Text>
                </div>
                <div className="flex flex-col text-end">
                  <Text
                    tag="span"
                    className={cn(
                      'text-xs',
                      !item.increase ? 'text-red-500' : 'text-green-500',
                    )}
                  >
                    {item.index}
                  </Text>
                  <Text
                    tag="span"
                    className={cn('text-end text-xs text-gray-500')}
                  >
                    {item.createdDate}
                  </Text>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SimpleBar>
  );
}
