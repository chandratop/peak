'use client';
import { useExpeditionData } from './useExpeditionData';
import { parseGear } from '@/lib/dataValidation';
export function useGearManifest() {
  const { data, loading, error } = useExpeditionData('gear-manifest.csv', parseGear);
  return { items: data ?? [], loading, error };
}
