import { useState } from 'react';
import cn from '@/utils/cn';
import { hotCoinListData } from '@/data/static/trading-data';
import SimpleBar from '@/components/ui/simplebar';
import Text from '@/components/ui/text';
import Button from '@/components/ui/button/button';
import { StarFill } from '@/components/icons/star-fill';
import { Star } from '@/components/icons/star';
import Link from 'next/link';

function WishList({ className }: { className?: string }) {
  const [wishListed, setWishlisted] = useState(false);

  return (
    <div className={className}>
      <Button
        variant="transparent"
        type="button"
        onClick={() => setWishlisted(!wishListed)}
        className="w-auto !p-0 hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent [&>span.drip]:hidden"
      >
        {wishListed ? (
          <StarFill className="h-4 w-4 text-[#FB923C]" />
        ) : (
          <Star className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
}

export default function HotCoinList() {
  return (
    <SimpleBar style={{ maxHeight: 500 }} className="-mx-4 px-4">
      <div className="space-y-5">
        {hotCoinListData.map((item) => (
          <Link
            key={item.id}
            href="/"
            onClick={(e) => e.preventDefault()}
            className="flex gap-3 rounded"
          >
            <WishList className="w-4 flex-shrink-0" />
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
                    {item.text}
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
                <Text
                  tag="span"
                  className={cn(
                    'text-end text-xs',
                    !item.increase ? 'text-red-500' : 'text-green-500',
                  )}
                >
                  {item.index}
                </Text>
              </div>
              <div className="mt-1 hidden items-center gap-2 xs:flex">
                {item.tags.length
                  ? item.tags.map((tag, index) => (
                      <Text
                        key={`tag-${index}`}
                        tag="span"
                        className="max-w-[170px] truncate rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800"
                      >
                        {tag}
                      </Text>
                    ))
                  : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SimpleBar>
  );
}
