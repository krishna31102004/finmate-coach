'use client';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnimatePresence } from 'framer-motion';
import type { Split } from '../lib/budget';
import { usd } from '../lib/budget';

interface Donut503020Props {
  split: Split;
  onSelect: (key: 'needs' | 'wants' | 'savings') => void;
}

const COLORS = {
  needs: '#3b82f6',
  wants: '#14b8a6',
  savings: '#22c55e',
};

const LABELS = {
  needs: 'Needs',
  wants: 'Wants',
  savings: 'Savings',
};

type BucketKey = 'needs' | 'wants' | 'savings';

export default function Donut503020({ split, onSelect }: Donut503020Props) {
  const [activeKey, setActiveKey] = useState<BucketKey | null>(null);

  const data = [
    { name: 'needs', value: split.needs.plan, spent: split.needs.spent, pct: 50 },
    { name: 'wants', value: split.wants.plan, spent: split.wants.spent, pct: 30 },
    { name: 'savings', value: split.savings.plan, spent: split.savings.actual, pct: 20 },
  ];

  const handleMouseEnter = (key: BucketKey) => {
    setActiveKey(key);
  };

  const handleMouseLeave = () => {
    setActiveKey(null);
  };

  const handleClick = (key: BucketKey) => {
    onSelect(key);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const key = entry.name as BucketKey;
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-sm">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {LABELS[key]} ({entry.pct}%)
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Plan: {usd.format(entry.value)}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            {key === 'savings' ? 'Saved' : 'Spent'}: {usd.format(entry.spent)}
          </p>
        </div>
      );
    }
    return null;
  };

  const activeData = activeKey ? data.find(d => d.name === activeKey) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={280} height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => handleMouseEnter(data[index].name as BucketKey)}
              onMouseLeave={handleMouseLeave}
              onClick={(_, index) => handleClick(data[index].name as BucketKey)}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as BucketKey]}
                  opacity={activeKey && activeKey !== entry.name ? 0.4 : 1}
                  className="transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activeData ? (
              <div
                key={activeKey}
                className="text-center animate-in fade-in zoom-in-95 duration-200"
              >
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {LABELS[activeKey!]}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {usd.format(activeData.value)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  ({activeData.pct}%)
                </p>
              </div>
            ) : (
              <div
                key="default"
                className="text-center animate-in fade-in duration-200"
              >
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  50/30/20
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Legend chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleClick('needs')}
          onMouseEnter={() => handleMouseEnter('needs')}
          onMouseLeave={handleMouseLeave}
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="View Needs details"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Needs (50%)
        </button>
        <button
          onClick={() => handleClick('wants')}
          onMouseEnter={() => handleMouseEnter('wants')}
          onMouseLeave={handleMouseLeave}
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-100 hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
          aria-label="View Wants details"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500"></span> Wants (30%)
        </button>
        <button
          onClick={() => handleClick('savings')}
          onMouseEnter={() => handleMouseEnter('savings')}
          onMouseLeave={handleMouseLeave}
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="View Savings details"
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Savings (20%)
        </button>
      </div>
    </div>
  );
}

