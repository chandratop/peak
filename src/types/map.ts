export interface MapViewState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface LayerConfig {
  terrainSourceId: string;
  hillshadeSourceId: string;
  terrainExaggeration: number;
  contourSourceId: string;
  contourLayerId: string;
  routeSourceId: string;
  routeLayerId: string;
  routeGlowLayerId: string;
  waypointSourceId: string;
  waypointLayerId: string;
}
