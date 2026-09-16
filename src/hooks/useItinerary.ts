'use client';
import { useExpeditionData } from './useExpeditionData';
import { parseItinerary } from '@/lib/dataValidation';
export function useItinerary() {
  const { data, loading, error } = useExpeditionData('itinerary.csv', parseItinerary);
  return { days: data ?? [], loading, error };
}
