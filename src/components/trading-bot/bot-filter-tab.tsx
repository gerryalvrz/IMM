'use client';

// static data
import { categoriesData, liveTradingData } from '@/data/static/trading-data';

import cn from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useScrollableSlider } from '@/lib/hooks/use-scrollable-slider';
import { useModal } from '@/components/modal-views/context';

// import icons
import { ChevronDown } from '@/components/icons/chevron-down';
import { LevelIcon } from '../icons/level-icon';
import { QuestionSolidIcon } from '../icons/question-solid-icon';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface CategoryItemTypes {
  categoryName: string;
  isActive?: boolean;
  onClick: () => void;
}

function CategoryItem({ categoryName, isActive, onClick }: CategoryItemTypes) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-[30px] shrink-0 !rounded-full border border-transparent px-3.5 text-xs font-medium uppercase tracking-wider outline-none first:uppercase hover:border-gray-200 md:h-auto md:py-1.5 md:capitalize lg:text-sm',
        isActive
          ? '!border-dark text-dark dark:!border-white dark:text-white'
          : 'text-gray-500',
      )}
    >
      {categoryName}
    </button>
  );
}

export default function BotFilterTab({
  defaultActivePath = '/',
}: {
  defaultActivePath?: string;
}) {
  const pathname = usePathname();
  const { openModal } = useModal();
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider(defaultActivePath);

  return (
    <div className="relative z-20 flex items-center gap-3 @container @6xl:gap-5 @7xl:gap-10">
      <div className="app-category-filter-bar flex min-h-[64px] w-full items-center overflow-hidden py-2 min-[375px]:mb-0 @xl:justify-center @4xl:justify-start @6xl:mb-4 @xl:max-w-[630px]">
        <button
          ref={sliderPrevBtn}
          onClick={() => scrollToTheLeft()}
          className="flex h-8 w-6 items-center justify-center bg-gradient-to-r from-white to-transparent text-dark dark:from-gray-900 sm:hidden"
        >
          <ChevronDown className="w-4 rotate-90 dark:text-white" />
        </button>
        <div className="flex items-start overflow-hidden sm:mb-0">
          <div
            className="coin-list-scrollbar -mb-7 flex w-full gap-3 overflow-x-auto scroll-smooth pb-7 sm:mb-0 sm:pb-0"
            ref={sliderEl}
          >
            {categoriesData.map((category) => (
              <CategoryItem
                key={category.name}
                categoryName={category.name}
                isActive={pathname === category.path ? true : false}
                onClick={() => null}
              />
            ))}
          </div>
        </div>
        <button
          ref={sliderNextBtn}
          onClick={() => scrollToTheRight()}
          className="flex h-8 w-6 items-center justify-center bg-gradient-to-l from-white to-transparent text-dark dark:from-gray-900 sm:hidden"
        >
          <ChevronDown className="w-4 -rotate-90 dark:text-white" />
        </button>
      </div>

      <TradingValues />

      <div className="ml-auto flex items-center">
        <DropdownValues />
        <button
          className="ms-1 transition-transform hover:scale-110 @3xl:ms-5"
          onClick={() => openModal('DCA_STEPPER')}
        >
          <QuestionSolidIcon className="w-4" />
        </button>
      </div>
    </div>
  );
}

function TradingValues() {
  return (
    <div className="hidden gap-4 @3xl:grow @3xl:items-center @6xl:gap-8 @[100rem]:flex">
      {liveTradingData.map((item) => (
        <p
          key={`live-trading-data-${item.id}`}
          className="flex items-center border-dashed py-[15px] text-sm font-medium text-gray-500 @2xl:first:pl-8 @4xl:first:pl-14 xl:first:border-l xl:first:border-l-gray-200 xl:dark:first:border-l-gray-700"
        >
          <span className="me-1 block">{item.title}</span>
          <span
            className={cn(
              'block font-normal',
              item.increase ? 'text-green-500' : 'text-red-500',
            )}
          >
            {item.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function DropdownValues() {
  return (
    <div className="relative z-20 mx-1 mt-1.5 @xl:mx-4 first:ml-0 last:mr-0 @[100rem]:hidden">
      <Menu>
        <Menu.Button className="transition-transform hover:scale-110">
          <LevelIcon className="w-4" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <Menu.Items className="absolute top-0 z-50 mt-5 w-72 origin-top-right rounded-lg bg-white p-3 shadow-large ltr:right-0 rtl:left-0 dark:bg-light-dark">
            {liveTradingData.map((item, index) => (
              <Menu.Item key={item.title + index}>
                <div className="flex items-center justify-between gap-4 p-3 text-sm">
                  <span className="me-1 block">{item.title}</span>
                  <span
                    className={cn(
                      'block font-normal',
                      item.increase ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {item.value}
                  </span>
                </div>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
