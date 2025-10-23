import type { Transaction, Profile } from '../store/useAppStore';

export type Split = {
  totalWeeklyMoney: number;
  spendingPlan: number;
  savingsTarget: number;
  needs: { plan: number; spent: number; left: number; over: number; pct: number };
  wants: { plan: number; spent: number; left: number; over: number; pct: number };
  savings: { plan: number; actual: number; over: number; pct: number };
  reconciliation: {
    needsCategoriesSum: number;
    wantsCategoriesSum: number;
    needsDelta: number;
    wantsDelta: number;
  };
};

// Categories that count as Needs (essential)
const NEEDS_CATEGORIES = ['food', 'utilities', 'transportation', 'health', 'education'];

// Categories that count as Wants (discretionary)
const WANTS_CATEGORIES = ['entertainment', 'fitness', 'other'];

export function categorizeTransactions(
  transactions: Transaction[],
  categoriesMap: Record<string, string>
) {
  const totals: Record<string, number> = {};
  transactions.forEach((tx) => {
    const cat = categoriesMap[tx.merchant] ?? 'other';
    totals[cat] = (totals[cat] ?? 0) + tx.amount;
  });
  return totals;
}

export function computeBudgetSummary(categoriesTotals: Record<string, number>) {
  const totalSpent = Object.values(categoriesTotals).reduce((acc, cur) => acc + cur, 0);
  return {
    needs: totalSpent * 0.5,
    wants: totalSpent * 0.3,
    savings: totalSpent * 0.2,
  };
}

export function computeWeeklySplit(
  profile: Profile,
  weekTransactions: Transaction[],
  categoriesMap: Record<string, string>,
  categoriesTotals: Record<string, number>,
  goalContributions: number = 0
): Split {
  // Source of truth: profile.weeklyPlan or default to $500
  const totalWeeklyMoney = profile.weeklyPlan ?? 500;
  
  // 50/30/20 split
  const needsPlan = Math.round(totalWeeklyMoney * 0.5 * 100) / 100;
  const wantsPlan = Math.round(totalWeeklyMoney * 0.3 * 100) / 100;
  const savingsTarget = Math.round(totalWeeklyMoney * 0.2 * 100) / 100;
  const spendingPlan = needsPlan + wantsPlan;
  
  // Calculate actual spending this week from transactions, grouped by needs/wants
  let needsSpent = 0;
  let wantsSpent = 0;
  
  weekTransactions.forEach((tx) => {
    const category = categoriesMap[tx.merchant] ?? 'other';
    if (NEEDS_CATEGORIES.includes(category)) {
      needsSpent += tx.amount;
    } else if (WANTS_CATEGORIES.includes(category)) {
      wantsSpent += tx.amount;
    } else {
      // Unknown category defaults to wants
      wantsSpent += tx.amount;
    }
  });
  
  needsSpent = Math.round(needsSpent * 100) / 100;
  wantsSpent = Math.round(wantsSpent * 100) / 100;
  
  // Calculate reconciliation from categoriesTotals
  let needsCategoriesSum = 0;
  let wantsCategoriesSum = 0;
  
  Object.entries(categoriesTotals).forEach(([category, amount]) => {
    if (NEEDS_CATEGORIES.includes(category)) {
      needsCategoriesSum += amount;
    } else {
      wantsCategoriesSum += amount;
    }
  });
  
  needsCategoriesSum = Math.round(needsCategoriesSum * 100) / 100;
  wantsCategoriesSum = Math.round(wantsCategoriesSum * 100) / 100;
  
  const needsDelta = Math.abs(needsSpent - needsCategoriesSum);
  const wantsDelta = Math.abs(wantsSpent - wantsCategoriesSum);
  
  const needsLeft = Math.max(0, needsPlan - needsSpent);
  const wantsLeft = Math.max(0, wantsPlan - wantsSpent);
  const needsOver = Math.max(0, needsSpent - needsPlan);
  const wantsOver = Math.max(0, wantsSpent - wantsPlan);
  const needsPct = needsPlan > 0 ? Math.round((needsSpent / needsPlan) * 100) : 0;
  const wantsPct = wantsPlan > 0 ? Math.round((wantsSpent / wantsPlan) * 100) : 0;
  
  const savingsOver = Math.max(0, goalContributions - savingsTarget);
  const savingsPct = savingsTarget > 0 ? Math.round((goalContributions / savingsTarget) * 100) : 0;
  
  return {
    totalWeeklyMoney,
    spendingPlan,
    savingsTarget,
    needs: {
      plan: needsPlan,
      spent: needsSpent,
      left: needsLeft,
      over: needsOver,
      pct: needsPct,
    },
    wants: {
      plan: wantsPlan,
      spent: wantsSpent,
      left: wantsLeft,
      over: wantsOver,
      pct: wantsPct,
    },
    savings: {
      plan: savingsTarget,
      actual: goalContributions,
      over: savingsOver,
      pct: savingsPct,
    },
    reconciliation: {
      needsCategoriesSum,
      wantsCategoriesSum,
      needsDelta,
      wantsDelta,
    },
  };
}

export function getCategoryType(category: string): 'needs' | 'wants' {
  return NEEDS_CATEGORIES.includes(category) ? 'needs' : 'wants';
}

// Get current ISO week start (Monday)
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get days remaining in current week (including today)
export function getDaysRemainingInWeek(date: Date = new Date()): number {
  const day = date.getDay();
  // Days until Sunday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  // If today is Sunday (0), return 1, otherwise return days until Sunday
  return day === 0 ? 1 : 8 - day;
}

// Get transactions for current week
export function getWeekTransactions(transactions: Transaction[], date: Date = new Date()): Transaction[] {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= weekStart && txDate < weekEnd;
  });
}

// Calculate weekly spending totals
export function getWeeklySpent(transactions: Transaction[], date: Date = new Date()): number {
  const weekTxs = getWeekTransactions(transactions, date);
  return weekTxs.reduce((sum, tx) => sum + tx.amount, 0);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Get week reset day name
export function getResetDayName(): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(getWeekStart());
}

// Get current week key for tracking dismissals
export function getCurrentWeekKey(date: Date = new Date()): string {
  const weekStart = getWeekStart(date);
  return `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate()) / 7)}`;
}

// Get week date range string
export function getWeekRange(date: Date = new Date()): string {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${formatter.format(weekStart)} – ${formatter.format(weekEnd)}`;
}

// Currency formatter
export const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });