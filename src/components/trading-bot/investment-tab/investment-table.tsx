'use client';
// static data
import { investmentData } from '@/data/static/trading-data';

import React, { useState } from 'react';
import cn from '@/utils/cn';
import InvestmentAccordionTable from '@/components/trading-bot/investment-accordion-table';
import { useModal } from '@/components/modal-views/context';

// import icons
import { ShutdownIcon } from '@/components/icons/shut-down-icon';
import { MoreIcon } from '@/components/icons/more-icon';

const COLUMNS = [
  {
    Header: () => (
      <p className="w-full text-left capitalize">Time of investment</p>
    ),
    accessor: 'name',
    // @ts-ignore
    Cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image}
        <span className="inline-block">
          <p className="text-start text-sm font-medium uppercase text-brand dark:text-white">
            {row.original.name}
          </p>
          <p className="whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400">
            {row.original.current_price}
          </p>
        </span>
      </div>
    ),
    minWidth: 160,
    maxWidth: 200,
  },
  {
    Header: () => (
      <p>
        Investment <br /> <span className="text-xs font-semibold">(USDT)</span>
      </p>
    ),
    accessor: 'investment',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <p className="w-full text-center">${value}</p>
    ),
    minWidth: 100,
    maxWidth: 120,
  },
  {
    Header: () => (
      <p>
        Total Profit <br />{' '}
        <span className="text-xs font-semibold">(USDT)</span>
      </p>
    ),
    accessor: 'total_profit',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={cn(
          'w-full',
          value.includes('+') ? 'text-green-500' : 'text-red-500',
        )}
      >
        {value}
      </div>
    ),
    minWidth: 150,
    maxWidth: 160,
  },
  {
    Header: () => <>Transactions</>,
    accessor: 'transactions',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div className="w-full">{value}</div>,
    minWidth: 110,
    maxWidth: 120,
  },
  {
    Header: () => <>Amount Per Investment</>,
    accessor: 'amount_per_investment',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div className="w-full">${value}</div>,
    minWidth: 130,
    maxWidth: 140,
  },
  {
    Header: () => <div>Price</div>,
    accessor: 'price',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={cn('w-full', value.up ? 'text-green-500' : 'text-red-500')}
      >
        ${value.p}
      </div>
    ),
    minWidth: 80,
    maxWidth: 100,
  },
  {
    Header: () => <div>Avg. Buy Price</div>,
    accessor: 'avg_buy_price',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div className="w-full">${value}</div>,
    minWidth: 130,
    maxWidth: 140,
  },
  {
    Header: () => <div>Bought</div>,
    accessor: 'bought',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div className="w-full">{value}</div>,
    minWidth: 70,
    maxWidth: 80,
  },
  {
    Header: () => <></>,
    accessor: 'insufficient_fund',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <p className="flex w-full items-center justify-center gap-1 text-xs capitalize text-[#F5A623]">
        {value && (
          <span className="flex flex-nowrap items-center whitespace-nowrap">
            Insufficient fund{' '}
            <span className="ms-1 inline-block rounded-full bg-[#F5A623] px-1 text-white">
              !
            </span>
          </span>
        )}
      </p>
    ),
    minWidth: 180,
    maxWidth: 200,
  },
  {
    Header: () => <></>,
    accessor: 'off',
    // @ts-ignore
    Cell: ({ cell: { value } }) => {
      const [isActive, setIsActive] = useState(true);
      return (
        <>
          {value &&
            (isActive ? (
              <button
                className="rounded-lg bg-red-500 px-3 py-2 active:scale-95"
                onClick={() => setIsActive((prev) => !prev)}
              >
                <ShutdownIcon className="w-4 text-white" />
              </button>
            ) : (
              <button
                className="rounded-lg bg-green-500 px-3 py-2 active:scale-95"
                onClick={() => setIsActive((prev) => !prev)}
              >
                <ShutdownIcon className="w-4 text-white" />
              </button>
            ))}
        </>
      );
    },
    minWidth: 50,
    maxWidth: 50,
  },
  {
    Header: () => <>Details</>,
    accessor: 'details',
    // @ts-ignore
    Cell: ({ cell: { value } }) => {
      const { openModal } = useModal();

      return (
        <div className="w-full">
          {value && (
            <button
              className="rounded-lg px-2 py-1 hover:bg-gray-200/50"
              onClick={() => openModal('DCA_ORDER_HISTORY')}
            >
              <MoreIcon className="w-6 text-dark dark:text-white" />
            </button>
          )}
        </div>
      );
    },
    minWidth: 70,
    maxWidth: 80,
  },
];

export default function InvestmentTable() {
  const data = React.useMemo(() => investmentData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  return <InvestmentAccordionTable columns={columns} data={data} />;
}
