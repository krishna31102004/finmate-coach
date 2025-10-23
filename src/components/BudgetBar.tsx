import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  label: string;
  spent: number;
  budget: number;
  /**
   * Variant to determine gradient colours for the bar. Accepts
   * 'needs', 'wants' or 'savings'. Defaults to 'needs'.
   */
  variant?: 'needs' | 'wants' | 'savings';
}

/**
 * BudgetBar displays a progress bar with a gradient fill and animated width.
 * It also shows the spending amount relative to the budget and a percentage pill.
 */
export default function BudgetBar({ label, spent, budget, variant = 'needs' }: Props) {
  const percentage = budget === 0 ? 0 : Math.min(100, (spent / budget) * 100);
  const formattedPercentage = Math.round(percentage);
  // Determine gradient classes based on variant using the updated palette.
  // Needs uses the primary blue; Wants uses a teal gradient; Savings uses the accent green.
  let gradient;
  switch (variant) {
    case 'wants':
      // teal palette for discretionary spending
      gradient = 'from-teal-400 via-teal-300 to-teal-200';
      break;
    case 'savings':
      // green palette for savings
      gradient = 'from-accent via-accent/60 to-accent/20';
      break;
    case 'needs':
    default:
      // blue palette for needs
      gradient = 'from-primary via-primary/60 to-primary/20';
      break;
  }
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline text-sm mb-1">
        <span className="capitalize font-medium text-textHeading dark:text-slate-200">{label}</span>
        <span className="text-xs text-textBody dark:text-slate-300">
          ${spent.toFixed(2)} / ${budget.toFixed(2)}
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          style={{ width: `${percentage}%`, transition: 'width 0.8s ease-in-out' }}
        />
        {/* Percentage bubble */}
        <div className="absolute -top-5 right-0 transform translate-x-1/2">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent dark:bg-green-600 text-white shadow-md">
            {formattedPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
