export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

export function totalWeight(items: { weight_g: number; qty: number }[]): number {
  return items.reduce((sum, item) => sum + item.weight_g * item.qty, 0);
}
