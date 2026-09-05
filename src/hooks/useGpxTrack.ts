'use client';
import { useExpeditionData } from './useExpeditionData';
import { parseGpxTrack } from '@/lib/parseGpx';
export function useGpxTrack() {
  const { data, loading, error } = useExpeditionData('route.gpx', parseGpxTrack);
  return { geojson: data, loading, error };
}
