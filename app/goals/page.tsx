"use client";

import React from 'react';
import useAppStore from '@/store/useAppStore';
import GoalCard from '@/components/GoalCard';

export default function GoalsPage() {
  const goals = useAppStore((state) => state.goals);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-textHeading dark:text-slate-100">Savings & Goals</h1>
      <div className="space-y-3">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <p className="text-textBody dark:text-slate-300">No goals yet. Add one on the Dashboard!</p>
        )}
      </div>
    </main>
  );
}
