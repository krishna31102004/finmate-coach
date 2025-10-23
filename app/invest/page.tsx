"use client";

import React, { useState, useMemo } from 'react';
import CompoundChart from '@/components/CompoundChart';
import { projectBalance } from '@/lib/invest';

export default function InvestPage() {
  const [weekly, setWeekly] = useState(10);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const data = useMemo(() => projectBalance(weekly, years, rate), [weekly, years, rate]);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Invest Simulator</h1>
      <div className="space-y-4">
        <label className="block">
          <span className="block mb-1">Weekly Amount: ${weekly}</span>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={weekly}
            onChange={(e) => setWeekly(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="block mb-1">Annual Return (%): {rate}</span>
          <input
            type="range"
            min="4"
            max="15"
            step="1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="block mb-1">Years: {years}</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>
      <CompoundChart data={data} />
      <p className="text-sm text-gray-600">
        Projected balance assumes consistent weekly contributions and a fixed annual return. Actual returns may vary.
      </p>
    </main>
  );
}
