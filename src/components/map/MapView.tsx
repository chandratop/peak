'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, LAYER_IDS } from '@/lib/mapboxConfig';
import { useExpedition } from '@/lib/expeditionContext';
import { getBaseStyle } from './mapStyles';
import {
  addTerrain,
  addContours,
  addGpxRoute,
  addWaypointMarkers,
  addSky,
  addHillshade,
} from './mapLayers';
import { useGpxTrack } from '@/hooks/useGpxTrack';
import { useRouteWaypoints } from '@/hooks/useRouteWaypoints';
import { useMapContext } from '@/lib/mapContext';

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, mapStyle } = useMapContext();
  const expedition = useExpedition();
  const { geojson: gpxGeoJson } = useGpxTrack();
  const { data: routeData } = useRouteWaypoints();

  // Refs so the styledata handler can always read the latest data
  const gpxRef = useRef(gpxGeoJson);
  const routeRef = useRef(routeData);
  useEffect(() => { gpxRef.current = gpxGeoJson; }, [gpxGeoJson]);
  useEffect(() => { routeRef.current = routeData; }, [routeData]);

  function applyCustomLayers(map: mapboxgl.Map, mode: typeof mapStyle) {
    addTerrain(map);
    if (mode === 'wireframe') {
      addSky(map);
      addHillshade(map);
      addContours(map);
    }
    if (routeRef.current) addWaypointMarkers(map, routeRef.current.waypoints);
    if (gpxRef.current) addGpxRoute(map, gpxRef.current);
  }

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: getBaseStyle('wireframe') as any,
      center: expedition.mapView.center,
      zoom: expedition.mapView.zoom,
      pitch: expedition.mapView.pitch,
      bearing: expedition.mapView.bearing,
      antialias: true,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'bottom-right'
    );

    mapRef.current = map;

    map.on('load', () => applyCustomLayers(map, 'wireframe'));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to style mode changes — skip the very first render (map init handles that)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const map = mapRef.current;
    if (!map) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.setStyle(getBaseStyle(mapStyle) as any);

    // 'style.load' fires exactly once when the new style is fully ready
    const onStyleLoad = () => applyCustomLayers(map, mapStyle);
    map.once('style.load', onStyleLoad);

    return () => { map.off('style.load', onStyleLoad); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // Add waypoint markers once route data arrives (initial load)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeData) return;
    const add = () => {
      if (!map.getSource(LAYER_IDS.waypointSourceId)) {
        addWaypointMarkers(map, routeData.waypoints);
      }
    };
    map.isStyleLoaded() ? add() : map.once('load', add);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeData]);

  // Add GPX route once GPX data arrives (initial load)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !gpxGeoJson) return;
    const add = () => {
      if (!map.getSource(LAYER_IDS.routeSourceId)) {
        addGpxRoute(map, gpxGeoJson);
      }
    };
    map.isStyleLoaded() ? add() : map.once('load', add);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpxGeoJson]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      aria-label={`3D topographic map of ${expedition.peakName}`}
    />
  );
}
