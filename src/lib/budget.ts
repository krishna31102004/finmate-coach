import type { Transaction } from '../store/useAppStore';

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