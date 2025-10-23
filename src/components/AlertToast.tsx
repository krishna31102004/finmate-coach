import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Coffee, CheckCircle, LucideIcon, Bell } from 'lucide-react';

interface Alert {
  id: string;
  message: string;
}

// Determine icon and gradient classes based on the alert message.
function useAlertVisuals(message: string): { Icon: LucideIcon; gradient: string; darkGradient: string; borderClass: string } {
  const lower = message.toLowerCase();
  if (lower.includes('food')) {
    // Deeper red gradient for food spending alerts in dark mode
    return {
      Icon: Utensils,
      gradient: 'from-rose-100 via-rose-50 to-rose-50',
      darkGradient: 'dark:from-rose-900/40 dark:via-rose-900/30 dark:to-rose-900/20',
      borderClass: 'border-rose-200 dark:border-rose-800/60',
    };
  }
  if (lower.includes('subscription')) {
    // Amber gradient for subscription alerts
    return {
      Icon: Coffee,
      gradient: 'from-amber-100 via-amber-50 to-yellow-50',
      darkGradient: 'dark:from-amber-900/40 dark:via-amber-900/30 dark:to-amber-900/20',
      borderClass: 'border-amber-200 dark:border-amber-800/60',
    };
  }
  if (lower.includes('great')) {
    return {
      Icon: CheckCircle,
      gradient: 'from-green-200 via-green-100 to-green-50',
      darkGradient: 'dark:from-green-900/30 dark:via-green-900/20 dark:to-green-900/10',
      borderClass: 'border-green-200 dark:border-green-800/60',
    };
  }
  return {
    Icon: Bell,
    gradient: 'from-blue-200 via-blue-100 to-blue-50',
    darkGradient: 'dark:from-slate-800/60 dark:to-slate-800/30',
    borderClass: 'border-blue-200 dark:border-slate-700',
  };
}

/**
 * AlertToast renders a soft alert card with an icon and dismiss button.
 * The card slides in and can be dismissed with a fade out.
 */
export default function AlertToast({ alert }: { alert: Alert }) {
  const [visible, setVisible] = useState(true);
  const { Icon, gradient, darkGradient, borderClass } = useAlertVisuals(alert.message);
  if (!visible) return null;
  return (
    <div className={`relative mb-2 px-4 py-3 rounded-xl border bg-gradient-to-br ${gradient} ${darkGradient} ${borderClass} flex items-center space-x-3 text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
      <Icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      <span className="flex-1">{alert.message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto text-sm px-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none transition-colors"
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
}
