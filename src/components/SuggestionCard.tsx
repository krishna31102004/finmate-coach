import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Leaf,
  PiggyBank,
  Heart,
  LucideIcon,
  Home,
  Landmark,
  Briefcase,
} from 'lucide-react';

// Determine icon and color for a suggestion string
function getSuggestionVisuals(
  text: string
): { Icon: LucideIcon; bg: string; border: string; textColor: string } {
  const lower = text.toLowerCase();
  // Pantry or food suggestions get a calming blue card
  if (lower.includes('pantry') || lower.includes('food')) {
    return {
      Icon: Utensils,
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      textColor: 'text-primary',
    };
  }
  // Meal prep suggestions are green for growth
  if (lower.includes('meal')) {
    return {
      Icon: Leaf,
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      textColor: 'text-accent',
    };
  }
  // Saving or investing suggestions use yellow/secondary
  if (lower.includes('save') || lower.includes('invest')) {
    return {
      Icon: PiggyBank,
      bg: 'bg-secondary/10',
      border: 'border-secondary/30',
      textColor: 'text-secondary',
    };
  }
  // Credit or finance suggestions use soft coral (use rose)
  if (lower.includes('credit')) {
    return {
      Icon: Heart,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      textColor: 'text-rose-500',
    };
  }
  // Transport suggestions use violet
  if (lower.includes('transport')) {
    return {
      Icon: Home,
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      textColor: 'text-violet-500',
    };
  }
  // Default suggestions
  return {
    Icon: Briefcase,
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    textColor: 'text-gray-600',
  };
}

interface Props {
  suggestions: string[];
}

/**
 * SuggestionCard lists next best actions as individual cards with icons and gentle hover.
 */
export default function SuggestionCard({ suggestions }: Props) {
  return (
    <div className="space-y-3">
      {suggestions.map((tip, idx) => {
        const { Icon, bg, border, textColor } = getSuggestionVisuals(tip);
        return (
          <div
            key={idx}
            className={`flex items-center space-x-3 p-4 rounded-xl ${bg} ${border} hover:shadow-md transition-shadow`}
          >
            <Icon className={`w-5 h-5 ${textColor}`} />
            <span className={`text-sm font-medium ${textColor}`}>{tip}</span>
          </div>
        );
      })}
    </div>
  );
}
