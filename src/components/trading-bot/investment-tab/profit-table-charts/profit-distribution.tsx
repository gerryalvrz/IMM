'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import useMedia from 'react-use/lib/useMedia';
import SimpleBar from '@/components/ui/simplebar';

const data = [
  { x: 5.12, y: 200, z: 200 },
  { x: -25.98, y: 100, z: 260 },
  { x: -62.25, y: 300, z: 400 },
];

function renderCustomizedLabel(props: any) {
  const { x, y, width, height, value } = props;
  const radius = 20;

  // console.log(value);
  let fillColor = '#10B981';
  if (value < 0) fillColor = '#EF4444';

  return (
    <g>
      {/* <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" /> */}
      <rect
        x={x + width / 2}
        y={y + height / 2}
        width={100}
        height="36"
        fill={fillColor}
      />
      <text
        x={x + 100 / 2}
        y={y + height * 2.5}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    </g>
  );
}

export default function ProfitDistribution() {
  const isTablet = useMedia('(max-width: 820px)', false);
  const isDesktop = useMedia('(max-width: 1920px)', false);

  return (
    <div className="w-full rounded-lg border border-gray-100 bg-gray-50/40 p-5 dark:border-[#222A35] dark:bg-[#222A35] lg:p-8">
      <h2 className="text-base font-medium text-dark dark:text-gray-200 lg:text-lg">
        Profit Distribution
      </h2>
      <SimpleBar>
        <div className="my-3 h-[250px] w-full md:mb-4">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '500px' })}
            {...(isDesktop && { minWidth: '470px' })}
          >
            <ScatterChart
              // className="[&_.recharts-bar-rectangles]:fill-[#E2E8F0] dark:[&_.recharts-bar-rectangles]:fill-[#334155] [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-x-7 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-14"
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-x-12 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-horizontal]:opacity-0 [&_.recharts-scatter-symbol]:hidden"
              margin={{
                top: 5,
                left: 25,
              }}
            >
              <CartesianGrid strokeWidth="2 2" strokeOpacity={0.09} />
              <XAxis
                type="number"
                dataKey="x"
                name="stature"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="weight"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="A school" data={data} fill="#8884d8">
                <LabelList dataKey="x" content={renderCustomizedLabel} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </div>
  );
}
