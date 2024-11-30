'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const data = [
  { name: 'Profit', value: 50 },
  { name: 'Loss', value: 20 },
  { name: 'Break Even', value: 30 },
];
const COLORS = ['#10B981', '#EF4444', '#8A4CF2'];

function CustomLabel(props: any) {
  const { cx, cy } = props.viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 5}
        fill="#10B981"
        className="recharts-text recharts-label border border-dark"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="16px">
          + 2.8%
        </tspan>
      </text>
    </>
  );
}

export default function StorageSummary() {
  return (
    <div className="w-full rounded-lg border border-gray-100 bg-gray-50/40 p-5 dark:border-[#222A35] dark:bg-[#222A35] lg:p-8">
      <h2 className="text-base font-medium text-dark dark:text-gray-200 lg:text-lg">
        Win Rate
      </h2>
      <div className="my-3 h-[250px] w-full md:mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
            <Pie
              data={data}
              //   cornerRadius={40}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              fill="#BFDBFE"
              stroke="rgba(0,0,0,0)"
              dataKey="value"
            >
              <Label
                width={10}
                position="center"
                content={<CustomLabel value1={data[1].value} />}
              ></Label>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        {data.map((item, index) => (
          <div
            key={item.name}
            className="mb-4 flex items-center justify-between text-gray-500 last:mb-0 last:border-0 last:pb-0 dark:text-gray-300"
          >
            <div className="flex items-center justify-start">
              <span
                className="me-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <p className="text-sm font-medium">{item.name}</p>
            </div>
            <p>{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
