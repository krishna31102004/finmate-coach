"use client";

import React, { useState, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import CategoryCard from '@/components/CategoryCard';
import GoalCard from '@/components/GoalCard';
import SuggestionCard from '@/components/SuggestionCard';
import AlertToast from '@/components/AlertToast';
import BudgetBar from '@/components/BudgetBar';
import Donut503020 from '@/components/Donut503020';
import { motion } from 'framer-motion';
import { User, Home as HomeIcon, Music, PiggyBank, Moon, Sun, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { formatCurrency, getDaysRemainingInWeek, getWeeklySpent, getResetDayName, getCurrentWeekKey, computeWeeklySplit, getWeekTransactions, getWeekRange, usd } from '@/lib/budget';
import { useRouter } from 'next/navigation';
import categoriesMap from '@/data/categories.json';

export default function Dashboard() {
  const {
    transactions,
    categoriesTotals,
    budgets,
    goals,
    alerts,
    suggestions,
    ui,
    profile,
    setLargeText,
    setDarkMode,
    loadSeeds,
    resetAll,
    hasData,
    dismissNeedsAlert,
  } = useAppStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const router = useRouter();

  // Wait for hydration to complete before showing store data
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasAnyData = isHydrated ? hasData() : false;
  
  // Compute 50/30/20 split using the new utility
  const weekTxs = getWeekTransactions(transactions);
  const goalContributions = goals.reduce((sum, g) => sum + g.current, 0);
  const split = computeWeeklySplit(profile, weekTxs, categoriesMap, categoriesTotals, goalContributions);
  
  // Handle donut segment clicks
  const handleDonutSelect = (key: 'needs' | 'wants' | 'savings') => {
    const targetId = key === 'savings' ? 'goals' : key;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief highlight effect
      element.classList.add('ring-4', 'ring-blue-400', 'dark:ring-blue-600', 'transition-all', 'duration-300');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-blue-400', 'dark:ring-blue-600');
      }, 1500);
    }
  };

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

  // Calculate wallet snapshot values
  const daysRemaining = getDaysRemainingInWeek();
  const totalSpent = split.needs.spent + split.wants.spent;
  const spendingLeft = Math.max(0, split.spendingPlan - totalSpent);
  const safePerDay = daysRemaining > 0 ? spendingLeft / daysRemaining : 0;
  const resetDay = getResetDayName();
  const weekRange = getWeekRange();

  // Check if Needs budget is full
  const currentWeekKey = getCurrentWeekKey();
  const showNeedsAlert = isHydrated && split.needs.pct >= 100 && ui.needsAlertDismissed !== currentWeekKey;

  const handleDismissNeedsAlert = () => {
    dismissNeedsAlert(currentWeekKey);
  };
  
  // Compute total saved across all goals for the motivational banner
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);
  
  const handleExplainDashboard = () => {
    // @ts-ignore - dynamic query parameter
    router.push('/coach?prefill=' + encodeURIComponent('Explain how my dashboard numbers add up this week and what I can safely spend.'));
  };

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
      {/* Professional hero header */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-[#EEF2FF] to-[#F5F7FF] dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl md:text-5xl">🌱</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hi Krishna!
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                {isHydrated && hasAnyData ? `You're doing great — you've saved ${formatCurrency(totalSaved)} this week 🎉` : 'Welcome to FinMate! Load demo data to get started.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Large text toggle - 40px hit area */}
            <button
              onClick={() => setLargeText(!ui.largeText)}
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/70 dark:bg-gray-700/70 border border-slate-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm font-bold text-slate-700 dark:text-gray-200 transition-colors ${ui.largeText ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              aria-label="Toggle large text"
              aria-pressed={ui.largeText}
            >
              A
            </button>
            {/* Dark mode toggle - 40px hit area */}
            <button
              onClick={() => setDarkMode(!ui.darkMode)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 dark:bg-gray-700/70 border border-slate-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              aria-label="Toggle dark mode"
              aria-pressed={ui.darkMode}
            >
              {ui.darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-gray-200" />}
            </button>
            {/* Profile dropdown - 40px hit area */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 dark:bg-gray-700/70 border border-slate-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                aria-label="User menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <User className="w-5 h-5 text-slate-700 dark:text-gray-200" />
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
      </section>
      
      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700" />

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-textHeading dark:text-slate-200">
                💰 Wallet Snapshot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Today's quick summary of your weekly money plan.
              </p>
            </div>
            <button
              onClick={handleExplainDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label="Explain my dashboard in Coach"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Explain my dashboard
            </button>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-200/30 to-purple-200/20 dark:from-indigo-900/30 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/50 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-full">
                Week of {weekRange}
              </span>
            </div>
            <div className="space-y-3">
              {/* Row 1: Spending Plan */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-textBody dark:text-slate-200">
                  Spending plan (Needs + Wants):
                </span>
                <span className="text-xl md:text-2xl font-bold text-textHeading dark:text-white">
                  {usd.format(split.spendingPlan)}
                </span>
              </div>
              
              {/* Row 2: Savings Target */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-textBody dark:text-slate-200">
                  Savings target (20%):
                </span>
                <span className="text-xl md:text-2xl font-bold text-textHeading dark:text-white">
                  {usd.format(split.savingsTarget)}
                </span>
              </div>
              
              {/* Separator */}
              <div className="border-t border-indigo-300/40 dark:border-indigo-700/40"></div>
              
              {/* Row 3: Total */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-textBody dark:text-slate-200">
                  Total weekly money:
                </span>
                <span className="text-2xl md:text-3xl font-bold text-textHeading dark:text-white">
                  {usd.format(split.totalWeeklyMoney)}
                </span>
              </div>
              
              {/* Safe to spend per day */}
              <div className="pt-2 border-t border-indigo-300/40 dark:border-indigo-700/40">
                <p className="text-sm text-textBody dark:text-slate-200">
                  Safe-to-spend per day: <span className="font-semibold text-lg">{usd.format(safePerDay)}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Spending plan excludes savings. Savings goes to your goals. Resets {resetDay}.
                </p>
              </div>
            </div>
          </div>
          {/* Over spending plan note */}
          {(split.needs.over + split.wants.over > 0) && (
            <div className="mt-3 text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-200 dark:bg-rose-900/30 dark:border-rose-800/60 rounded-md px-3 py-2 text-sm inline-flex items-center gap-2">
              <span className="font-medium">⚠️</span>
              <span>Over weekly spending plan by {usd.format(split.needs.over + split.wants.over)}</span>
            </div>
          )}
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
              We split your week's money into Needs (50%), Wants (30%), Savings (20%).
            </p>
          </div>
          
          {/* Interactive Donut Chart */}
          <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-surface dark:border-slate-700/60 shadow-md">
            <Donut503020 split={split} onSelect={handleDonutSelect} />
          </div>
          
          {/* How this is calculated accordion */}
          <div className="rounded-xl border border-surface dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 overflow-hidden">
            <button
              onClick={() => setIsCalcOpen(!isCalcOpen)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-expanded={isCalcOpen}
              aria-controls="calculation-details"
            >
              <span className="text-sm font-semibold text-textHeading dark:text-slate-100">
                How this is calculated
              </span>
              {isCalcOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              )}
            </button>
            {isCalcOpen && (
              <div 
                id="calculation-details" 
                className="px-5 py-4 border-t border-surface dark:border-slate-700/60 text-sm text-textBody dark:text-slate-300 space-y-2 bg-gray-50/50 dark:bg-slate-900/30"
              >
                <p><strong>Weekly plan (from Settings or default):</strong> {usd.format(split.totalWeeklyMoney)}</p>
                <p><strong>Needs (50% of {usd.format(split.totalWeeklyMoney)}):</strong> {usd.format(split.needs.plan)}</p>
                <p><strong>Wants (30% of {usd.format(split.totalWeeklyMoney)}):</strong> {usd.format(split.wants.plan)}</p>
                <p><strong>Savings (20% of {usd.format(split.totalWeeklyMoney)}):</strong> {usd.format(split.savings.plan)}</p>
                <p><strong>Spending plan:</strong> {usd.format(split.needs.plan)} + {usd.format(split.wants.plan)} = {usd.format(split.spendingPlan)}</p>
                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-semibold mb-1">This week's activity:</p>
                  <p><strong>Needs spent:</strong> {usd.format(split.needs.spent)}</p>
                  <p><strong>Wants spent:</strong> {usd.format(split.wants.spent)}</p>
                  <p><strong>Left to spend:</strong> {usd.format(spendingLeft)}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Needs card */}
            <div id="needs" className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <HomeIcon className="w-5 h-5 text-primary dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Needs</h3>
              </div>
              <BudgetBar label="Needs" spent={split.needs.spent} budget={split.needs.plan} variant="needs" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {usd.format(split.needs.spent)} / {usd.format(split.needs.plan)} ({split.needs.pct}%) · {usd.format(split.needs.left)} left
              </p>
              {split.needs.over > 0 && (
                <p className="mt-2 text-xs text-rose-700 bg-rose-50 dark:text-rose-200 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/60 rounded px-2 py-1 inline-flex items-center gap-1">
                  Over plan by {usd.format(split.needs.over)}
                </p>
              )}
              {/* Needs full alert */}
              {showNeedsAlert && (
                <div className="mt-3 rounded-lg border bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/20 dark:text-rose-100 dark:border-rose-800/60 px-3 py-2 text-xs flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span>
                      Heads up: your <strong>Needs</strong> budget is full. Try holding non-urgent purchases or trimming a utility.
                    </span>
                    <button 
                      onClick={handleDismissNeedsAlert} 
                      className="opacity-70 hover:opacity-100 text-base leading-none focus:outline-none transition-opacity flex-shrink-0"
                      aria-label="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsCalcOpen(true);
                      setTimeout(() => {
                        document.getElementById('calculation-details')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className="text-rose-700 dark:text-rose-300 underline hover:no-underline text-left focus:outline-none focus:ring-1 focus:ring-rose-400 rounded"
                  >
                    Learn why →
                  </button>
                </div>
              )}
            </div>
            {/* Wants card */}
            <div id="wants" className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Music className="w-5 h-5 text-secondary dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Wants</h3>
              </div>
              <BudgetBar label="Wants" spent={split.wants.spent} budget={split.wants.plan} variant="wants" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {usd.format(split.wants.spent)} / {usd.format(split.wants.plan)} ({split.wants.pct}%) · {usd.format(split.wants.left)} left
              </p>
              {split.wants.over > 0 && (
                <p className="mt-2 text-xs text-rose-700 bg-rose-50 dark:text-rose-200 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/60 rounded px-2 py-1 inline-flex items-center gap-1">
                  Over plan by {usd.format(split.wants.over)}
                </p>
              )}
            </div>
            {/* Savings card - link to goals */}
            <div className="flex flex-col justify-between p-4 bg-white/90 dark:bg-slate-800/80 rounded-xl shadow-md border border-surface dark:border-slate-700/60 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <PiggyBank className="w-5 h-5 text-accent dark:text-green-400" />
                <h3 className="text-lg font-semibold text-textHeading dark:text-slate-100 tracking-tight">Savings</h3>
              </div>
              <BudgetBar label="Savings" spent={split.savings.actual} budget={split.savings.plan} variant="savings" />
              <p className="text-xs text-textBody dark:text-slate-300 mt-2">
                {usd.format(split.savings.actual)} / {usd.format(split.savings.plan)} ({split.savings.pct}%) · {usd.format(Math.max(0, split.savings.plan - split.savings.actual))} left
              </p>
              {split.savings.over > 0 && (
                <p className="mt-2 text-xs text-green-700 bg-green-50 dark:text-green-200 dark:bg-green-900/30 border border-green-200 dark:border-green-800/60 rounded px-2 py-1 inline-flex items-center gap-1">
                  🎉 Exceeding target by {usd.format(split.savings.over)}!
                </p>
              )}
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
                {/* Reconciliation note */}
                {(split.reconciliation.needsDelta > 0.01 || split.reconciliation.wantsDelta > 0.01) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 px-2 italic">
                    Note: Category sums differ from weekly totals by {usd.format(split.reconciliation.needsDelta + split.reconciliation.wantsDelta)}. This will correct after recategorization.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-surface dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                No spending yet. Load data to see where your money goes.
              </div>
            )}
          </div>
          <div id="goals" className="space-y-4 transition-all duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-textHeading dark:text-slate-100 mb-1">
                Goals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your savings targets. Add small amounts often.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                This week's savings target: {usd.format(split.savingsTarget)}
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
