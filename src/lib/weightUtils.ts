export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

export function totalWeight(items: { weight_g: number; qty: number }[]): number {
  return items.reduce((sum, item) => sum + item.weight_g * item.qty, 0);
}

interface PlacedItem {
  weight_g: number;
  qty: number;
  in_rucksack: 'yes' | 'no' | 'all but one';
}

// 'all but one' carries exactly one unit outside the rucksack; the rest is packed.
export function nonRucksackWeight(items: PlacedItem[]): number {
  return items.reduce((sum, item) => {
    if (item.in_rucksack === 'no') return sum + item.weight_g * item.qty;
    if (item.in_rucksack === 'all but one') return sum + item.weight_g;
    return sum;
  }, 0);
}

export function rucksackWeight(items: PlacedItem[]): number {
  return totalWeight(items) - nonRucksackWeight(items);
}
