'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/lib/mapboxConfig';
import { useExpedition } from '@/lib/expeditionContext';
import { getBaseStyle } from './mapStyles';
import { addPlanningOutline, addTerrain, addContours, addGpxRoute, addWaypointMarkers, addSky, addHillshade } from './mapLayers';
import { useGpxTrack } from '@/hooks/useGpxTrack';
import { useRouteWaypoints } from '@/hooks/useRouteWaypoints';
import { useMapContext } from '@/lib/mapContext';

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, mapStyle } = useMapContext();
  const expedition = useExpedition();
  const gpx = useGpxTrack();
  const route = useRouteWaypoints();
  const latest = useRef({ gpx: gpx.geojson, route: route.data, style: mapStyle });
  latest.current = { gpx: gpx.geojson, route: route.data, style: mapStyle };
  const fittedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  function fitOverview(map: mapboxgl.Map) {
    const { gpx, route } = latest.current;
    if (fittedRef.current || !gpx || !route) return;
    const coordinates = gpx.geometry.type === 'LineString' ? gpx.geometry.coordinates : gpx.geometry.coordinates.flat();
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(p => bounds.extend([p[0], p[1]]));
    route.metadata.planning_outline?.forEach(p => bounds.extend([p.lng, p.lat]));
    const mobile = map.getContainer().clientWidth < 768;
    const height = map.getContainer().clientHeight;
    map.fitBounds(bounds, { padding: { top: 100, right: mobile ? 25 : 90, bottom: mobile ? Math.min(height * 0.5, height - 180) : 40, left: mobile ? 25 : 420 }, duration: 0, maxZoom: 11, pitch: 30, bearing: 0 });
    fittedRef.current = true;
  }

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;
    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({ container: containerRef.current, accessToken: MAPBOX_TOKEN, style: getBaseStyle(latest.current.style), ...expedition.mapView, antialias: true });
    } catch (err) { setError(err instanceof Error ? err.message : 'Map could not start'); return; }
    mapRef.current = map;
    fittedRef.current = false;
    const apply = () => {
      try {
        addTerrain(map);
        if (latest.current.style === 'wireframe') { addSky(map); addHillshade(map); addContours(map); }
        if (latest.current.route) {
          addWaypointMarkers(map, latest.current.route.waypoints);
          addPlanningOutline(map, latest.current.route.metadata.planning_outline);
        }
        if (latest.current.gpx) addGpxRoute(map, latest.current.gpx);
        fitOverview(map);
      } catch (err) { setError(err instanceof Error ? err.message : 'Map layers could not load'); }
    };
    map.on('style.load', apply);
    map.on('error', () => setError('Some map content could not load. Check your connection and Mapbox token.'));
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    return () => { map.remove(); mapRef.current = null; };
  }, [expedition, mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setError(null);
    // Full style replacement avoids partial sprite/glyph updates between style families.
    try { map.setStyle(getBaseStyle(mapStyle), { diff: false, localFontFamily: undefined, localIdeographFontFamily: undefined }); }
    catch { setError('Map style could not load'); }
  }, [mapStyle, mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      try {
        if (route.data) {
          addWaypointMarkers(map, route.data.waypoints);
          addPlanningOutline(map, route.data.metadata.planning_outline);
        }
        if (gpx.geojson) addGpxRoute(map, gpx.geojson);
        fitOverview(map);
      } catch { setError('Route overlay could not load'); }
    };
    if (map.isStyleLoaded()) update();
    else map.once('idle', update);
    return () => { map.off('idle', update); };
  }, [gpx.geojson, route.data, mapRef]);

  const message = !MAPBOX_TOKEN ? 'Set NEXT_PUBLIC_MAPBOX_TOKEN to display the map.' : error ?? gpx.error ?? route.error;
  return <><div ref={containerRef} className="w-full h-full" aria-label={`3D topographic map of ${expedition.peakName}`} />{route.data?.metadata.planning_outline && <div className="absolute top-20 right-3 bg-black/90 p-2 text-2xs text-neutral-300 border border-neutral-800 pointer-events-none">
    <p className="text-neon-orange">━━ Publisher approach</p><p className="text-neon-cyan">┄┄ Planning outline only</p><p>Not for navigation</p>
  </div>}{message && <p role="status" className="absolute top-40 right-3 max-w-64 bg-black/90 border border-neutral-700 p-3 text-xs text-orange-300">{message}</p>}</>;
}
