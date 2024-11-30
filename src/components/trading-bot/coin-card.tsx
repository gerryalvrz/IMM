import cn from '@/utils/cn';

// import icons
import { Star } from '@/components/icons/star';
import { StarFill } from '@/components/icons/star-fill';
import { TrendArrowDownIcon } from '@/components/icons/trend-arrow-down-icon';
import { TrendArrowUpIcon } from '@/components/icons/trend-arrow-up-icon';
import { useState } from 'react';

interface CoinCardDetailsProps {
  details: {
    id: number;
    title: string;
    price: string;
    stared: boolean;
    hourPrice: {
      id: string;
      title: string;
      price: string;
    }[];
    priceUp: boolean;
    upPrice: string;
    downPrice: string;
  };
}

export default function CoinCard({ details }: CoinCardDetailsProps) {
  const [bookmark, setBookmark] = useState(false);
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-gray-100 dark:border-gray-700 dark:bg-light-dark dark:shadow-card">
      <div className="p-3 pb-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="text-sm font-medium uppercase">
            <h2 className="mb-1 text-[#111827] dark:text-white">
              {details.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{details.price}</p>
          </div>
          <button onClick={() => setBookmark(!bookmark)}>
            {bookmark ? (
              <StarFill className="h-4 w-4 text-[#FB923C]" />
            ) : (
              <Star className="h-4 w-4 text-brand dark:text-gray-400" />
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {details.hourPrice.map((item) => (
            <div
              key={`price-high-low-${item.id}`}
              className="text-xs font-normal uppercase"
            >
              <p className="text-gray-500 dark:text-gray-400">{item.title}</p>
              <p className="text-[#111827] dark:text-white">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
      <p
        className={cn(
          'flex items-center justify-center gap-2 border-t border-[#E2E8F0] p-3 text-sm font-normal dark:border-light-dark',
          details.priceUp ? 'text-green-500' : 'text-red-500',
        )}
      >
        -3.48%{' '}
        {details.priceUp ? (
          <TrendArrowUpIcon className="h-auto w-4" />
        ) : (
          <TrendArrowDownIcon className="h-auto w-4" />
        )}
      </p>
    </div>
  );
}
