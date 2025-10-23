import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContributionModal from './ContributionModal';
import useAppStore from '@/store/useAppStore';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

/**
 * GoalCard displays a savings goal with an animated progress bar and an add button.
 * When the user contributes, the progress bar animates smoothly.
 */
export default function GoalCard({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const addContribution = useAppStore((state) => state.addContribution);
  const progress = Math.min(100, (goal.current / goal.target) * 100);
  // Choose progress bar colour: gold (secondary) for in-progress, green (accent) when complete.
  const progressColor =
    progress >= 100
      ? 'bg-accent'
      : 'bg-gradient-to-r from-secondary via-accent/70 to-accent/40';
  return (
    <div className="rounded-xl bg-white/90 dark:bg-slate-800/80 border border-surface dark:border-slate-700/60 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow h-full">
      <h3 className="font-medium text-textHeading dark:text-slate-100">{goal.name}</h3>
      <div className="relative w-full bg-surface dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${progressColor}`}
          style={{ width: `${progress}%`, transition: 'width 0.8s ease-in-out' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
        <span>
          ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
        </span>
        <button
          className="text-primary dark:text-blue-400 underline hover:opacity-80 focus:outline-none text-sm"
          onClick={() => setOpen(true)}
        >
          Add
        </button>
      </div>
      {open && (
        <ContributionModal
          goal={goal}
          onClose={() => setOpen(false)}
          onAdd={(amount) => {
            addContribution(goal.id, amount);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
