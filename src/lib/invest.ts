export function projectBalance(weekly: number, years: number, rate: number) {
  const yearlyRate = rate / 100;
  const results: { year: number; balance: number }[] = [];
  let balance = 0;
  for (let year = 1; year <= years; year++) {
    balance += weekly * 52;
    balance *= 1 + yearlyRate;
    results.push({ year, balance: parseFloat(balance.toFixed(2)) });
  }
  return results;
}