import type { MapViewState } from '@/types/map';

// Resolves to '' locally and '/peak' on GitHub Pages — consumed by all data fetches
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export interface ExpeditionConfig {
  peakName: string;
  elevationM: number;
  region: string;
  pageTitle: string;
  pageDescription: string;
  mapView: MapViewState;
  gpxPath: string;
}

export const EXPEDITION: ExpeditionConfig = {
  peakName: 'KALANAG',
  elevationM: 6387,
  region: 'Har-ki-Dun · Uttarakhand · India',
  pageTitle: 'PEAK — Kalanag Expedition Dashboard',
  pageDescription: '3D wireframe mountain mapping and expedition logistics for Kalanag (Black Peak)',
  mapView: {
    center: [78.5681, 31.0264],
    zoom: 12,
    pitch: 60,
    bearing: -20,
  },
  gpxPath: `${BASE_PATH}/data/route.gpx`,
};
