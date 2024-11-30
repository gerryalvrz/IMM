'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import cn from '@/utils/cn';

const data = [
  {
    name: 'Page A',
    uv: 8.0,
    pv: 4.0,
    amt: 2,
  },
  {
    name: 'Page B',
    uv: 6.0,
    pv: 3.0,
    amt: 3,
  },
  {
    name: 'Page C',
    uv: -4.0,
    pv: -2.0,
    amt: 4,
  },
  {
    name: 'Page D',
    uv: 5.0,
    pv: 3.0,
    amt: 3,
  },
  {
    name: 'Page E',
    uv: 0.0,
    pv: 4.0,
    amt: 2,
  },
  {
    name: 'Page F',
    uv: -2.0,
    pv: -3.0,
    amt: 4,
  },
  {
    name: 'Page G',
    uv: -4.0,
    pv: -2.0,
    amt: 8,
  },
];
const COLORS = ['#10B981', '#EF4444', '#8A4CF2'];

export function RoundedTopBar({
  x,
  y,
  width,
  height,
  fillOpacity,
  className,
  cornerRadius = 6,
}: any) {
  const roundedHeight = Math.max(cornerRadius, height);
  const path = `
    M${x},${y + roundedHeight}
    L${x},${y + cornerRadius}
    Q${x},${y} ${x + cornerRadius},${y}
    L${x + width - cornerRadius},${y}
    Q${x + width},${y} ${x + width},${y + cornerRadius}
    L${x + width},${y + roundedHeight}
    Z
  `;
  return (
    <path
      d={path}
      fillOpacity={fillOpacity}
      className={cn('fill-[#d4dcfa] dark:fill-[#7c88b2]', className)}
    />
  );
}

export default function DailyProfits() {
  return (
    <div className="w-full rounded-lg border border-gray-100 bg-gray-50/40 p-5 dark:border-[#222A35] dark:bg-[#222A35] lg:p-8">
      <h2 className="text-base font-medium text-dark dark:text-gray-200 lg:text-lg">
        Daily Profits
      </h2>
      <div className="my-3 h-[250px] w-full md:mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-x-12 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            data={data}
            barSize={6}
          >
            <CartesianGrid strokeWidth="2 2" strokeOpacity={0.435} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />

            <Bar
              dataKey="pv"
              fill="#10B981"
              stackId="stack"
              // shape={
              //   <RoundedTopBar
              //     cornerRadius={4}
              //     className="dark:[fill-opacity:1]"
              //   />
              // }
            />
            <Bar
              dataKey="uv"
              fill="#EF4444"
              stackId="stack"
              // shape={
              //   <RoundedTopBar
              //     cornerRadius={4}
              //     className="dark:[fill-opacity:1]"
              //   />
              // }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
