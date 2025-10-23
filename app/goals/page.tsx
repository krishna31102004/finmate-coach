"use client";

import React, { useState } from 'react';
import useAppStore from '@/store/useAppStore';
import GoalCard from '@/components/GoalCard';

export default function GoalsPage() {
  const goals = useAppStore((state) => state.goals);
  const [roundUpEnabled, setRoundUpEnabled] = useState(false);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Savings & Goals</h1>
      <div className="flex items-center space-x-2 mb-4">
        <label className="font-medium">Round‑up Savings</label>
        <input
          type="checkbox"
          checked={roundUpEnabled}
          onChange={() => setRoundUpEnabled(!roundUpEnabled)}
        />
      </div>
      <div>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </main>
  );
}
