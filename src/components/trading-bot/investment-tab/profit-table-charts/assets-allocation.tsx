'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const data = [
  {
    sales: 70.47,
    fill: '#FF0000',
    name: 'BTC',
  },
  {
    sales: 60.69,
    fill: '#E1306C',
    name: 'BTC',
  },
  {
    sales: 60.69,
    fill: '#1DA1F2',
    name: 'BTC',
  },
  {
    sales: 50.22,
    fill: '#4267B2',
    name: 'BTC',
  },
];

export default function AssetsAllocation() {
  return (
    <>
      <div className="h-full w-full rounded-lg border border-gray-100 bg-gray-50/40 p-5 pb-4 pt-4 dark:border-[#222A35] dark:bg-[#222A35] lg:p-8">
        <h2 className="text-base font-medium text-dark dark:text-gray-200 lg:text-lg">
          Asset Allocation
        </h2>
        <div className="relative h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="25%"
              outerRadius="100%"
              barSize={20}
              data={data}
              startAngle={90}
              endAngle={-180}
            >
              <RadialBar
                label={{ fill: 'transparent', position: 'insideStart' }}
                background
                dataKey="sales"
                className="[&_.recharts-radial-bar-background-sector]:fill-gray-100"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute left-14 top-7 z-10 h-40 w-40 rounded-md">
            {data.map((item, index) => (
              <p key={`asset-allocation-data-${index}`}>{item.name}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
