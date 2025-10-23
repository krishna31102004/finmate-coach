"use client";

import React, { useState, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import CategoryCard from '@/components/CategoryCard';
import GoalCard from '@/components/GoalCard';
import SuggestionCard from '@/components/SuggestionCard';
import AlertToast from '@/components/AlertToast';
import BudgetBar from '@/components/BudgetBar';
import { motion } from 'framer-motion';
import { User, Home as HomeIcon, Music, PiggyBank, Moon, Sun, ChevronDown } from 'lucide-react';
import { formatCurrency, getDaysRemainingInWeek, getWeeklySpent, getResetDayName, getCurrentWeekKey } from '@/lib/budget';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const {
    transactions,
    categoriesTotals,
    budgets,
    goals,
    alerts,
    suggestions,
    ui,
    setLargeText,
    setDarkMode,
    loadSeeds,
    resetAll,
    hasData,
    dismissNeedsAlert,
  } = useAppStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Wait for hydration to complete before showing store data
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasAnyData = isHydrated ? hasData() : false;

  // Convert category totals into an array for iteration
  const categoryArray = Object.entries(categoriesTotals).map(([name, amount]) => ({ name, amount }));
  
  // Determine group spending for 50/30/20 progress bars
  const needsCats = ['food', 'utilities', 'health', 'transportation', 'education', 'fitness'];
  const wantsCats = ['entertainment'];
  const groupSpent = { needs: 0, wants: 0, savings: 0 };
  categoryArray.forEach((cat) => {
    if (needsCats.includes(cat.name)) {
      groupSpent.needs += cat.amount;
    } else if (wantsCats.includes(cat.name)) {
      groupSpent.wants += cat.amount;
    } else {
      groupSpent.needs += cat.amount;
    }
  });

  // Calculate wallet snapshot
  const weeklySpent = getWeeklySpent(transactions);
  const plannedWeek = budgets.needs + budgets.wants; // Exclude savings from planned spending
  const leftThisWeek = Math.max(0, plannedWeek - weeklySpent);
  const daysRemaining = getDaysRemainingInWeek();
  const safePerDay = daysRemaining > 0 ? leftThisWeek / daysRemaining : 0;
  const resetDay = getResetDayName();

  // Check if Needs budget is full
  const needsPct = budgets.needs > 0 ? Math.min(100, (groupSpent.needs / budgets.needs) * 100) : 0;
  const currentWeekKey = getCurrentWeekKey();
  const showNeedsAlert = isHydrated && needsPct >= 100 && ui.needsAlertDismissed !== currentWeekKey;

  const handleDismissNeedsAlert = () => {
    dismissNeedsAlert(currentWeekKey);
  };
  
  // Compute total saved across all goals for the motivational banner
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);

  const handleLoadData = () => {
    loadSeeds();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetAll();
    }
  };

  const handleProfileItemClick = (action: string) => {
    setIsProfileOpen(false);
    switch (action) {
      case 'coach':
        router.push('/coach');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
  };

  return (
    <main className="p-4 space-y-6">
      {/* Hero header with greeting, emoji, and quick actions */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-white/80 dark:from-blue-900/20 dark:via-blue-900/10 dark:to-gray-800/80 border border-primary/10 dark:border-blue-700/20 shadow-md space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="text-4xl md:text-5xl">🌱</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textHeading dark:text-gray-100 mb-1">
              Hi Krishna!
            </h1>
            <p className="text-sm md:text-base text-textBody dark:text-gray-300">
              {isHydrated && hasAnyData ? `You're doing great — you've saved ${formatCurrency(totalSaved)} this week 🎉` : 'Welcome to FinMate! Load demo data to get started.'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Large text toggle */}
          <button
            onClick={() => setLargeText(!ui.largeText)}
            className={`p-2 rounded-full bg-white/70 dark:bg-gray-700/70 border border-surface dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 text-sm font-bold text-textBody dark:text-gray-200 transition-colors ${ui.largeText ? 'ring-2 ring-primary dark:ring-blue-400' : ''}`}
            aria-label="Toggle large text"
            aria-pressed={ui.largeText}
          >
            A
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!ui.darkMode)}
            className="p-2 rounded-full bg-white/70 dark:bg-gray-700/70 border border-surface dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
            aria-label="Toggle dark mode"
            aria-pressed={ui.darkMode}
          >
            {ui.darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-textHeading dark:text-gray-200" />}
          </button>
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-full bg-white/70 dark:bg-gray-700/70 border border-surface dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
              aria-label="User menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <User className="w-5 h-5 text-textHeading dark:text-gray-200" />
            </button>
            {isProfileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsProfileOpen(false);
                  }}
                />
                {/* Dropdown menu */}
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-surface dark:border-slate-700 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  role="menu"
                >
                  <button
                    onClick={() => handleProfileItemClick('coach')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-textBody dark:text-slate-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-slate-600 transition-colors"
                    role="menuitem"
                  >
                    Coach tips
                  </button>
                  <button
                    onClick={() => handleProfileItemClick('settings')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-textBody dark:text-slate-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-slate-600 transition-colors border-t border-surface dark:border-slate-700"
                    role="menuitem"
                  >
                    Settings
                  </button>
                  <div className="px-4 py-2 text-xs text-center text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-900">
                    ASU Edition 1.0
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Demo Data Banner */}
      {!hasAnyData && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <h2 className="text-xl font-bold text-textHeading dark:text-gray-100 mb-2">
            👋 Load demo data to explore FinMate
          </h2>
          <p className="text-sm text-textBody dark:text-gray-300 mb-4">
            See how FinMate helps you track spending, set goals, and get personalized coaching.
          </p>
          <button
            onClick={handleLoadData}
            className="px-6 py-3 bg-primary dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors shadow-md"
          >
            Load demo data
          </button>
        </div>
      )}

      {/* Reset Button (when data exists) */}
      {hasAnyData && (
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 ? (
        <section className="space-y-2">
          {alerts.map((alert) => (
            <AlertToast key={alert.id} alert={alert} />
          ))}
        </section>
      ) : hasAnyData && (
        <section className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/60 text-sm text-green-700 dark:text-green-300">
          ✅ No alerts — you're doing great!
        </section>
      )}

      {/* Wallet Snapshot */}
      {hasAnyData && (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-textHeading dark:text-slate-200">
              💰 Wallet Snapshot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Today's quick summary of your weekly money plan.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-200/30 to-purple-200/20 dark:from-indigo-900/30 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/50 shadow-lg">
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-textHeading dark:text-white">
                Spent {formatCurrency(weeklySpent)} of {formatCurrency(plannedWeek)} · {formatCurrency(leftThisWeek)} left
              </p>
              <p className="text-sm text-textBody dark:text-slate-200">
                Safe-to-spend per day: <span className="font-semibold text-lg">{formatCurrency(safePerDay)}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Resets {resetDay}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 50/30/20 Overview Section */}
      {hasAnyData && (
        <section className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-semibold text-textHeading dark:text-slate-100">
                50/30/20 Overview
              </h2>
              <span 
                title="Budget rule: Needs up to 50%, Wants ~30%, Savings at least 20%" 
                className="text-slate-400 dark:text-slate-500 cursor-help text-sm"
                aria-label="Info"
              >
                ⓘ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
              Your budget in three buckets. Aim to keep Needs ≤ 50%.
            </p>
            {/* Legend chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Needs
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-100">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span> Wants
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Savings
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Needs card */}
            <div className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60">
              <div className="flex items-center space-x-2 mb-2">
                <HomeIcon className="w-5 h-5 text-primary dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Needs</h3>
              </div>
              <BudgetBar label="Needs" spent={groupSpent.needs} budget={budgets.needs} variant="needs" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {formatCurrency(groupSpent.needs)} / {formatCurrency(budgets.needs)} · {formatCurrency(Math.max(0, budgets.needs - groupSpent.needs))} left
              </p>
              {/* Needs full alert */}
              {showNeedsAlert && (
                <div className="mt-3 rounded-lg border bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/20 dark:text-rose-100 dark:border-rose-800/60 px-3 py-2 text-xs flex items-start justify-between gap-2">
                  <span>
                    Heads up: your <strong>Needs</strong> budget is full. Try holding non-urgent purchases or trimming a utility.
                  </span>
                  <button 
                    onClick={handleDismissNeedsAlert} 
                    className="opacity-70 hover:opacity-100 text-base leading-none focus:outline-none transition-opacity"
                    aria-label="Dismiss"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {/* Wants card */}
            <div className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60">
              <div className="flex items-center space-x-2 mb-2">
                <Music className="w-5 h-5 text-secondary dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Wants</h3>
              </div>
              <BudgetBar label="Wants" spent={groupSpent.wants} budget={budgets.wants} variant="wants" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {formatCurrency(groupSpent.wants)} / {formatCurrency(budgets.wants)} · {formatCurrency(Math.max(0, budgets.wants - groupSpent.wants))} left
              </p>
            </div>
            {/* Savings card */}
            <div className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60">
              <div className="flex items-center space-x-2 mb-2">
                <PiggyBank className="w-5 h-5 text-accent dark:text-green-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Savings</h3>
              </div>
              <BudgetBar label="Savings" spent={groupSpent.savings} budget={budgets.savings} variant="savings" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {formatCurrency(groupSpent.savings)} / {formatCurrency(budgets.savings)} · {formatCurrency(Math.max(0, budgets.savings - groupSpent.savings))} left
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Categories & Goals Section */}
      {hasAnyData && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-textHeading dark:text-slate-100 mb-1">
                Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where your money went this week.
              </p>
            </div>
            {categoryArray.length > 0 ? (
              <div className="space-y-3">
                {categoryArray.map((cat) => (
                  <CategoryCard key={cat.name} category={cat} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-surface dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                No spending yet. Load data to see where your money goes.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-textHeading dark:text-slate-100 mb-1">
                Goals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your savings targets. Add small amounts often.
              </p>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-surface dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                Create your first goal or load demo data.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next Best Actions */}
      {suggestions.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-textHeading dark:text-slate-100">
              Next Best Actions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Suggestions based on your pattern.
            </p>
          </div>
          <SuggestionCard suggestions={suggestions} />
        </section>
      )}
    </main>
  );
}
