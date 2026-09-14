export type GearStatus = 'packed' | 'pending';
export type GearPriority = 'critical' | 'optional';
export type RucksackPlacement = 'yes' | 'no' | 'all but one';
export type GearCategory =
  | 'clothing'
  | 'shelter'
  | 'navigation'
  | 'food'
  | 'medical'
  | 'technical'
  | 'electronics'
  | 'misc';

export interface GearItem {
  item_name: string;
  category: GearCategory;
  weight_g: number;
  qty: number;
  status: GearStatus;
  priority: GearPriority;
  in_rucksack: RucksackPlacement;
}
