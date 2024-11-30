'use client';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import SimpleBar from '@/components/ui/simplebar';
import useMedia from 'react-use/lib/useMedia';
import cn from '@/utils/cn';

const data = [
  {
    month: 'Jan',
    creationTime: 4,
    responseTime: 3,
  },
  {
    month: 'Feb',
    creationTime: 2,
    responseTime: 5,
  },
  {
    month: 'Mar',
    creationTime: 3,
    responseTime: 4,
  },
  {
    month: 'Apr',
    creationTime: 4,
    responseTime: 2,
  },
  {
    month: 'May',
    creationTime: 4,
    responseTime: 6,
  },
  {
    month: 'Jun',
    creationTime: 5,
    responseTime: 3,
  },
  {
    month: 'Jul',
    creationTime: 3,
    responseTime: 4,
  },
  {
    month: 'Aug',
    creationTime: 4,
    responseTime: 3,
  },
  {
    month: 'Sep',
    creationTime: 5,
    responseTime: 4,
  },
  {
    month: 'Oct',
    creationTime: 5,
    responseTime: 4,
  },
  {
    month: 'Nov',
    creationTime: 6,
    responseTime: 2,
  },
  {
    month: 'Dec',
    creationTime: 7,
    responseTime: 2,
  },
];

export default function OpenOrderChart({ className }: { className?: string }) {
  const isTablet = useMedia('(max-width: 820px)', false);
  return (
    <SimpleBar>
      <div className={cn('h-48 w-full', className)}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          {...(isTablet && { minWidth: '700px' })}
        >
          <AreaChart
            data={data}
            margin={{
              left: -5,
              right: 5,
              bottom: 10,
            }}
            className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
          >
            <defs>
              <linearGradient id="newCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffdadf" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="oldCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#99DC9A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="natural"
              dataKey="responseTime"
              stroke="#B355E2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#newCustomer)"
            />
            <Area
              type="natural"
              dataKey="creationTime"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#oldCustomer)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimpleBar>
  );
}
