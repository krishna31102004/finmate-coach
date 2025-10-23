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
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-surface dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow h-16">
      <div className="flex items-center space-x-3">
        <IconComponent className="w-5 h-5 text-primary dark:text-blue-400" />
        <span className="capitalize text-sm font-medium text-textHeading dark:text-slate-100">{category.name}</span>
      </div>
      <span className="text-sm font-semibold text-textBody dark:text-slate-400">${category.amount.toFixed(2)}</span>
    </div>
  );
}
