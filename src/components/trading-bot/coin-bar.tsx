// static data
import { SelectedCoinPriceData } from '@/data/static/trading-data';

import cn from '@/utils/cn';
import Link from 'next/link';
// import SimpleBar from '@/components/ui/simplebar';
import CoinChange from '@/components/trading-bot/coin-change';

// import icons
import { MediaPlayIcon } from '@/components/icons/media-play-icon';
import { GuideIcon } from '@/components/icons/guide-icon';

export default function CoinBar() {
  return (
    <>
      <div className="relative z-10 flex flex-nowrap items-center justify-between gap-8 border-t border-dashed border-gray-200 py-4 @container @6xl:py-6 dark:border-gray-700">
        <div className="flex shrink-0 items-center justify-between gap-8 @[90rem]:gap-10">
          <CoinChange />
          <div className="hidden shrink-0 @xl:block">
            <p className="mb-1 font-medium text-red-500 sm:text-base">
              $20,679.17
            </p>
            <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
              $20,679.17
            </p>
          </div>
          {SelectedCoinPriceData.map((item) => (
            <CoinPriceDetails
              key={item.text}
              text={item.text}
              price={item.price}
              priceDown={item.increase}
            />
          ))}
        </div>
        <IconButton />
      </div>
    </>
  );
}

function CoinPriceDetails({
  text,
  price,
  priceDown,
}: {
  text: string;
  price: string;
  priceDown: boolean;
}) {
  return (
    <div className="hidden shrink-0 text-sm font-medium @6xl:block">
      <p className="mb-1 text-gray-500">{text}</p>
      <p
        className={cn(
          priceDown ? 'text-red-500' : 'text-brand dark:text-gray-300',
        )}
      >
        {price}
      </p>
    </div>
  );
}

function IconButton() {
  return (
    <div className="flex shrink-0 items-center gap-4">
      <Link
        href={'#'}
        title="Tutorials"
        className="group inline-flex items-center gap-3 text-sm text-gray-500 transition-colors hover:text-brand dark:hover:text-gray-200"
      >
        <MediaPlayIcon className="h-auto w-5 text-gray-900 transition-transform duration-200 group-hover:scale-110 dark:text-gray-400 dark:group-hover:text-gray-200" />
        <span className="hidden md:inline-block">Tutorial</span>
      </Link>
      <Link
        href={'#'}
        title="Guidance"
        className="group inline-flex items-center gap-3 text-sm text-gray-500 transition-colors hover:text-brand dark:hover:text-gray-200"
      >
        <GuideIcon className="h-auto w-5 text-gray-900 transition-transform duration-200 group-hover:scale-110 dark:text-gray-400 dark:group-hover:text-gray-200" />
        <span className="hidden md:inline-block">Guidance</span>
      </Link>
    </div>
  );
}
