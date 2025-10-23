import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Film,
  Bus,
  BookOpen,
  Home,
  HeartPulse,
  Dumbbell,
  LucideIcon,
  Wallet,
  Gamepad2,
} from 'lucide-react';
import { getCategoryType } from '../lib/budget';

interface Category {
  name: string;
  amount: number;
}

// Mapping of category names to icons. Any unknown category falls back to Wallet icon.
const iconMap: Record<string, LucideIcon> = {
  food: Utensils,
  entertainment: Film,
  transportation: Bus,
  education: BookOpen,
  utilities: Home,
  health: HeartPulse,
  fitness: Dumbbell,
  games: Gamepad2,
};

export default function CategoryCard({ category }: { category: Category }) {
  const IconComponent = iconMap[category.name] || Wallet;
  const type = getCategoryType(category.name);
  const isNeeds = type === 'needs';
  
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-surface dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <IconComponent className="w-5 h-5 text-primary dark:text-blue-400 flex-shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="capitalize text-sm font-medium text-textHeading dark:text-slate-100">{category.name}</span>
          <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full w-fit ${
            isNeeds 
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200' 
              : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-200'
          }`}>
            {isNeeds ? 'Needs' : 'Wants'}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold text-textBody dark:text-slate-400 flex-shrink-0">${category.amount.toFixed(2)}</span>
    </div>
  );
}
