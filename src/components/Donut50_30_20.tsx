'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { Split } from '../lib/budget';

interface Donut50_30_20Props {
  split: Split;
}

const COLORS = {
  needs: '#3b82f6', // blue-500
  wants: '#14b8a6', // teal-500
  savings: '#22c55e', // green-500
};

export default function Donut50_30_20({ split }: Donut50_30_20Props) {
  const data = [
    { name: 'Needs (50%)', value: split.needs.plan, color: COLORS.needs },
    { name: 'Wants (30%)', value: split.wants.plan, color: COLORS.wants },
    { name: 'Savings (20%)', value: split.savings.plan, color: COLORS.savings },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold fill-textHeading dark:fill-slate-100"
          >
            50/30/20
          </text>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Needs (50%)
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-100">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span> Wants (30%)
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Savings (20%)
        </span>
      </div>
    </div>
  );
}

