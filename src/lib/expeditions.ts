import type { MapViewState } from '@/types/map';

export interface Expedition {
  slug: string;
  peakName: string;
  elevationM: number;
  region: string;
  pageTitle: string;
  pageDescription: string;
  mapView: MapViewState;
}

export const EXPEDITIONS: Expedition[] = [
  {
    slug: 'kalanag',
    peakName: 'KALANAG',
    elevationM: 6387,
    region: 'Black Peak · Uttarakhand · India',
    pageTitle: 'PEAK — Kalanag Expedition Dashboard',
    pageDescription: '3D wireframe mountain mapping and expedition logistics for Kalanag (Black Peak)',
    mapView: { center: [78.5681, 31.0264], zoom: 12, pitch: 60, bearing: -20 },
  },
];

export function getExpedition(slug: string): Expedition | undefined {
  return EXPEDITIONS.find((e) => e.slug === slug);
}
