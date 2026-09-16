export type ItineraryDayType = 'drive' | 'trek' | 'mixed' | 'mountaineering';

export interface ItineraryDay {
  day: number;
  date: string;
  route: string;
  altitude_m?: number;
  type: ItineraryDayType;
  duration: string;
  accommodation: string;
  network: string;
  notes?: string;
}
