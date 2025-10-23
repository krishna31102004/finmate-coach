import type { Transaction } from '../store/useAppStore';

export function generateAlerts(
  transactions: Transaction[],
  categoriesTotals: Record<string, number>,
  budgets: { needs: number; wants: number; savings: number }
) {
  const alerts: { id: string; message: string }[] = [];
  if (categoriesTotals['food'] && categoriesTotals['food'] > 100) {
    alerts.push({ id: 'food-alert', message: 'Food spending is trending high this week.' });
  }
  // detect repeated merchants (subscriptions)
  const merchantCounts: Record<string, number> = {};
  transactions.forEach((tx) => {
    merchantCounts[tx.merchant] = (merchantCounts[tx.merchant] ?? 0) + 1;
  });
  Object.entries(merchantCounts).forEach(([merchant, count]) => {
    if (count > 3) {
      alerts.push({ id: `sub-${merchant}`, message: `Possible subscription detected: ${merchant}` });
    }
  });
  return alerts;
}