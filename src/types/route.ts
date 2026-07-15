export type CampType = 'basecamp' | 'camp' | 'highcamp' | 'summit' | 'waypoint';

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation_m: number;
  camp_type: CampType;
  description?: string;
  distance_from_start_km?: number;
  // Optional — grade range for the segment arriving AT this waypoint (from previous)
  max_grade_pct?: number;
  min_grade_pct?: number;
}

export interface RouteMetadata {
  route_name: string;
  peak_name: string;
  summit_elevation_m: number;
  total_distance_km: number;
  total_gain_m: number;
  region: string;
}

export interface RouteWaypointsFile {
  metadata: RouteMetadata;
  waypoints: Waypoint[];
}
