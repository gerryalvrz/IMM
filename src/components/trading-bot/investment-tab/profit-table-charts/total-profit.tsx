'use client';

import {
  Area,
  Bar,
  XAxis,
  YAxis,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';
import cn from '@/utils/cn';
import useMedia from 'react-use/lib/useMedia';
import SimpleBar from '@/components/ui/simplebar';

const data = [
  {
    day: 'Mon',
    mobile: 50,
    desktop: 39,
    others: 30,
  },
  {
    day: 'Tue',
    mobile: 40,
    desktop: 45,
    others: 20,
  },
  {
    day: 'Thu',
    mobile: 37,
    desktop: 50,
    others: 32,
  },
  {
    day: 'Wed',
    mobile: 30,
    desktop: 46,
    others: 17,
  },
  {
    day: 'Fri',
    mobile: 38,
    desktop: 41,
    others: 23,
  },
  {
    day: 'Sat',
    mobile: 30,
    desktop: 50,
    others: 28,
  },
  {
    day: 'Sun',
    mobile: 34,
    desktop: 40,
    others: 35,
  },
  {
    day: 'Mon',
    mobile: 32,
    desktop: 45,
    others: 23,
  },
  {
    day: 'Tue',
    mobile: 40,
    desktop: 33,
    others: 10,
  },
  {
    day: 'Thu',
    mobile: 40,
    desktop: 45,
    others: 20,
  },
  {
    day: 'Wed',
    mobile: 30,
    desktop: 40,
    others: 30,
  },
  {
    day: 'Fri',
    mobile: 42,
    desktop: 35,
    others: 39,
  },
];

const COLORS = ['#B355E2', '#10B981', '#334155'];

export function RoundedTopBarFill({
  x,
  y,
  width,
  height,
  fillOpacity,
  fill,
  stroke,
  strokeWidth,
  cornerRadius = 6,
  className,
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
      fill={fill}
      fillOpacity={fillOpacity}
      {...(stroke && { stroke })}
      {...(strokeWidth && { strokeWidth })}
      className={cn(className)}
    />
  );
}

function RenderQuarterTick(tickProps: any) {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return null;
}

export default function TotalProfit() {
  const isTablet = useMedia('(max-width: 820px)', false);
  return (
    <>
      <div className="h-full w-full flex-grow rounded-lg border border-gray-100 bg-gray-50/40 p-5 pb-4 pt-4 dark:border-[#222A35] dark:bg-[#222A35] lg:p-8">
        <h2 className="text-base font-medium text-dark dark:text-gray-200 lg:text-lg">
          Total Profits
        </h2>
        <SimpleBar>
          <div className="h-96 w-full pt-3">
            <ResponsiveContainer
              width="100%"
              height="100%"
              {...(isTablet && { minWidth: '700px' })}
            >
              <ComposedChart
                data={data}
                margin={{
                  left: -28,
                }}
                barSize={14}
                className="[&_.recharts-bar-rectangles]:fill-[#E2E8F0] dark:[&_.recharts-bar-rectangles]:fill-[#334155] [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-6"
              >
                <defs>
                  <linearGradient
                    id="deviceSessionsMobile"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#F0F1FF"
                      className=" [stop-opacity:0.25] dark:[stop-opacity:0.2]"
                    />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="deviceSessionsDesktop"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#F0F1FF"
                      className="[stop-opacity:0.25] dark:[stop-opacity:0.2]"
                    />
                    <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={<RenderQuarterTick />}
                  height={1}
                  scale="band"
                  xAxisId="quarter"
                />
                <YAxis axisLine={false} tickLine={false} />
                {/* <Tooltip content={<CustomTooltip />} /> */}
                <Area
                  type="monotone"
                  dataKey="mobile"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#deviceSessionsMobile)"
                />
                <Area
                  type="monotone"
                  dataKey="desktop"
                  stroke={COLORS[1]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#deviceSessionsDesktop)"
                />
                <Bar
                  dataKey="others"
                  // fill={COLORS[2]}
                  shape={
                    <RoundedTopBarFill
                      cornerRadius={4}
                      className="dark:[fill-opacity:0.6]"
                    />
                  }
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SimpleBar>
      </div>
    </>
  );
}
