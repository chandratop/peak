'use client';
import { useExpeditionData } from './useExpeditionData';
import { parseWaypoints } from '@/lib/dataValidation';
const parse = (text: string) => parseWaypoints(JSON.parse(text));
export function useRouteWaypoints() { return useExpeditionData('route-waypoints.json', parse); }
