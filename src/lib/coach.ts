// Generate suggestions based on spending and local resources
export function generateSuggestions(
  categoriesTotals: Record<string, number>,
  budgets: { needs: number; wants: number; savings: number },
  resources: Record<string, any>
) {
  const suggestions: string[] = [];
  // If food spending is high, recommend pantry and meal prep
  if (categoriesTotals['food'] && categoriesTotals['food'] > 100) {
    if (resources.food_pantry) {
      suggestions.push(
        `Consider visiting ${resources.food_pantry.name}. ${resources.food_pantry.details}`
      );
    }
    suggestions.push('Try meal prepping to reduce food spending.');
    if (resources.credit_union) {
      suggestions.push(
        `Turn on round‑up savings to build your emergency fund, then deposit it into a high yield account at ${resources.credit_union.name}.`
      );
    }
  } else {
    suggestions.push('Great job staying within budget.');
    if (resources.transport_pass) {
      suggestions.push(
        `Use the ${resources.transport_pass.name} to save on commuting costs. ${resources.transport_pass.details}`
      );
    }
    if (resources.credit_union) {
      suggestions.push(
        `Consider opening a High Yield Savings Account with ${resources.credit_union.name} for better returns on your savings.`
      );
    }
  }
  return suggestions;
}